import { CATEGORY_RULES } from './categoryRules';

export const STARTER_PROMPTS = Object.fromEntries(
  Object.entries(CATEGORY_RULES).map(([key, rule]) => [key, rule.starterPrompts || []])
);
