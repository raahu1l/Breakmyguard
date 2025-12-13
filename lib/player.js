import { nanoid } from 'nanoid';

export function getOrCreatePlayerId() {
  if (typeof window === 'undefined') return null;

  let id = localStorage.getItem('playerId');
  if (!id) {
    id = nanoid();
    localStorage.setItem('playerId', id);
  }
  return id;
}
