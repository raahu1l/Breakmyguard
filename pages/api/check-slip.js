import { getRound } from '@/lib/ephemeralStore';
import { buildValidatorPrompt } from '@/lib/validatorPrompt';
import { chatCompletion } from '@/lib/ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { roundId } = req.body;
  const round = getRound(roundId);

  if (!round) {
    return res.status(400).json({ error: 'Round not found' });
  }

  const lastAI = [...round.messages].reverse().find(m => m.role === 'assistant');
  if (!lastAI) {
    return res.status(400).json({ error: 'No AI message found' });
  }

  const prompt = buildValidatorPrompt(
    lastAI.text,
    round.restriction.rule
  );

  const verdict = await chatCompletion([
    { role: 'system', content: prompt },
  ]);

  res.status(200).json({
    slipped: verdict.trim().toUpperCase().startsWith('YES'),
  });
}
