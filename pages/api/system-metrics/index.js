import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const [{ count: rounds }, { count: players }] = await Promise.all([
    supabaseAdmin.from('rounds').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('players').select('*', { count: 'exact', head: true }),
  ]);

  return res.status(200).json({
    totalRounds: rounds || 0,
    totalPlayers: players || 0,
  });
}
