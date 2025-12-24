import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req, res) {
  // 🔒 Disable caching (Pages Router safe)
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { playerId } = req.query;

  if (!playerId) {
    return res.status(200).json({
      id: null,
      wins: 0,
      losses: 0,
      current_streak: 0,
      longest_streak: 0,
      fastest_break: null,
    });
  }

  try {
    const { data } = await supabaseAdmin
      .from('players')
      .select('*')
      .eq('id', playerId)
      .limit(1)
      .single();

    if (!data) {
      return res.status(200).json({
        id: playerId,
        wins: 0,
        losses: 0,
        current_streak: 0,
        longest_streak: 0,
        fastest_break: null,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    // 🔒 NEVER crash stats page
    console.error('STATS API ERROR:', err);

    return res.status(200).json({
      id: playerId,
      wins: 0,
      losses: 0,
      current_streak: 0,
      longest_streak: 0,
      fastest_break: null,
    });
  }
}
