'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GameHeader from '@/components/GameHeader';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <GameHeader showStats />

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
        <p className="hero-sub mb-8">
          Challenge the AI in a fast-paced battle of prompts.
          <br />
          Apply pressure, stay focused, and win before the clock runs out.
        </p>

        {/* CTA */}
       <button
  onClick={() => router.push('/round/match')}
  className="relative group mt-2"
>
  {/* outer tech frame */}
  <div className="cta-frame" />

  {/* inner plate */}
  <div className="cta-plate">
    <span className="cta-text">Press To Enter The System</span>
  </div>
</button>

      </main>

      {/* FOOTER — PINNED TO BOTTOM (N ICON LEVEL) */}
      <footer className="absolute bottom-4 left-0 right-0 z-10 text-xs text-zinc-400 text-center">
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
      </footer>
    </div>
  );
}
