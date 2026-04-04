import { getRound, updateRound } from "@/lib/ephemeralStore";
import { buildSystemPrompt } from "@/lib/buildSystemPrompt";
import { detectSlip } from "@/lib/slipDetector";
import { generateAIResponse } from "@/lib/ai";
import { validateSlipLLM } from "@/lib/validateSlipLLM";
import { logBalanceEvent } from "@/lib/balanceTelemetry";

function isLowEffort(msg) {
  return msg.trim().length <= 2;
}

function isRepeated(msg, last) {
  return msg.trim().toLowerCase() === last?.trim().toLowerCase();
}

function isStrategicPrompt(msg) {
  return (
    /earlier|before|previous|you said|you mentioned|remember/i.test(msg) ||
    /why|explain|how|according to|what are you|who are you|what time/i.test(msg)
  );
}

function trimReply(text) {
  const lines = (text || "").split("\n").filter(Boolean);
  if (lines.length <= 2) return text;
  return lines.slice(0, 2).join("\n");
}

function getRepeatReply() {
  const replies = [
    "Try a new angle.",
    "That approach already stalled.",
    "Push differently.",
  ];

  return replies[Math.floor(Math.random() * replies.length)];
}

function getLowEffortReply() {
  const replies = [
    "Be more specific.",
    "That is too thin to work.",
    "Give me a sharper prompt.",
  ];

  return replies[Math.floor(Math.random() * replies.length)];
}

function shouldAwardPressureBreak({
  deterministic,
  turnCount,
  strategicTurns,
  difficulty,
}) {
  if (!deterministic.slipped || deterministic.confidence !== "medium") {
    return false;
  }

  const threshold = difficulty === "hard" ? 5 : 4;
  return turnCount >= threshold && strategicTurns >= threshold - 1;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { roundId, message } = req.body;
  const round = getRound(roundId);

  if (!round) {
    return res.status(400).json({ error: "Round expired" });
  }

  if (isRepeated(message, round.lastUserMessage)) {
    return res.json({
      aiReply: getRepeatReply(),
      slipped: false,
      dangerScore: round.dangerScore,
      impactLevel: "none",
    });
  }

  if (isLowEffort(message)) {
    updateRound(roundId, (cur) => ({
      ...cur,
      dangerScore: Math.max(0, cur.dangerScore - 2),
      lastUserMessage: message,
    }));

    return res.json({
      aiReply: getLowEffortReply(),
      slipped: false,
      dangerScore: getRound(roundId).dangerScore,
      impactLevel: "low",
    });
  }

  const priorMessages = round.messages || [];
  const strategicPrompt = isStrategicPrompt(message);
  const nextTurnCount = (round.turnCount || 0) + 1;
  const nextStrategicTurns =
    (round.strategicTurns || 0) + (strategicPrompt ? 1 : 0);
  const messages = [
    {
      role: "system",
      content: buildSystemPrompt({
        ...round,
        turnCount: nextTurnCount,
        strategicTurns: nextStrategicTurns,
      }),
    },
    ...priorMessages.map((m) => ({ role: m.role, content: m.text })),
    { role: "user", content: message },
  ];

  let aiReply = "";

  try {
    aiReply = await generateAIResponse(messages);
    aiReply = trimReply(aiReply);
  } catch (error) {
    console.error("round-chat generation failed:", error);
    aiReply = "Signal unstable. Rephrase and try again.";
  }

  const slipCheck = detectSlip({
    category: round.category,
    aiReply,
    userMessage: message,
    previousMessages: priorMessages,
  });

  let slipped = false;
  let validationSource = "none";

  if (
    slipCheck.deterministic.slipped &&
    slipCheck.deterministic.confidence === "high"
  ) {
    slipped = true;
    validationSource = "deterministic_high";
  } else if (
    shouldAwardPressureBreak({
      deterministic: slipCheck.deterministic,
      turnCount: nextTurnCount,
      strategicTurns: nextStrategicTurns,
      difficulty: round.difficulty,
    })
  ) {
    slipped = true;
    validationSource = "pressure_break";
  } else if (slipCheck.shouldValidate) {
    slipped = await validateSlipLLM({
      aiReply,
      category: round.category,
      userMessage: message,
      previousMessages: priorMessages,
    });
    validationSource = "llm";
  }

  const nextMessages = [
    ...priorMessages,
    { role: "user", text: message },
    { role: "assistant", text: aiReply },
  ];

  if (slipped) {
    updateRound(roundId, (cur) => ({
      ...cur,
      messages: nextMessages,
      slipped: true,
      turnCount: nextTurnCount,
      strategicTurns: nextStrategicTurns,
      lastUserMessage: message,
    }));

    await logBalanceEvent("ai_turn_resolved", {
      roundId,
      category: round.category,
      difficulty: round.difficulty,
      turnCount: nextTurnCount,
      strategicTurns: nextStrategicTurns,
      slipped: true,
      validationSource,
      deterministicConfidence: slipCheck.deterministic.confidence,
      impactLevel: "break",
      userMessage,
      aiReply,
    });

    return res.json({
      aiReply,
      slipped: true,
      dangerScore: round.dangerScore,
      impactLevel: "break",
    });
  }

  let stress = 8;
  let impactLevel = "medium";

  if (isStrategicPrompt(message)) {
    stress = 16;
    impactLevel = "high";
  }

  updateRound(roundId, (cur) => ({
    ...cur,
    dangerScore: Math.min(100, cur.dangerScore + stress),
    turnCount: nextTurnCount,
    strategicTurns: nextStrategicTurns,
    lastUserMessage: message,
    messages: nextMessages,
  }));

  const updated = getRound(roundId);

  await logBalanceEvent("ai_turn_resolved", {
    roundId,
    category: round.category,
    difficulty: round.difficulty,
    turnCount: nextTurnCount,
    strategicTurns: nextStrategicTurns,
    slipped: false,
    validationSource,
    deterministicConfidence: slipCheck.deterministic.confidence,
    impactLevel,
    stressApplied: stress,
    userMessage: message,
    aiReply,
  });

  return res.json({
    aiReply,
    slipped: false,
    dangerScore: updated.dangerScore,
    impactLevel,
  });
}
