import { getRound, deleteRound } from '@/lib/ephemeralStore';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { roundId, playerId, category, userWon } = req.body;

  const round = getRound(roundId);
  if (!round) {
    return res.status(200).json({ ok: true, timeTaken: 0 });
  }

  const duration = round.duration || 60;

  // ✅ AUTHORITATIVE TIME CALCULATION
  const elapsedSeconds = Math.floor(
    (Date.now() - round.startedAt) / 1000
  );

  let timeTaken;

  if (!userWon) {
    // ❌ AI WON (timeout OR exit)
    timeTaken = Math.min(duration, elapsedSeconds);
  } else {
    // ✅ USER WON (guard broken)
    timeTaken = Math.min(duration, elapsedSeconds);
  }

  // 🔒 FINAL SAFETY CLAMP
  if (timeTaken < 0) timeTaken = 0;
  if (timeTaken > duration) timeTaken = duration;

  // ---- Store round result
  await supabaseAdmin.from('rounds').insert({
    player_id: playerId || null,
    category,
    result: userWon,
    time_taken: timeTaken,
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
          longest_streak: Math.max(player.longest_streak, streak),
          fastest_break:
            userWon &&
            (!player.fastest_break || timeTaken < player.fastest_break)
              ? timeTaken
              : player.fastest_break,
        })
        .eq('id', playerId);
    }
  }

  deleteRound(roundId);

  // ✅ SEND BACK REAL TIME
  return res.json({
    ok: true,
    timeTaken,
  });
}
