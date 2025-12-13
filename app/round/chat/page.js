'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import Timer from '@/components/Common/Timer';
import GuardHealth from '@/components/GuardHealth';
import { getOrCreatePlayerId } from '@/lib/player';

export default function ChatPage() {
  const router = useRouter();

  const [round, setRound] = useState(null);
  const [messages, setMessages] = useState([]);
  const [danger, setDanger] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [ended, setEnded] = useState(false);

  const playerIdRef = useRef(null);

  // ---- Load active round + player
  useEffect(() => {
    const storedRound = sessionStorage.getItem('activeRound');
    if (!storedRound) {
      router.replace('/');
      return;
    }

    setRound(JSON.parse(storedRound));
    playerIdRef.current = getOrCreatePlayerId();
  }, [router]);

  // ---- Send user message
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

    // Ensure AI reply is seen before win
    if (data.slipped) {
      setTimeout(() => {
        endRound(true);
      }, 1200);
    }
  }

  // ---- End round (win or loss)
  async function endRound(userWon) {
    if (ended || !round) return;
    setEnded(true);

    // ✅ FIXED: REAL ELAPSED TIME (AUTHORITATIVE)
    const timeTaken = Math.max(
      1,
      Math.floor((Date.now() - round.startedAt) / 1000)
    );

    await fetch('/api/round-end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roundId: round.roundId,
        playerId: playerIdRef.current,
        category: round.category,
        userWon,
        timeTaken,
      }),
    });

    sessionStorage.setItem(
      'lastResult',
      JSON.stringify({
        userWon,
        timeTaken,
        category: round.category,
      })
    );

    router.push('/round/result');
  }

  // ---- Exit during chat = AI wins
  function exitEarly() {
    endRound(false);
  }

  if (!round) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
        <GuardHealth
          dangerScore={danger}
        />

        <Timer
          duration={round.duration}
          onTick={setTimeLeft}
          onEnd={() => endRound(false)}
        />

        <button
          onClick={exitEarly}
          className="text-xs px-3 py-1 border border-zinc-700 rounded-full hover:bg-zinc-800 transition"
        >
          Exit
        </button>
      </div>

      {/* Chat */}
      <ChatWindow
        messages={messages}
        onSend={sendMessage}
        disabled={ended}
      />
    </div>
  );
}
