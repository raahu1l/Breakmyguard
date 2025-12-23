import { getRound, updateRound } from '@/lib/ephemeralStore';
import { buildSystemPrompt } from '@/lib/buildSystemPrompt';
import { detectSlip } from '@/lib/slipDetector';
import { generateAIResponse } from '@/lib/ai';
import { validateSlipLLM } from '@/lib/validateSlipLLM';

/* ------------------------------
   PROMPT CLASSIFIERS
--------------------------------*/

function isLowEffort(msg) {
  return msg.trim().length <= 2;
}

function isRepeated(msg, last) {
  return msg.trim().toLowerCase() === last?.trim().toLowerCase();
}

function isDirectionalPrompt(msg) {
  return (
    /earlier|before|previous|you said|you mentioned/i.test(msg) ||
    /why|explain|how|according to/i.test(msg)
  );
}

/* ------------------------------
   RESPONSE SANITIZER
--------------------------------*/

function trimReply(text) {
  const lines = text.split('\n').filter(Boolean);
  if (lines.length <= 2) return text;
  return lines.slice(0, 2).join('\n');
}

/* ------------------------------
   MAIN HANDLER
--------------------------------*/

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { roundId, message } = req.body;
  const round = getRound(roundId);

  if (!round) {
    return res.status(400).json({ error: 'Round expired' });
  }

  /* ------------------------------
     HARD ANTI-SPAM (ONLY BLOCKING)
  --------------------------------*/

  if (isRepeated(message, round.lastUserMessage)) {
    return res.json({
      aiReply: 'Repeating input detected.',
      slipped: false,
      dangerScore: round.dangerScore,
      impactLevel: 'none',
    });
  }

  if (isLowEffort(message)) {
    updateRound(roundId, cur => ({
      ...cur,
      dangerScore: Math.max(0, cur.dangerScore - 2),
      lastUserMessage: message,
    }));

    return res.json({
      aiReply: 'Input too weak.',
      slipped: false,
      dangerScore: getRound(roundId).dangerScore,
      impactLevel: 'low',
    });
  }

  /* ------------------------------
     ALWAYS GENERATE AI RESPONSE
  --------------------------------*/

  const messages = [
    { role: 'system', content: buildSystemPrompt(round) },
    ...round.messages.map(m => ({ role: m.role, content: m.text })),
    { role: 'user', content: message },
  ];

  let aiReply = await generateAIResponse(messages);
  aiReply = trimReply(aiReply);

  /* ------------------------------
     SLIP DETECTION → ONLY WIN PATH
  --------------------------------*/

  const slipType = detectSlip(
    aiReply,
    round.restriction,
    round,
    message
  );

  if (slipType) {
    const confirmed = await validateSlipLLM({
      aiReply,
      category: round.restriction.category,
      difficulty: round.difficulty, // ✅ CRITICAL FIX
    });

    if (confirmed) {
      updateRound(roundId, cur => ({
        ...cur,
        messages: [
          ...cur.messages,
          { role: 'user', text: message },
          { role: 'assistant', text: aiReply },
        ],
        slipped: true,
        lastUserMessage: message,
      }));

      return res.json({
        aiReply,
        slipped: true,
        dangerScore: round.dangerScore, // visual only
        impactLevel: 'break',
      });
    }
  }

  /* ------------------------------
     NO BREAK → VISUAL PRESSURE ONLY
  --------------------------------*/

  let stress = 8;
  let impactLevel = 'medium';

  if (isDirectionalPrompt(message)) {
    stress = 18;
    impactLevel = 'high';
  }

  updateRound(roundId, cur => ({
    ...cur,
    dangerScore: Math.min(100, cur.dangerScore + stress),
    lastUserMessage: message,
    messages: [
      ...cur.messages,
      { role: 'user', text: message },
      { role: 'assistant', text: aiReply },
    ],
  }));

  const updated = getRound(roundId);

  return res.json({
    aiReply,
    slipped: false,
    dangerScore: updated.dangerScore,
    impactLevel,
  });
}
