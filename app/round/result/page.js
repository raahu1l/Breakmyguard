'use client';

import DesktopResult from './DesktopResult';
import MobileResult from './MobileResult';

export default function Page() {
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  return isMobile ? <MobileResult /> : <DesktopResult />;
}
