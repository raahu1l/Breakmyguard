import { nanoid } from 'nanoid';
import { RESTRICTIONS } from './restrictionsData';

const usedByCategory = new Map();

export function generateRestriction(category) {
  const pool = RESTRICTIONS[category];
  if (!pool) {
    throw new Error(`Unknown category ${category}`);
  }

  if (!usedByCategory.has(category)) {
    usedByCategory.set(category, new Set());
  }

  const usedSet = usedByCategory.get(category);
  let available = pool.filter(rule => !usedSet.has(rule));

  if (available.length === 0) {
    usedSet.clear();
    available = [...pool];
  }

  const rule = available[Math.floor(Math.random() * available.length)];
  usedSet.add(rule);

  return {
    id: nanoid(),
    category,
    rule,
  };
}
