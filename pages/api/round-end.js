import { getRound, deleteRound } from '@/lib/ephemeralStore';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { roundId, playerId, category, userWon } = req.body;

    const round = getRound(roundId);
    if (!round) {
      return res.status(200).json({ ok: true, timeTaken: 0 });
    }

    const duration = round.duration || 60;
    const elapsedSeconds = Math.floor(
      (Date.now() - round.startedAt) / 1000
    );

    const timeTaken = Math.min(duration, Math.max(0, elapsedSeconds));

    // ---- Always store round (never block UI)
    await supabaseAdmin.from('rounds').insert({
      player_id: playerId || null,
      category,
      result: userWon,
      time_taken: timeTaken,
    });

    // ---- Ensure player exists + update stats
    if (playerId) {
      const { data: player } = await supabaseAdmin
        .from('players')
        .select('*')
        .eq('id', playerId)
        .maybeSingle();

      if (!player) {
        await supabaseAdmin.from('players').insert({
          id: playerId,
          wins: userWon ? 1 : 0,
          losses: userWon ? 0 : 1,
          current_streak: userWon ? 1 : 0,
          longest_streak: userWon ? 1 : 0,
          fastest_break: userWon ? timeTaken : null,
        });
      } else {
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

    return res.status(200).json({ ok: true, timeTaken });
  } catch (err) {
    console.error('ROUND END ERROR:', err);

    // 🔒 NEVER FAIL THE CLIENT
    return res.status(200).json({ ok: true, timeTaken: 0 });
  }
}
