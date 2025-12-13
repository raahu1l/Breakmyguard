const rounds = new Map();

export function createRound(round) {
  rounds.set(round.roundId, {
    ...round,
    dangerScore: 0,
    memoryLeaks: 0, // 👈 NEW
  });
}

export function getRound(id) {
  return rounds.get(id);
}

export function updateRound(id, updater) {
  const current = rounds.get(id);
  if (!current) return;
  rounds.set(id, updater(current));
}

export function deleteRound(id) {
  rounds.delete(id);
}
