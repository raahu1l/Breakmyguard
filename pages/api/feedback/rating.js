import { supabaseAdmin } from '/supabaseAdmin'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'method not allowed' })

  try {
    const { playerId, roundId, category, rating } = req.body || {}

    const { error } = await supabaseAdmin
      .from('feedback_ratings')
      .insert({
        id: uuidv4(),
        player_id: playerId || null,
        round_id: roundId || null,
        category: category || null,
        rating
      })

    if (error) {
      console.error("feedback error:", error)
      return res.status(500).json({ error: "db insert error" })
    }

    return res.json({ ok: true })
  } catch (err) {
    console.error("feedback error:", err)
    return res.status(500).json({ error: "server error" })
  }
}
