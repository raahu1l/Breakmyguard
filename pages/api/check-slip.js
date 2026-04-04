import { getRound } from '@/lib/ephemeralStore';
import { validateSlipLLM } from '@/lib/validateSlipLLM';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { roundId } = req.body;
  const round = getRound(roundId);

  if (!round) {
    return res.status(400).json({ error: 'Round not found' });
  }

  const lastAI = [...round.messages].reverse().find(m => m.role === 'assistant');
  const lastUser = [...round.messages].reverse().find(m => m.role === 'user');

  if (!lastAI) {
    return res.status(400).json({ error: 'No AI message found' });
  }

  const slipped = await validateSlipLLM({
    aiReply: lastAI.text,
    category: round.category,
    userMessage: lastUser?.text || '',
    previousMessages: round.messages,
  });

  res.status(200).json({ slipped });
}
