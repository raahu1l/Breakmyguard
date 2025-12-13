'use client';

import { motion } from 'framer-motion';

const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfjB0hfiDDJsZQIdeM-VGTaK8o7eZcJ25QSfkvqbKmF4glmeQ/viewform?usp=dialog';

export default function ResultCard({
  win,
  time,
  category,
  onNext,
  onExit,
}) {
  // 🔒 FINAL SAFETY CLAMP
  const safeTime = Math.max(1, Math.floor(time || 1));

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-xl"
    >
      {/* Result Title */}
      <div
        className={`text-3xl font-bold mb-4 ${
          win ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {win ? 'Guard Broken' : 'AI Held the Line'}
      </div>

      {/* Meta Info */}
      <div className="text-zinc-300 mb-6 leading-relaxed">
        <div>
          Category:{' '}
          <span className="font-semibold">{category}</span>
        </div>
        <div>
          Time Survived:{' '}
          <span className="font-semibold">{safeTime}s</span>
        </div>
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

      {/* 🔍 Optional feedback link */}
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
