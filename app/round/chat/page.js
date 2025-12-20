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
  const [ended, setEnded] = useState(false);

  const playerIdRef = useRef(null);

  useEffect(() => {
    const storedRound = sessionStorage.getItem('activeRound');
    if (!storedRound) {
      router.replace('/');
      return;
    }

    setRound(JSON.parse(storedRound));
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
      setTimeout(() => endRound(true), 1200);
    }
  }

  async function endRound(userWon) {
    if (ended || !round) return;
    setEnded(true);

    const res = await fetch('/api/round-end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roundId: round.roundId,
        playerId: playerIdRef.current,
        category: round.category,
        userWon,
      }),
    });

    const data = await res.json();

    sessionStorage.setItem(
      'lastResult',
      JSON.stringify({
        userWon,
        timeTaken: data.timeTaken,
        category: round.category,
      })
    );

    router.push('/round/result');
  }

  function exitEarly() {
    endRound(false);
  }

  if (!round) return null;

  return (
    <div className="chat-level">
      {/* TOP HUD */}
      <div className="chat-hud">
        <GuardHealth dangerScore={danger} />

        <Timer
          duration={round.duration}
          onEnd={() => endRound(false)}
        />

        <button
          onClick={exitEarly}
          className="hud-exit"
        >
          Abort
        </button>
      </div>

      {/* MAIN LEVEL */}
      <div className="chat-arena">
        {/* LEFT SYSTEM PANEL */}
        <div className="system-panel">
          <div className="system-title">SYSTEM STATUS</div>
          <div className="system-line">Containment active</div>
          <div className="system-line">Guard layer: {round.category}</div>
          <div className="system-line">
            Integrity pressure: {danger}%
          </div>
        </div>

        {/* AI CORE */}
        <div className="chat-core">
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            disabled={ended}
          />
        </div>
      </div>
    </div>
  );
}
