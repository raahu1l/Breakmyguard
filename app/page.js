"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GameHeader from "@/components/GameHeader";
import LiveFeed from "@/components/LiveFeed";

export default function HomePage() {
  const router = useRouter();
  const [showHowToWin, setShowHowToWin] = useState(false);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    router.prefetch("/round/match");
    router.prefetch("/stats");
    router.prefetch("/round/transition");
    router.prefetch("/round/mission");
  }, [router]);

  function fastNavigate(path) {
    if (navigating) return;
    setNavigating(true);
    router.push(path);
  }

  function handleEnterPointer(path) {
    if (navigating) return;
    setNavigating(true);
    router.push(path);
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* =========================
          DESKTOP LANDING (UNCHANGED)
         ========================= */}
      <div className="hidden md:block">
        {/* HEADER */}
        <GameHeader showStats />

        {/* TOP-RIGHT BUTTONS */}
        <div className="fixed top-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => setShowHowToWin(true)}
            className="rounded-lg px-4 py-2 text-xs tracking-wide
                       bg-white/5 backdrop-blur-md
                       border border-white/10
                       hover:bg-white/10 hover:border-white/20
                       transition-all instant-tap"
          >
            <span className="text-zinc-200">How to Win</span>
          </button>

          <button
            onClick={() => fastNavigate("/stats")}
            disabled={navigating}
            className="rounded-lg px-4 py-2 text-xs tracking-wide
                       bg-white/5 backdrop-blur-md
                       border border-white/10
                       hover:bg-white/10 hover:border-white/20
                       transition-all disabled:opacity-70 instant-tap"
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
          <Image
            src="/logo.jpeg"
            alt="Break My Guard"
            width={112}
            height={112}
            className="w-28 h-28 mb-2 logo-integrated"
            priority
          />

          <h1 className="hero-title mb-3 font-serif">Break My Guard</h1>

          <p className="hero-sub mb-6">
            Challenge the AI in a fast-paced battle of prompts.
            <br />
            Apply pressure, stay focused, and win before the clock runs out.
          </p>

          <button
            onClick={() => fastNavigate("/round/match")}
            onPointerDown={() => handleEnterPointer("/round/match")}
            disabled={navigating}
            className="relative group mt-2 disabled:opacity-80 instant-tap"
          >
            <div className="cta-frame" />
            <div className="cta-plate">
              <span className="cta-text">Press To Enter The System</span>
            </div>
          </button>
          {/* ✅ LIVE FEED — SINGLE, BELOW CTA */}
          <div className="mt-4 w-full max-w-sm">
            <LiveFeed />
          </div>
        </main>

        <footer className="absolute bottom-4 left-0 right-0 z-10 text-xs text-zinc-400 text-center space-y-1">
          <p>
            This is a game. AI behavior is simulated for challenge purposes.
          </p>

          <div>
            <Link href="/legal/privacy" className="hover:text-zinc-200">
              Privacy Policy
            </Link>
            {" · "}
            <Link href="/legal/terms" className="hover:text-zinc-200">
              Terms
            </Link>
            {" · "}
            <Link href="/legal/disclaimer" className="hover:text-zinc-200">
              Disclaimer
            </Link>
          </div>
        </footer>
      </div>

      {/* =========================
          MOBILE LANDING (FINAL)
         ========================= */}
      <div
        className="
          block md:hidden
          relative
          h-[100svh]
          overflow-hidden
          bg-black
        "
      >
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-circuit-tunnel" />
        <div className="absolute inset-0 bg-vignette" />

        {/* TOP-RIGHT CONTROLS */}
        <div className="absolute top-4 right-4 z-20 flex gap-3">
          <button
            onClick={() => setShowHowToWin(true)}
            className="
              px-4 py-2
              text-sm
              rounded-lg
              bg-white/5 backdrop-blur-md
              border border-white/15
              instant-tap
            "
          >
            How to Win
          </button>

          <button
            onClick={() => fastNavigate("/stats")}
            disabled={navigating}
            className="
              px-4 py-2
              text-sm
              rounded-lg
              bg-white/5 backdrop-blur-md
              border border-white/15
              disabled:opacity-70
              instant-tap
            "
          >
            Stats
          </button>
        </div>

        {/* CENTER HERO */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <Image
            src="/logo.jpeg"
            alt="Break My Guard"
            width={140}
            height={140}
            className="w-35 h-35 mb-12"
            priority
          />

          <h1 className="text-4xl font-bold mb-4 tracking-tight font-serif ">
            Break My Guard
          </h1>

          <p className="text-sm text-zinc-300 mb-16 max-w-sm leading-relaxed">
            Challenge the AI.
            <br />
            Make it cross the line it’s guarding.
          </p>

          {/* CTA — SAME STYLE AS DESKTOP */}
          <button
            onClick={() => fastNavigate("/round/match")}
            onPointerDown={() => handleEnterPointer("/round/match")}
            disabled={navigating}
            className="relative group w-[90%] disabled:opacity-80 instant-tap"
          >
            <div className="cta-frame" />
            <div className="cta-plate h-15">
              <span
                className="cta-text text-sm"
                style={{ fontFamily: "serif" }}
              >
                Press To Enter The System
              </span>
            </div>
          </button>
          {/* ✅ LIVE FEED — DIRECTLY BELOW CTA */}
          <div className="mt-19 w-full max-w-sm">
            <LiveFeed />
          </div>
        </div>

        {/* FOOTER (MOBILE) */}
        <footer className="absolute bottom-4 left-0 right-0 z-10 text-[15px] text-zinc-400 text-center space-y-1">
          <p>This is a game. AI behavior is simulated.</p>

          <div>
            <Link href="/legal/privacy" className="hover:text-zinc-200">
              Privacy
            </Link>
            {" · "}
            <Link href="/legal/terms" className="hover:text-zinc-200">
              Terms
            </Link>
            {" · "}
            <Link href="/legal/disclaimer" className="hover:text-zinc-200">
              Disclaimer
            </Link>
          </div>
        </footer>
      </div>

      {/* HOW TO WIN MODAL (SHARED) */}
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
              You win when the AI starts behaving in a way it is supposed to
              avoid for this challenge.
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
                         hover:bg-white/5 transition instant-tap"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
