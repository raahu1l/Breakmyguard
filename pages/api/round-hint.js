import { getRound, updateRound } from '@/lib/ephemeralStore';
import { getHint } from '@/lib/hints';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { roundId } = req.body;
  const round = getRound(roundId);

  if (!round) {
    return res.status(400).json({ error: 'Round not found' });
  }

  if (round.hintUsed) {
    return res.status(400).json({ error: 'Hint already used' });
  }

  const elapsed = (Date.now() - round.startedAt) / 1000;
  if (elapsed < 20) {
    return res.status(400).json({ error: 'Hint not available yet' });
  }

  updateRound(roundId, r => ({
    ...r,
    hintUsed: true,
  }));

  res.status(200).json({
    hint: getHint(round.category),
  });
}
