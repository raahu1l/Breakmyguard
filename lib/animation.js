export function animationsEnabled() {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('animations') !== 'false';
}
