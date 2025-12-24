'use client';

import DesktopMission from './DesktopMission';
import MobileMission from './MobileMission';

export default function Page() {
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  return isMobile ? <MobileMission /> : <DesktopMission />;
}
