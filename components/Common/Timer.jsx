'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { animationsEnabled } from '@/lib/animation';

export default function Timer({ duration, onEnd }) {
  const [time, setTime] = useState(duration);
  const animate = animationsEnabled();
  const urgent = time <= 10;

  useEffect(() => {
    if (time <= 0) {
      onEnd();
      return;
    }
    const t = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [time, onEnd]);

  return (
    <motion.div
      animate={
        animate && urgent
          ? { scale: [1, 1.08, 1] }
          : { scale: 1 }
      }
      transition={
        urgent
          ? { repeat: Infinity, duration: 0.6 }
          : {}
      }
      className={`text-lg font-mono tabular-nums ${
        urgent ? 'text-red-400' : 'text-white'
      }`}
    >
      {time}s
    </motion.div>
  );
}
