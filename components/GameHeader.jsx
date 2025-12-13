'use client';

import { useRouter } from 'next/navigation';

export default function GameHeader({ showStats = false }) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
      <div
        className="font-bold cursor-pointer"
        onClick={() => router.push('/')}
      >
        Break My Guard
      </div>

      {showStats && (
        <button
          onClick={() => router.push('/stats')}
          className="text-sm px-3 py-1 border border-zinc-700 rounded-full"
        >
          Stats
        </button>
      )}
    </div>
  );
}
