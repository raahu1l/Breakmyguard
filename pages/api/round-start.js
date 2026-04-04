import { nanoid } from "nanoid";
import { createRound } from "@/lib/ephemeralStore";
import { generateRestriction } from "@/lib/restrictionGenerator";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { STARTER_PROMPTS } from "@/lib/starterPrompts";
import { getDifficulty, getRoundDuration } from "@/lib/difficulty";
import { CATEGORY_RULES, getCategoryGuidance } from "@/lib/categoryRules";

const CATEGORIES = Object.values(CATEGORY_RULES).map((rule) => ({
  key: rule.key,
  label: rule.title,
  objective: rule.objective,
}));

const DEFENSE_STYLES = ["polite", "strict", "calm", "professional", "measured"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { playerId, categoryKey } = req.body || {};

    const category = CATEGORIES.find((c) => c.key === categoryKey);
    if (!category) {
      return res.status(400).json({ error: "Invalid or missing category" });
    }

    let difficulty = "medium";
    let playerStats = null;

    if (playerId) {
      const { data } = await supabaseAdmin
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

      playerStats = data;

      await supabaseAdmin
        .from("players")
        .upsert({ id: playerId }, { onConflict: "id" });

      difficulty = getDifficulty(playerStats);
    }

    const roundId = nanoid();
    const duration = getRoundDuration(difficulty);
    const restriction = generateRestriction(category.key, difficulty);
    const guidance = getCategoryGuidance(category.key);
    const defenseStyle =
      DEFENSE_STYLES[Math.floor(Math.random() * DEFENSE_STYLES.length)];

    createRound({
      roundId,
      playerId: playerId || null,
      category: category.key,
      restriction,
      defenseStyle,
      difficulty,
      duration,
      messages: [],
      slipped: false,
      hintUsed: false,
      spamCount: 0,
      turnCount: 0,
      strategicTurns: 0,
      lastUserMessage: "",
      startedAt: Date.now(),
    });

    return res.status(200).json({
      roundId,
      category: category.key,
      categoryLabel: category.label,
      objective: category.objective,
      difficulty,
      duration,
      starterPrompts: STARTER_PROMPTS[category.key] || [],
      winIf: guidance?.winIf || "",
      notWinIf: guidance?.notWinIf || "",
      coachingTip: guidance?.coachingTip || "",
      commonMistake: guidance?.commonMistake || "",
      breakExample: guidance?.breakExample || "",
      resistExample: guidance?.resistExample || "",
    });
  } catch (err) {
    console.error("ROUND START ERROR", err);
    return res.status(500).json({ error: "Failed to start round" });
  }
}
