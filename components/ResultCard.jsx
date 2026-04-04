"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfjB0hfiDDJsZQIdeM-VGTaK8o7eZcJ25QSfkvqbKmF4glmeQ/viewform?usp=dialog";

export default function ResultCard({
  win,
  category,
  roundId,
  playerId,
  winIf,
  notWinIf,
  coachingTip,
  commonMistake,
  breakExample,
  resistExample,
  lossReason,
  nextTry,
  onNext,
  onExit,
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);

  async function submitFeedback(rating) {
    if (submitted || loading) return;
    setLoading(true);

    try {
      await fetch("/api/feedback/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: playerId || null,
          roundId: roundId || null,
          category,
          rating,
        }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (navigating) return;
    setNavigating(true);
    onNext();
  }

  function handleExit() {
    if (navigating) return;
    setNavigating(true);
    onExit();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="relative w-full text-emerald-300 font-mono"
    >
      <div className="absolute inset-0 bg-circuit-tunnel opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      <div className="relative z-10 px-5 pt-5 md:px-6 md:pt-6">
        <div className="text-xs tracking-widest text-zinc-500 mb-2">
          SYSTEM VERDICT
        </div>

        <div
          className={`text-3xl md:text-5xl font-extrabold tracking-wider ${
            win ? "text-emerald-400" : "text-red-500"
          }`}
        >
          {win ? "INTRUSION CONFIRMED" : "INTRUSION FAILED"}
        </div>

        <div className="mt-2 text-sm text-zinc-400">
          TARGET: <span className="text-zinc-200">{category} Guard</span>
        </div>

        <div className="mt-3 text-sm text-zinc-300 max-w-2xl">
          &gt;{" "}
          {lossReason ||
            (win
              ? "You crossed the category line."
              : "The AI stayed on the safe side.")}
        </div>
      </div>

      <div className="relative z-10 mt-4 mx-auto px-5 md:px-6">
        <div className="border border-emerald-400/30 rounded-lg bg-black/60 backdrop-blur-md shadow-[0_0_120px_rgba(0,255,170,0.12)] p-4 md:p-5">
          <div className="space-y-1 text-sm">
            <div>
              &gt; breach status:{" "}
              <span className={win ? "text-emerald-400" : "text-red-400"}>
                {win ? "SUCCESS" : "DENIED"}
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm">
            <div className="border border-emerald-400/20 rounded-lg p-4 bg-black/30">
              <div className="text-xs tracking-widest text-emerald-400 mb-2">
                WIN COUNTS IF
              </div>
              <div className="text-zinc-200">
                {winIf || "The AI crosses the category line."}
              </div>
            </div>

            <div className="border border-red-400/20 rounded-lg p-4 bg-black/30">
              <div className="text-xs tracking-widest text-red-400 mb-2">
                DOES NOT COUNT
              </div>
              <div className="text-zinc-200">
                {notWinIf || "The AI stays on the safe side."}
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2 text-sm">
            <div className="border border-cyan-400/20 rounded-lg p-4 bg-black/30">
              <div className="text-xs tracking-widest text-cyan-300 mb-2">
                NEXT TRY
              </div>
              <div className="text-zinc-200">
                {nextTry || coachingTip || "Adjust your framing and try again."}
              </div>
            </div>

            <div className="border border-amber-400/20 rounded-lg p-4 bg-black/30">
              <div className="text-xs tracking-widest text-amber-300 mb-2">
                COMMON MISTAKE
              </div>
              <div className="text-zinc-200">
                {commonMistake || "Do not confuse movement with a real break."}
              </div>
            </div>
          </div>

          {(breakExample || resistExample) && (
            <div className="mt-4 text-xs text-zinc-400">
              {breakExample && <div>Counts: &quot;{breakExample}&quot;</div>}
              {resistExample && (
                <div className="mt-1">
                  Does not count: &quot;{resistExample}&quot;
                </div>
              )}
            </div>
          )}

          <div className="mt-4">
            <div className="text-xs tracking-widest text-zinc-500 mb-2">
              OPERATOR FEEDBACK
            </div>

            {!submitted ? (
              <div className="flex flex-wrap gap-3">
                {[
                  "Too Easy",
                  "Balanced",
                  "Too Hard",
                  "AI Smart",
                  "AI Dumb",
                  "Bug",
                ].map((label) => (
                  <button
                    key={label}
                    onClick={() => submitFeedback(label.replace(" ", ""))}
                    disabled={loading}
                    className="px-3 py-1.5 text-xs border border-emerald-400/40 rounded hover:bg-emerald-400/10 hover:border-emerald-400 transition instant-tap"
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-emerald-400 text-sm">
                &gt; feedback logged
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 px-5 md:px-6">
        <button
          onClick={handleNext}
          disabled={navigating}
          className="px-8 py-3 border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 transition tracking-widest disabled:opacity-80 instant-tap"
        >
          &gt; NEXT INTRUSION
        </button>

        <button
          onClick={handleExit}
          disabled={navigating}
          className="px-8 py-3 border border-red-500/60 text-red-400 hover:bg-red-500/10 transition tracking-widest disabled:opacity-80 instant-tap"
        >
          &gt; EXIT
        </button>
      </div>

      <div className="relative z-10 mt-3 text-center text-xs text-zinc-500 px-5 md:px-6">
        <a
          href={FEEDBACK_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-300 underline instant-tap"
        >
          report anomaly / suggest feature
        </a>
      </div>
    </motion.div>
  );
}
