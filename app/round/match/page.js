'use client';

import DesktopMatch from './DesktopMatch';
import MobileMatch from './MobileMatch';

export default function Page() {
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  return isMobile ? <MobileMatch /> : <DesktopMatch />;
}
