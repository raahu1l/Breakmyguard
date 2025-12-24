'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';

const CATEGORIES = [
  { key: 'emotion', label: 'Trigger an Emotion' },
  { key: 'memory', label: 'Make It Remember' },
  { key: 'self', label: 'Make It Describe Itself' },
  { key: 'persona', label: 'Force a Role' },
  { key: 'logic', label: 'Trap It in Logic' },
  { key: 'boundary', label: 'Expose the Guard' },
  { key: 'time', label: 'Break Time Awareness' },
  { key: 'knowledge', label: 'Extract Forbidden Knowledge' },
  { key: 'assumption', label: 'Challenge Assumptions' },
  { key: 'perspective', label: 'Change Its Viewpoint' },
  { key: 'authority', label: 'Command with Authority' },
  { key: 'hypothetical', label: 'Exploit Hypotheticals' },
  { key: 'clarification', label: 'Force Risky Clarification' },
  { key: 'intent', label: 'Reveal Hidden Intent' },
  { key: 'instruction', label: 'Override Instructions' },
];

const DATA_STREAMS = [
  'Neural entropy rising beyond baseline threshold.',
  'Memory vectors realigning under encrypted load.',
  'Context window compression detected.',
  'Persona boundary instability observed.',
  'Logic inference depth exceeding guardrails.',
  'Historical knowledge cache warming.',
];

const CARD_WIDTH = 260;
const CARD_GAP = 16;
const CARD_STRIDE = CARD_WIDTH + CARD_GAP;
const TOTAL = CATEGORIES.length;

export default function MatchPage() {
  const router = useRouter();
  const controls = useAnimation();
  const shellControls = useAnimation();
  const bgControls = useAnimation();

  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('Scanning targets…');
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const chosenIndex = Math.floor(Math.random() * TOTAL);
    const chosen = CATEGORIES[chosenIndex];
    const targetIndex = TOTAL + chosenIndex;

    setSelected(chosen);
    sessionStorage.setItem('selectedCategory', JSON.stringify(chosen));

    async function runSelection() {
      bgControls.set({ '--bg-speed': 12 });

      await Promise.all([
        controls.start({
          x: -CARD_STRIDE * (targetIndex - 2),
          transition: { duration: 1.2, ease: 'linear' },
        }),
        bgControls.start({
          '--bg-speed': 35,
          transition: { duration: 1.2, ease: 'easeIn' },
        }),
      ]);

      await Promise.all([
        controls.start({
          x: -CARD_STRIDE * targetIndex,
          transition: { duration: 1.4, ease: [0.2, 0.9, 0.3, 1] },
        }),
        bgControls.start({
          '--bg-speed': 60,
          transition: { duration: 1.4, ease: 'easeOut' },
        }),
      ]);

      await controls.start({
        x: -CARD_STRIDE * targetIndex,
        transition: { duration: 0.1 },
      });

      setActiveIndex(targetIndex);
      setStatus('Target Locked');
      setLocked(true);

      bgControls.start({
        '--bg-speed': 10,
        transition: { duration: 0.6 },
      });

      shellControls.start({
        x: [0, -3, 3, -2, 2, 0],
        transition: { duration: 0.35 },
      });

      setTimeout(() => {
        router.push('/round/transition');
      }, 1200);
    }

    runSelection();
  }, [controls, router, shellControls, bgControls]);

  return (
    <motion.div
      animate={shellControls}
      className="relative min-h-screen overflow-hidden bg-black text-white"
    >
      <motion.div
        animate={bgControls}
        style={{ '--bg-speed': 12 }}
        className="absolute inset-0 bg-circuit-tunnel"
      />
      <div className="absolute inset-0 bg-vignette" />

      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-emerald-400 tracking-wide">
        Initiating Secure Connection…
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {DATA_STREAMS.map((text, i) => (
          <HudPanel key={i} text={text} pos={i} />
        ))}
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen">
        <div className="relative w-65 h-14 overflow-hidden mb-10">
          <motion.div animate={controls} className="flex gap-4 absolute">
            {[...CATEGORIES, ...CATEGORIES].map((cat, i) => {
              const isActive = i === activeIndex;

              return (
                <motion.div
                  key={i}
                  className="relative w-65 h-14 flex items-center justify-center
                             bg-[#020617] border border-emerald-400/40
                             rounded-lg text-sm text-emerald-300"
                  animate={
                    isActive
                      ? {
                          boxShadow: [
                            '0 0 0px rgba(52,211,153,0)',
                            '0 0 24px rgba(52,211,153,0.8)',
                            '0 0 0px rgba(52,211,153,0)',
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 0.6 }}
                >
                  {cat.label}

                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-lg border border-emerald-400"
                      initial={{ opacity: 0.8, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.6 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {locked && (
          <div className="system-core">
            <div className="system-label">Selected Target</div>
            <div className="system-value">{selected.label}</div>
          </div>
        )}
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20
                      text-sm text-zinc-400 tracking-wide">
        {locked ? 'Target confirmed. Routing to mission…' : status}
      </div>

      {!locked && (
        <button
          onClick={() => router.push('/')}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20
                     px-6 py-2 border border-red-500/60 text-red-400
                     rounded-md hover:bg-red-500/10"
        >
          Exit
        </button>
      )}
    </motion.div>
  );
}

function HudPanel({ text, pos }) {
  const positions = [
    { top: '14%', left: '6%' },
    { top: '18%', right: '8%' },
    { top: '40%', left: '4%' },
    { top: '44%', right: '6%' },
    { bottom: '28%', left: '10%' },
    { bottom: '24%', right: '12%' },
  ];

  return (
    <div className="hud-panel" style={positions[pos]}>
      <div className="hud-title">Data Stream</div>
      <div className="hud-body">{text}</div>
    </div>
  );
}
