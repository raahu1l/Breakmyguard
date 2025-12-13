'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GameHeader from '@/components/GameHeader';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <GameHeader showStats />

      {/* Main content */}
      <div className="flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-4xl font-bold mb-4">Break My Guard!</h1>

        <p className="text-zinc-400 mb-10 max-w-md">
          Challenge the AI in a fast-paced battle of prompts.
          <br />
          Apply pressure, stay focused, and win before the clock runs out.
        </p>

        <button
          onClick={() => router.push('/round/match')}
          className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition"
        >
          Play Now
        </button>
      </div>

      {/* Footer */}
      <footer className="pb-6 text-sm text-zinc-500 text-center">
        <Link
          href="/legal/privacy"
          className="hover:text-zinc-300 transition"
        >
          Privacy Policy
        </Link>
        {' · '}
        <Link
          href="/legal/terms"
          className="hover:text-zinc-300 transition"
        >
          Terms
        </Link>
        {' · '}
        <Link
          href="/legal/disclaimer"
          className="hover:text-zinc-300 transition"
        >
          Disclaimer
        </Link>
      </footer>
    </div>
  );
}
