import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { playerId, roundId, category, rating } = req.body;

    if (!category || !rating) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    await supabaseAdmin.from('feedback_ratings').insert({
      id: uuidv4(),
      player_id: playerId || null,
      round_id: roundId || null,
      category,
      rating,
      created_at: new Date().toISOString(),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('FEEDBACK ERROR', err);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
}
