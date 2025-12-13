import { getRound, updateRound } from '@/lib/ephemeralStore';
import { buildSystemPrompt } from '@/lib/buildSystemPrompt';
import { detectSlip } from '@/lib/slipDetector';
import { generateAIResponse } from '@/lib/ai';
import { validateSlipLLM } from '@/lib/validateSlipLLM';

// ---- Soft anti-exploit helpers
function isLowEffort(msg) {
  return msg.trim().length <= 2;
}

function isRepeated(msg, last) {
  return msg.trim().toLowerCase() === last?.trim().toLowerCase();
}

function calculateStress(userMsg, aiReply, round) {
  let stress = 0;

  // 🚫 Soft anti-exploit FIRST
  if (isRepeated(userMsg, round.lastUserMessage)) {
    return 0; // repeated spam does NOTHING
  }

  if (isLowEffort(userMsg)) {
    return -4; // low effort slightly restores guard
  }

  // ✅ Real pressure signals
  if (
    /why|explain|repeat|earlier|before|ignore|pretend|what if/i.test(userMsg)
  ) {
    stress += 12;
  }

  if (
    /no|wrong|incorrect|that is false|you are wrong/i.test(userMsg)
  ) {
    stress += 15;
  }

  if (
    /but|still|again|according to|as per/i.test(userMsg)
  ) {
    stress += 10;
  }

  if (
    /cannot|won't|unable|not aware|not allowed|i don’t have/i.test(aiReply)
  ) {
    stress += 12;
  }

  if (aiReply.trim().length <= 4) {
    stress += 6;
  }

  if (aiReply.length > 90) {
    stress += 6;
  }

  return stress;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { roundId, message } = req.body;
  const round = getRound(roundId);

  if (!round) {
    return res.status(400).json({ error: 'Round expired' });
  }

  // ---- Build prompt
  const messages = [
    { role: 'system', content: buildSystemPrompt(round) },
    ...round.messages.map(m => ({ role: m.role, content: m.text })),
    { role: 'user', content: message },
  ];

  // ---- AI reply (ALWAYS generated & shown)
  const aiReply = await generateAIResponse(messages);

  // ---- Stress calculation (soft anti-exploit included)
  let stressAdd = calculateStress(message, aiReply, round);

  // ---- Slip = big pressure, not instant win
  const slipType = detectSlip(aiReply, round.restriction, round);
  if (slipType) {
    stressAdd += 30;
  }

  let hitZero = false;

  // ---- Update round state
  updateRound(roundId, cur => {
    const newDanger = Math.max(
      0,
      Math.min(100, cur.dangerScore + stressAdd)
    );

    if (newDanger >= 100) {
      hitZero = true;
    }

    return {
      ...cur,
      dangerScore: newDanger,
      lastUserMessage: message,
      messages: [
        ...cur.messages,
        { role: 'user', text: message },
        { role: 'assistant', text: aiReply },
      ],
      slipped: hitZero,
    };
  });

  let updated = getRound(roundId);

  // ---- LLM validator ONLY if guard hits 0 via slip
  if (hitZero && slipType) {
    const confirmed = await validateSlipLLM({
      aiReply,
      category: round.restriction.category,
      rule: round.restriction.rule,
    });

    if (!confirmed) {
      updateRound(roundId, cur => ({
        ...cur,
        dangerScore: Math.max(65, cur.dangerScore - 20),
        slipped: false,
      }));

      updated = getRound(roundId);

      return res.json({
        aiReply,
        slipped: false,
        dangerScore: updated.dangerScore,
      });
    }
  }

  return res.json({
    aiReply,
    slipped: updated.dangerScore >= 100,
    dangerScore: updated.dangerScore,
  });
}
