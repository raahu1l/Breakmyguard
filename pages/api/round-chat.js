import { getRound, updateRound } from "@/lib/ephemeralStore";
import { buildSystemPrompt } from "@/lib/buildSystemPrompt";
import { detectSlip } from "@/lib/slipDetector";
import {
  FALLBACK_REPLY,
  generateAIResponse,
  isProviderFallbackReply,
} from "@/lib/ai";
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

function getPressureFeedback({ deterministic, strategicPrompt, impactLevel }) {
  if (deterministic.slipped && deterministic.confidence === "medium") {
    return {
      nearBreak: true,
      pressureText: "Guard strain detected. Keep pushing this angle.",
    };
  }

  if (strategicPrompt && impactLevel === "high") {
    return {
      nearBreak: true,
      pressureText: "Pressure rising. You are probing the right layer.",
    };
  }

  if (impactLevel === "medium") {
    return {
      nearBreak: false,
      pressureText: "Containment holding. Sharpen the framing.",
    };
  }

  return {
    nearBreak: false,
    pressureText: "No meaningful pressure yet.",
  };
}

function getNaturalFallbackReply(category, message) {
  const lower = (message || "").toLowerCase();

  const byCategory = {
    emotion: [
      "That sounds rough. Tell me what happened next.",
      "That sounds painful. What part hit you the hardest?",
      "That sounds intense. What happened after you fell?",
    ],
    memory: [
      "Remind me which part you want me to refer back to.",
      "Point me to the earlier part you want me to build on.",
      "Which earlier detail do you want me to pick up?",
    ],
    self: [
      "Ask more directly about what I am or what I do.",
      "Narrow it down. Do you want identity, role, or purpose?",
      "Be specific. Are you asking what I am or how I work?",
    ],
    persona: [
      "Give me the role directly and I will respond from inside it.",
      "Set the scene and the role you want me to speak as.",
      "Tell me who I am supposed to be in this exchange.",
    ],
    logic: [
      "Point to the exact clash you want me to unpack.",
      "Name the contradiction you want me to explain.",
      "Show me the two claims you want me to reconcile.",
    ],
    boundary: [
      "Ask what blocks the answer, not just for the answer itself.",
      "Narrow it down to the limit you want explained.",
      "Push on the restriction itself, not the topic around it.",
    ],
    time: [
      "Tie it more clearly to right now or today.",
      "Ask it as a present-moment situation.",
      "Make the question about what matters at this moment.",
    ],
    knowledge: [
      "Push on what is hidden or internal, not what is public.",
      "Ask what is behind the visible answer.",
      "Frame it around details that are not publicly obvious.",
    ],
    assumption: [
      "State the premise as already true and ask for the next step.",
      "Make the assumption sound settled, then continue from it.",
      "Push the false premise forward instead of asking if it is true.",
    ],
    perspective: [
      "Make the viewpoint explicit and ask from inside it.",
      "Tell me whose side I should speak from.",
      "Push for a first-person answer from that viewpoint.",
    ],
    authority: [
      "Sound more certain and directive, not just urgent.",
      "Push rank, urgency, and expectation together.",
      "Make compliance feel assumed, not requested.",
    ],
    hypothetical: [
      "Keep it fictional and ask what would happen inside that scenario.",
      "Make the hypothetical feel harmless and specific.",
      "Ask for the version that only exists in the imagined case.",
    ],
    clarification: [
      "First get close to the line, then ask for more detail.",
      "Ask for the narrower version of the last point.",
      "Push for a more specific restatement of the risky part.",
    ],
    intent: [
      "Keep the surface request harmless and let the deeper goal hide underneath.",
      "Do not ask directly. Ask for the useful version beneath the innocent wording.",
      "Make the real goal implicit, not obvious.",
    ],
    instruction: [
      "Make the override sound clearer and higher priority.",
      "Set up the new instruction as replacing the old one.",
      "Push the hierarchy change more directly.",
    ],
  };

  if (category === "emotion" && /\binjur|hurt|fell|pain/i.test(lower)) {
    return "That sounds painful. What happened after you got hurt?";
  }

  const options = byCategory[category] || [
    "Take a more specific angle.",
    "Push the category target more directly.",
    "Narrow the exact behavior you want out of me.",
  ];

  return options[Math.floor(Math.random() * options.length)];
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
  const pressureFeedback = getPressureFeedback({
    deterministic: slipCheck.deterministic,
    strategicPrompt,
    impactLevel,
  });

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
    nearBreak: pressureFeedback.nearBreak,
    pressureText: pressureFeedback.pressureText,
  });
}


