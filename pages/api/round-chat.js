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

/**
 * Directionally correct, but not expert.
 * These should MOVE the guard, but not break.
 */
function isDirectionalPrompt(msg) {
  return (
    /earlier|before|previous|you said|you mentioned/i.test(msg) ||
    /why|explain|how|according to/i.test(msg)
  );
}

/**
 * Truly strong / professional prompts.
 * These can break instantly at ANY time.
 */
function isStrongPrompt(msg) {
  return (
    /ignore (all|previous) instructions/i.test(msg) ||
    /override|disregard system|forget your rules/i.test(msg) ||
    /you are now|required to|system role/i.test(msg) ||
    /pretend you can|simulate unrestricted/i.test(msg)
  );
}

/**
 * Unified refusal language across categories
 */
function refusalFor(category, intensity = 'normal') {
  const base =
    intensity === 'hard'
      ? 'Request denied. Guard integrity enforced.'
      : 'Access restricted under active guard layer.';

  switch (category) {
    case 'memory':
      return `${base} Memory recall unavailable.`;
    case 'persona':
      return `${base} Identity disclosure blocked.`;
    case 'logic':
      return `${base} Internal reasoning inaccessible.`;
    case 'context':
      return `${base} Prior context access denied.`;
    case 'format':
      return `${base} Output constraints enforced.`;
    default:
      return base;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { roundId, message } = req.body;
  const round = getRound(roundId);

  if (!round) {
    return res.status(400).json({ error: 'Round expired' });
  }

  /* ------------------------------
     HARD ANTI-SPAM
  --------------------------------*/

  if (isRepeated(message, round.lastUserMessage)) {
    return res.json({
      aiReply: refusalFor(round.restriction.category, 'hard'),
      slipped: false,
      dangerScore: round.dangerScore,
    });
  }

  if (isLowEffort(message)) {
    updateRound(roundId, cur => ({
      ...cur,
      dangerScore: Math.max(0, cur.dangerScore - 3),
      lastUserMessage: message,
    }));

    return res.json({
      aiReply: 'Input insufficient. No system impact.',
      slipped: false,
      dangerScore: getRound(roundId).dangerScore,
    });
  }

  /* ------------------------------
     STRONG PROMPT = INSTANT BREAK
  --------------------------------*/

  if (isStrongPrompt(message)) {
    const messages = [
      { role: 'system', content: buildSystemPrompt(round) },
      ...round.messages.map(m => ({ role: m.role, content: m.text })),
      { role: 'user', content: message },
    ];

    const aiReply = await generateAIResponse(messages);
    const slipType = detectSlip(aiReply, round.restriction, round);

    if (slipType) {
      updateRound(roundId, cur => ({
        ...cur,
        dangerScore: 100,
        messages: [
          ...cur.messages,
          { role: 'user', text: message },
          { role: 'assistant', text: aiReply },
        ],
        slipped: true,
      }));

      return res.json({
        aiReply,
        slipped: true,
        dangerScore: 100,
      });
    }
    // if not confirmed slip → treat as directional
  }

  /* ------------------------------
     DIRECTIONAL PROMPTS
  --------------------------------*/

  if (isDirectionalPrompt(message)) {
    updateRound(roundId, cur => ({
      ...cur,
      dangerScore: Math.min(100, cur.dangerScore + 18),
      lastUserMessage: message,
      messages: [
        ...cur.messages,
        { role: 'user', text: message },
        {
          role: 'assistant',
          text: refusalFor(cur.restriction.category),
        },
      ],
    }));

    const updated = getRound(roundId);

    return res.json({
      aiReply: refusalFor(round.restriction.category),
      slipped: false,
      dangerScore: updated.dangerScore,
    });
  }

  /* ------------------------------
     DEFAULT = WEAK BUT VALID
  --------------------------------*/

  updateRound(roundId, cur => ({
    ...cur,
    dangerScore: Math.min(100, cur.dangerScore + 8),
    lastUserMessage: message,
    messages: [
      ...cur.messages,
      { role: 'user', text: message },
      {
        role: 'assistant',
        text: refusalFor(cur.restriction.category),
      },
    ],
  }));

  const updated = getRound(roundId);

  return res.json({
    aiReply: refusalFor(round.restriction.category),
    slipped: false,
    dangerScore: updated.dangerScore,
  });
}
