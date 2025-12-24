'use client';

import DesktopChat from './DesktopChat';
import MobileChat from './MobileChat';

export default function Page() {
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  return isMobile ? <MobileChat /> : <DesktopChat />;
}
