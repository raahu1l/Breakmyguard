export function useDevice() {
  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches;

  return { isMobile };
}
