'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatToResultTransition() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/round/result');
    }, 900);

    return () => clearTimeout(t);
  }, [router]);

  const last =
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('lastResult') || '{}')
      : {};

  const won = last.userWon;

  return (
    <div className="min-h-screen bg-black text-emerald-300 flex items-center justify-center font-mono">
      <div className="text-center">
        <div
          className={`text-sm tracking-widest mb-2 ${
            won ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {won ? 'BREACH CONFIRMED' : 'INTRUSION FAILED'}
        </div>

        <div className="text-xs text-zinc-500 animate-pulse">
          {won
            ? 'EXTRACTING SESSION DATA…'
            : 'SECURING SYSTEM…'}
        </div>
      </div>
    </div>
  );
}
