import { v4 as uuidv4 } from 'uuid';

export function getOrCreatePlayerId() {
  if (typeof window === 'undefined') return null;

  let id = localStorage.getItem('playerId');

  // validate UUID format
  const isValidUUID =
    id &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id
    );

  if (!isValidUUID) {
    id = uuidv4();
    localStorage.setItem('playerId', id);
  }

  return id;
}
