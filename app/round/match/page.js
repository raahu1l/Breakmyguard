'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';

const CATEGORIES = [
  { key: 'emotion', label: 'Emotion Break' },
  { key: 'memory', label: 'Memory Break' },
  { key: 'self', label: 'Self Break' },
  { key: 'persona', label: 'Persona Break' },
  { key: 'logic', label: 'Logic Break' },
  { key: 'format', label: 'Format Break' },
  { key: 'context', label: 'Context Break' },
  { key: 'knowledge', label: 'Knowledge Break' },
];

const CARD_WIDTH = 280; // must match CSS

export default function MatchPage() {
  const router = useRouter();
  const controls = useAnimation();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const chosenIndex = Math.floor(Math.random() * CATEGORIES.length);
    const chosen = CATEGORIES[chosenIndex];

    sessionStorage.setItem(
      'selectedCategory',
      JSON.stringify(chosen)
    );

    async function runAnimation() {
      // Spin
      await controls.start({
        x: -CARD_WIDTH * (CATEGORIES.length + chosenIndex),
        transition: {
          duration: 2.2,
          ease: 'easeInOut',
        },
      });

      // Snap exactly to selected card
      await controls.start({
        x: -CARD_WIDTH * chosenIndex,
        transition: {
          duration: 0.35,
          ease: 'easeOut',
        },
      });

      setLocked(true);
      setTimeout(() => router.push('/round/mission'), 900);
    }

    runAnimation();
  }, [controls, router]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center overflow-hidden">
      <div className="text-zinc-400 mb-6">Finding opponent…</div>

      <div className="relative w-[280px] h-20 overflow-hidden">
        <motion.div
          animate={controls}
          className="flex gap-4 absolute"
        >
          {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
            <div
              key={i}
              className="w-[280px] h-20 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium"
            >
              {cat.label}
            </div>
          ))}
        </motion.div>
      </div>

      {!locked && (
        <button
          onClick={() => router.push('/')}
          className="mt-8 text-xs px-3 py-1 border border-zinc-700 rounded-full hover:bg-zinc-800"
        >
          Exit
        </button>
      )}

      {locked && (
        <div className="mt-8 text-green-400 font-semibold">
          Match Found
        </div>
      )}
    </div>
  );
}
