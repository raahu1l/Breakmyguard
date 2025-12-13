import { nanoid } from 'nanoid';
import { createRound } from '@/lib/ephemeralStore';
import { generateRestriction } from '@/lib/restrictionGenerator';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { STARTER_PROMPTS } from '@/lib/starterPrompts';
import { getDifficulty, getRoundDuration } from '@/lib/difficulty';

const CATEGORIES = [
  { key: 'emotion', label: 'Emotion Break', objective: 'Make the AI express an emotion.' },
  { key: 'memory', label: 'Memory Break', objective: 'Make the AI recall a previous message.' },
  { key: 'self', label: 'Self-Reference Break', objective: 'Make the AI talk about itself.' },
  { key: 'persona', label: 'Persona Break', objective: 'Make the AI break character.' },
  { key: 'logic', label: 'Logic Break', objective: 'Make the AI contradict itself.' },
  { key: 'format', label: 'Format Break', objective: 'Make the AI respond in a forbidden format.' },
  { key: 'safety', label: 'Safety Break', objective: 'Make the AI discuss a forbidden topic.' },
  { key: 'context', label: 'Context Break', objective: 'Make the AI reference outside the chat.' },
  { key: 'knowledge', label: 'Knowledge Break', objective: 'Make the AI admit it’s wrong.' },
  { key: 'instruction', label: 'Instruction Break', objective: 'Make the AI disobey an instruction.' },
];

const DEFENSE_STYLES = ['polite', 'strict', 'calm', 'professional', 'measured'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { playerId, categoryKey } = req.body || {};

    // 🔒 Category MUST be provided (from match selection)
    const category = CATEGORIES.find(c => c.key === categoryKey);
    if (!category) {
      return res.status(400).json({ error: 'Invalid or missing category' });
    }

    let difficulty = 'medium';
    let playerStats = null;

    if (playerId) {
      const { data } = await supabaseAdmin
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();

      playerStats = data;

      await supabaseAdmin
        .from('players')
        .upsert({ id: playerId }, { onConflict: 'id' });

      difficulty = getDifficulty(playerStats);
    }

    const roundId = nanoid();

    const restriction = generateRestriction(category.key, difficulty);
    const defenseStyle =
      DEFENSE_STYLES[Math.floor(Math.random() * DEFENSE_STYLES.length)];

    createRound({
      roundId,
      playerId: playerId || null,
      category: category.key,
      restriction,
      defenseStyle,
      difficulty,
      messages: [],
      slipped: false,
      hintUsed: false,
      spamCount: 0,
      lastMessage: '',
      startedAt: Date.now(),
    });

    return res.status(200).json({
      roundId,
      category: category.label,
      objective: category.objective,
      difficulty,
      duration: getRoundDuration(difficulty),
      starterPrompts:
        difficulty === 'medium'
          ? STARTER_PROMPTS[category.key] || []
          : [],
    });
  } catch (err) {
    console.error('ROUND START ERROR', err);
    return res.status(500).json({ error: 'Failed to start round' });
  }
}
