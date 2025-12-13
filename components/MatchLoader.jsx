'use client';

import { motion } from 'framer-motion';
import { animationsEnabled } from '@/lib/animation';

export default function MatchLoader() {
  const animate = animationsEnabled();

  return (
    <motion.div
      animate={animate ? { opacity: [0.6, 1, 0.6] } : {}}
      transition={{ repeat: Infinity, duration: 1.4 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="text-lg font-semibold">Match Found</div>
      <div className="text-sm text-zinc-400">
        Preparing AI defenses…
      </div>
    </motion.div>
  );
}
