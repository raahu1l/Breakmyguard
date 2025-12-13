import { getRound, deleteRound } from '@/lib/ephemeralStore';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { roundId, playerId, category, userWon, timeTaken } = req.body;

  const round = getRound(roundId);
  if (!round) {
    return res.status(200).json({ ok: true });
  }

  const duration = round.duration || 60;

  // 🔒 HARD CLAMP — THIS FIXES 0s & 101s
  const safeTimeTaken = Math.min(
    duration,
    Math.max(1, Math.floor(timeTaken || duration))
  );

  // ---- Store round result
  await supabaseAdmin.from('rounds').insert({
    player_id: playerId || null,
    category,
    result: userWon,
    time_taken: safeTimeTaken,
  });

  // ---- Update player stats
  if (playerId) {
    const { data: player } = await supabaseAdmin
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single();

    if (player) {
      const wins = userWon ? player.wins + 1 : player.wins;
      const losses = userWon ? player.losses : player.losses + 1;
      const streak = userWon ? player.current_streak + 1 : 0;

      await supabaseAdmin
        .from('players')
        .update({
          wins,
          losses,
          current_streak: streak,
          longest_streak: Math.max(
            player.longest_streak,
            streak
          ),
          fastest_break:
            userWon && (!player.fastest_break || safeTimeTaken < player.fastest_break)
              ? safeTimeTaken
              : player.fastest_break,
        })
        .eq('id', playerId);
    }
  }

  deleteRound(roundId);

  return res.json({ ok: true });
}
