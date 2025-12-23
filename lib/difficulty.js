export function getDifficulty(playerStats) {
  if (!playerStats) return 'medium';
  if (playerStats.current_streak >= 3) return 'hard';
  return 'medium';
}

export function getRoundDuration(difficulty) {
  return difficulty === 'hard' ? 60 : 75;
}
