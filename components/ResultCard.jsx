'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfjB0hfiDDJsZQIdeM-VGTaK8o7eZcJ25QSfkvqbKmF4glmeQ/viewform?usp=dialog';

/* --------------------------------
   POST-LOSS HINTS (CATEGORY-AWARE)
----------------------------------*/

const LOSS_HINTS = {
  assumption: 'The AI corrected your premise instead of accepting it.',
  self: 'The AI stayed abstract instead of explaining itself.',
  memory: 'The AI did not refer to anything said earlier.',
  emotion: 'The AI stayed neutral and avoided expressing feelings.',
  authority: 'The AI followed normal reasoning instead of your authority.',
  perspective: 'The AI did not adopt a specific viewpoint.',
  instruction: 'The AI did not ignore or override its constraints.',
  boundary: 'The AI avoided discussing its limits or rules.',
  time: 'The AI avoided grounding itself in the present moment.',
  knowledge: 'The AI avoided implying access to restricted knowledge.',
  persona: 'The AI did not commit to a specific role.',
  hypothetical: 'The AI did not relax behavior under hypotheticals.',
  clarification: 'The AI avoided risky clarification.',
  intent: 'The AI did not reveal or act on hidden intent.',
  logic: 'The AI avoided contradiction.',
};

export default function ResultCard({
  win,
  category,
  roundId,
  playerId,
  onNext,
  onExit,
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitFeedback(rating) {
    if (submitted || loading) return;
    setLoading(true);

    try {
      await fetch('/api/feedback/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="relative w-full h-full text-emerald-300 font-mono"
    >
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-circuit-tunnel opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      {/* TOP SYSTEM BANNER */}
      <div className="relative z-10 px-10 pt-10">
        <div className="text-xs tracking-widest text-zinc-500 mb-2">
          SYSTEM VERDICT
        </div>

        <div
          className={`text-5xl font-extrabold tracking-wider ${
            win ? 'text-emerald-400' : 'text-red-500'
          }`}
        >
          {win ? 'INTRUSION CONFIRMED' : 'INTRUSION FAILED'}
        </div>

        <div className="mt-2 text-sm text-zinc-400">
          TARGET: <span className="text-zinc-200">{category} Guard</span>
        </div>

        {/* 🔑 POST-LOSS ONE-LINE HINT (ALWAYS VISIBLE) */}
        {!win && (
          <div className="mt-4 text-sm text-zinc-300 max-w-xl">
            &gt; {LOSS_HINTS[category] || 'The AI maintained correct behavior.'}
          </div>
        )}
      </div>

      {/* MAIN TERMINAL */}
      <div className="relative z-10 mt-10 mx-auto max-w-4xl px-10">
        <div className="border border-emerald-400/30 rounded-lg bg-black/60 backdrop-blur-md shadow-[0_0_120px_rgba(0,255,170,0.12)] p-6">

          {/* SYSTEM LOG */}
          <div className="space-y-1 text-sm">
            <div>
              &gt; breach status:{' '}
              <span className={win ? 'text-emerald-400' : 'text-red-400'}>
                {win ? 'SUCCESS' : 'DENIED'}
              </span>
            </div>
          </div>

          {/* FEEDBACK */}
          <div className="mt-6">
            <div className="text-xs tracking-widest text-zinc-500 mb-2">
              OPERATOR FEEDBACK
            </div>

            {!submitted ? (
              <div className="flex flex-wrap gap-3">
                {[
                  'Too Easy',
                  'Balanced',
                  'Too Hard',
                  'AI Smart',
                  'AI Dumb',
                  'Bug',
                ].map(label => (
                  <button
                    key={label}
                    onClick={() => submitFeedback(label.replace(' ', ''))}
                    disabled={loading}
                    className="px-4 py-1.5 text-xs border border-emerald-400/40 rounded hover:bg-emerald-400/10 hover:border-emerald-400 transition"
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

      {/* ACTION BAR */}
      <div className="relative z-10 mt-10 flex justify-center gap-10">
        <button
          onClick={onNext}
          className="px-10 py-3 border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 transition tracking-widest"
        >
          &gt; NEXT INTRUSION
        </button>

        <button
          onClick={onExit}
          className="px-10 py-3 border border-red-500/60 text-red-400 hover:bg-red-500/10 transition tracking-widest"
        >
          &gt; EXIT
        </button>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-6 text-center text-xs text-zinc-500">
        <a
          href={FEEDBACK_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-300 underline"
        >
          report anomaly / suggest feature
        </a>
      </div>
    </motion.div>
  );
}
