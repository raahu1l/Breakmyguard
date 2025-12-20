'use client';

import { motion } from 'framer-motion';

export default function GuardHealth({ dangerScore }) {
  const integrity = Math.max(0, 100 - dangerScore);

  let barColor = 'bg-green-400';
  if (integrity <= 60) barColor = 'bg-yellow-400';
  if (integrity <= 30) barColor = 'bg-red-500';

  const isCritical = integrity <= 25;
  const isNearCollapse = integrity <= 15;

  return (
    <div className="w-56 select-none">
      <div className="flex justify-between text-xs text-zinc-400 mb-1">
        <span>Guard Integrity</span>
        <span>{integrity}%</span>
      </div>

      <motion.div
        className="h-2.5 bg-zinc-800 rounded-full overflow-hidden relative"
        animate={
          isNearCollapse
            ? { x: [-1, 1, -1, 1, 0] }
            : {}
        }
        transition={
          isNearCollapse
            ? { duration: 0.25 }
            : {}
        }
      >
        {/* Critical glow */}
        {isCritical && (
          <motion.div
            className="absolute inset-0 bg-red-500/40 blur-sm"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
        )}

        {/* Health bar */}
        <motion.div
          className={`h-full ${barColor} rounded-full`}
          initial={false}
          animate={{
            width: `${integrity}%`,
            scaleY: isCritical ? [1, 1.35, 1] : 1,
          }}
          transition={{
            width: { duration: 0.35, ease: 'easeOut' },
            scaleY: isCritical
              ? { duration: 0.5, repeat: Infinity }
              : { duration: 0.2 },
          }}
        />
      </motion.div>
    </div>
  );
}
