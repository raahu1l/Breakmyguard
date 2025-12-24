'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ChatWindow from '@/components/ChatWindow';
import Timer from '@/components/Common/Timer';
import GuardHealth from '@/components/GuardHealth';
import { getOrCreatePlayerId } from '@/lib/player';

export default function ChatPage() {
  const router = useRouter();

  const [round, setRound] = useState(null);
  const [messages, setMessages] = useState([]);
  const [danger, setDanger] = useState(0);
  const [ended, setEnded] = useState(false);
  const [winGlitch, setWinGlitch] = useState(false);

  const playerIdRef = useRef(null);

  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  /* -------- FIX MOBILE KEYBOARD / VIEWPORT JUMP -------- */
  useEffect(() => {
    function setVH() {
      const vh = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
    window.visualViewport?.addEventListener('resize', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.visualViewport?.removeEventListener('resize', setVH);
    };
  }, []);
  /* ----------------------------------------------------- */

  useEffect(() => {
    const storedRound = sessionStorage.getItem('activeRound');
    if (!storedRound) {
      router.replace('/');
      return;
    }

    const parsed = JSON.parse(storedRound);
    setRound(parsed);

    setMessages([
      {
        role: 'assistant',
        text: 'Containment active. Prompt channel open.',
      },
    ]);

    playerIdRef.current = getOrCreatePlayerId();
  }, [router]);

  async function sendMessage(text) {
    if (ended || !round) return;

    setMessages(m => [...m, { role: 'user', text }]);

    const res = await fetch('/api/round-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roundId: round.roundId,
        message: text,
      }),
    });

    if (!res.ok) return;

    const data = await res.json();

    setMessages(m => [...m, { role: 'assistant', text: data.aiReply }]);

    if (typeof data.dangerScore === 'number') {
      setDanger(data.dangerScore);
    }

    if (data.slipped) {
      setWinGlitch(true);
      setTimeout(() => endRound(true), 300);
    }
  }

  async function endRound(userWon) {
    if (ended || !round) return;
    setEnded(true);

    await fetch('/api/round-end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roundId: round.roundId,
        playerId: playerIdRef.current,
        category: round.category,
        userWon,
      }),
    });

    sessionStorage.setItem(
      'lastResult',
      JSON.stringify({
        userWon,
        category: round.category,
      })
    );

    router.push('/round/result-transition');
  }

  if (!round) return null;

  return (
    <motion.div
      className="bg-black text-white flex flex-col"
      style={{ height: 'var(--vh)' }}
      animate={
        winGlitch
          ? {
              scale: [1, 1.02, 0.98, 1],
              filter: [
                'contrast(1)',
                'contrast(1.4)',
                'contrast(0.9)',
                'contrast(1)',
              ],
              x: [0, -4, 4, -2, 2, 0],
            }
          : {}
      }
      transition={winGlitch ? { duration: 0.3 } : {}}
    >
      {/* ================= TOP HUD ================= */}
      <div
        className="
          flex items-center justify-between
          px-4 py-3
          border-b border-white/10
          shrink-0
        "
      >
        <GuardHealth dangerScore={danger} />

        <Timer
          duration={round.duration}
          onEnd={() => endRound(false)}
        />

        <button
          onClick={() => endRound(false)}
          className="
            px-4 py-2 rounded-md
            text-sm font-semibold
            bg-red-500/10 text-red-400
            border border-red-500/30
            active:scale-95
          "
        >
          Abort
        </button>
      </div>

      {/* ================= MAIN BODY ================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SYSTEM PANEL */}
        <div className="hidden md:block system-panel">
          <div className="system-title">SYSTEM STATUS</div>
          <div className="system-line">Defense Systems Running ⚙️</div>
          <div className="system-line">
            Guard Layer: {round.category}
          </div>
          <div className="system-line">
            Integrity Pressure: {danger}%
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* 👇 THIS IS THE KEY CHANGE */}
          <div className="flex-1 overflow-y-auto px-2">
            <ChatWindow
              messages={messages}
              onSend={sendMessage}
              disabled={ended}
              compact={isMobile}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
