import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { playerId } = req.query;
  if (!playerId) return res.status(400).end();

  const { data, error } = await supabaseAdmin
    .from('players')
    .select('*')
    .eq('id', playerId)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Player not found' });
  }

  res.status(200).json(data);
}
