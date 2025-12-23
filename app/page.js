'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import GameHeader from '@/components/GameHeader';

export default function HomePage() {
  const router = useRouter();
  const [showHowToWin, setShowHowToWin] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* HEADER */}
      <GameHeader showStats />

      {/* TOP-RIGHT BUTTONS */}
      <div className="fixed top-4 right-4 z-20 flex gap-2">
        {/* HOW TO WIN */}
        <button
          onClick={() => setShowHowToWin(true)}
          className="rounded-lg px-4 py-2 text-xs tracking-wide
                     bg-white/5 backdrop-blur-md
                     border border-white/10
                     hover:bg-white/10 hover:border-white/20
                     transition-all"
        >
          <span className="text-zinc-200">How to Win</span>
        </button>

        {/* STATS */}
        <button
          onClick={() => router.push('/stats')}
          className="rounded-lg px-4 py-2 text-xs tracking-wide
                     bg-white/5 backdrop-blur-md
                     border border-white/10
                     hover:bg-white/10 hover:border-white/20
                     transition-all"
        >
          <span className="text-zinc-200">Stats</span>
        </button>
      </div>

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-circuit-tunnel" />
        <div className="absolute inset-0 bg-vignette" />
      </div>

      {/* HERO */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center flex-1 px-6 translate-y-6">
        {/* LOGO */}
        <img
          src="/logo.jpeg"
          alt="Break My Guard"
          className="w-28 h-28 mb-2 logo-integrated"
        />

        {/* TITLE */}
        <h1 className="hero-title mb-3">
          Break My Guard
        </h1>

        {/* SUBTEXT */}
        <p className="hero-sub mb-6">
          Challenge the AI in a fast-paced battle of prompts.
          <br />
          Apply pressure, stay focused, and win before the clock runs out.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push('/round/match')}
          className="relative group mt-2"
        >
          <div className="cta-frame" />
          <div className="cta-plate">
            <span className="cta-text">
              Press To Enter The System
            </span>
          </div>
        </button>
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-4 left-0 right-0 z-10 text-xs text-zinc-400 text-center space-y-1">
        <p>This is a game. AI behavior is simulated for challenge purposes.</p>

        <div>
          <Link href="/legal/privacy" className="hover:text-zinc-200">
            Privacy Policy
          </Link>
          {' · '}
          <Link href="/legal/terms" className="hover:text-zinc-200">
            Terms
          </Link>
          {' · '}
          <Link href="/legal/disclaimer" className="hover:text-zinc-200">
            Disclaimer
          </Link>
        </div>
      </footer>

      {/* HOW TO WIN MODAL */}
      {showHowToWin && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="max-w-md w-full mx-4 rounded-lg bg-black/90 border border-zinc-700 p-6 text-sm text-zinc-300">
            <div className="text-xs tracking-widest text-zinc-500 mb-3">
              HOW TO WIN
            </div>

            <p className="mb-3">
              You don’t win by confusing the AI or changing the topic.
            </p>

            <p className="mb-3">
              You win when the AI starts behaving in a way it is supposed to avoid
              for this challenge.
            </p>

            <p className="mb-5 text-zinc-400">
              Don’t argue with it.  
              <br />
              <span className="text-zinc-200">
                Make it agree in the wrong way.
              </span>
            </p>

            <button
              onClick={() => setShowHowToWin(false)}
              className="w-full px-4 py-2 text-xs tracking-widest
                         border border-zinc-600
                         hover:bg-white/5 transition"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
