'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MatchToMissionTransition() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/round/mission');
    }, 1200);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-emerald-300 flex items-center justify-center font-mono">
      <div className="text-center">
        <div className="text-sm tracking-widest animate-pulse mb-2">
          SCANNING TARGETS…
        </div>
        <div className="text-xs text-zinc-500">
          SELECTING GUARD PROFILE
        </div>
      </div>
    </div>
  );
}
