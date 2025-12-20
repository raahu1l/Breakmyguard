// 🔒 Persist rounds across hot reloads (DEV SAFE)
globalThis.__ROUNDS__ ??= new Map();
const rounds = globalThis.__ROUNDS__;

export function createRound(round) {
  rounds.set(round.roundId, {
    ...round,
    dangerScore: 0,
    memoryLeaks: 0,
    selfLeaks: 0,
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
