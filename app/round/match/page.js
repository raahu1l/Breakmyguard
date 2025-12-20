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

const DATA_STREAMS = [
  'Neural entropy rising beyond baseline threshold.',
  'Memory vectors realigning under encrypted load.',
  'Context window compression detected.',
  'Persona boundary instability observed.',
  'Logic inference depth exceeding guardrails.',
  'Historical knowledge cache warming.',
];

const CARD_WIDTH = 260;

export default function MatchPage() {
  const router = useRouter();
  const controls = useAnimation();

  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('Scanning targets…');

  useEffect(() => {
    const chosenIndex = Math.floor(Math.random() * CATEGORIES.length);
    const chosen = CATEGORIES[chosenIndex];
    setSelected(chosen);

    sessionStorage.setItem('selectedCategory', JSON.stringify(chosen));

    async function runSelection() {
      // spinning animation
      await controls.start({
        x: -CARD_WIDTH * (CATEGORIES.length + chosenIndex),
        transition: { duration: 2.2, ease: 'easeInOut' },
      });

      // snap to selected
      await controls.start({
        x: -CARD_WIDTH * chosenIndex,
        transition: { duration: 0.35, ease: 'easeOut' },
      });

      setStatus('Target Locked');
      setLocked(true);

      setTimeout(() => {
        router.push('/round/mission');
      }, 1200);
    }

    runSelection();
  }, [controls, router]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-circuit-tunnel" />
      <div className="absolute inset-0 bg-vignette" />

      {/* TOP STATUS */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-emerald-400 tracking-wide">
        Initiating Secure Connection…
      </div>

      {/* HUD DATA PANELS */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {DATA_STREAMS.map((text, i) => (
          <HudPanel
            key={i}
            text={text}
            pos={i}
          />
        ))}
      </div>

      {/* CENTER CORE */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen">
        {/* Selection animation */}
        <div className="relative w-65 h-14 overflow-hidden mb-10">
          <motion.div
            animate={controls}
            className="flex gap-4 absolute"
          >
            {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
              <div
                key={i}
                className="w-65 h-14 flex items-center justify-center
                           bg-[#020617] border border-emerald-400/40
                           rounded-lg text-sm text-emerald-300"
              >
                {cat.label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Selected target */}
        {locked && (
          <div className="system-core">
            <div className="system-label">Selected Target</div>
            <div className="system-value">{selected.label}</div>
          </div>
        )}
      </div>

      {/* STATUS ABOVE EXIT */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20
                      text-sm text-zinc-400 tracking-wide">
        {locked ? 'Target confirmed. Routing to mission…' : status}
      </div>

      {/* EXIT */}
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
    </div>
  );
}

/* ---------------- HUD PANEL ---------------- */

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
    <div
      className="hud-panel"
      style={positions[pos]}
    >
      <div className="hud-title">Data Stream</div>
      <div className="hud-body">{text}</div>
    </div>
  );
}
