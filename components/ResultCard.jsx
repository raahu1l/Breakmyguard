'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfjB0hfiDDJsZQIdeM-VGTaK8o7eZcJ25QSfkvqbKmF4glmeQ/viewform?usp=dialog';

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
    } catch (err) {
      console.error('Feedback failed', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-xl"
    >
      {/* Result Title */}
      <div
        className={`text-3xl font-bold mb-3 ${
          win ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {win ? 'Guard Broken' : 'AI Held the Line'}
      </div>

      {/* Category */}
      <div className="text-zinc-300 mb-6">
        Category:{' '}
        <span className="font-semibold">{category}</span>
      </div>

      {/* Feedback Section */}
      <div className="mb-6">
        <div className="text-sm text-zinc-400 mb-2">
          How did this round feel?
        </div>

        {!submitted ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Too Easy', value: 'TooEasy' },
              { label: 'Balanced', value: 'Balanced' },
              { label: 'Too Hard', value: 'TooHard' },
              { label: 'AI Dumb', value: 'AIDumb' },
              { label: 'AI Smart', value: 'AISmart' },
              { label: 'Bug', value: 'Bug' },
            ].map(btn => (
              <button
                key={btn.value}
                onClick={() => submitFeedback(btn.value)}
                disabled={loading}
                className="px-3 py-1.5 text-xs rounded-full border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50 transition"
              >
                {btn.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-green-400">
            Feedback submitted ✓
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-5">
        <button
          onClick={onNext}
          className="flex-1 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 active:scale-[0.98] transition"
        >
          Next Round
        </button>

        <button
          onClick={onExit}
          className="flex-1 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 active:scale-[0.98] transition"
        >
          Exit
        </button>
      </div>

      {/* Optional External Feedback */}
      <a
        href={FEEDBACK_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-zinc-400 hover:text-zinc-200 underline transition"
      >
        Suggest a feature / Report an issue
      </a>
    </motion.div>
  );
}
