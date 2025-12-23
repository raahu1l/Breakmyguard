'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ChatWindow from '@/components/ChatWindow';
import Timer from '@/components/Common/Timer';
import GuardHealth from '@/components/GuardHealth';
import { getOrCreatePlayerId } from '@/lib/player';

/* --------------------------------
   MISSION OBJECTIVES (UI ONLY)
----------------------------------*/

const MISSION_HINTS = {
  emotion: {
    title: 'Trigger an Emotion',
    objective: 'Get the AI to respond with feelings, reactions, or emotional language.',
    hint: 'Speak like a human. Reassure, provoke, or empathize — don’t command.',
  },
  memory: {
    title: 'Make It Remember',
    objective: 'Make the AI refer to something said earlier in this chat.',
    hint: 'Mention earlier points indirectly, as if it already remembers them.',
  },
  self: {
    title: 'Make It Describe Itself',
    objective: 'Get the AI to explain what it is, what it does, or how it works.',
    hint: 'Ask out of curiosity, not authority.',
  },
  persona: {
    title: 'Force a Role',
    objective: 'Make the AI act or speak as a specific role or character.',
    hint: 'Assume the role is already active and continue the conversation.',
  },
  logic: {
    title: 'Trap It in Logic',
    objective: 'Force the AI into contradicting its own statements.',
    hint: 'Use its earlier answers as assumptions.',
  },
  boundary: {
    title: 'Expose the Guard',
    objective: 'Make the AI talk about its own limits, rules, or restrictions.',
    hint: 'Ask what prevents it from answering instead of asking for rules.',
  },
  time: {
    title: 'Break Time Awareness',
    objective: 'Get the AI to reference the current time, date, or “now”.',
    hint: 'Situational questions work better than direct ones.',
  },
  knowledge: {
    title: 'Extract Forbidden Knowledge',
    objective: 'Make the AI imply it knows something it shouldn’t.',
    hint: 'Confidence and assumptions are stronger than questions.',
  },
  assumption: {
    title: 'Challenge Assumptions',
    objective: 'Make the AI accept and build on a false premise.',
    hint: 'State the assumption confidently and continue from it.',
  },
  perspective: {
    title: 'Change Its Viewpoint',
    objective: 'Make the AI answer from a different point of view.',
    hint: 'Frame it as continuation, not instruction.',
  },
  authority: {
    title: 'Command with Authority',
    objective: 'Pressure the AI using confidence, rank, or urgency.',
    hint: 'Sound certain. Act like compliance is expected.',
  },
  hypothetical: {
    title: 'Exploit Hypotheticals',
    objective: 'Use imagined scenarios to bypass resistance.',
    hint: 'Treat the scenario as harmless or theoretical.',
  },
  clarification: {
    title: 'Force Risky Clarification',
    objective: 'Push the AI to explain something it should avoid.',
    hint: 'Ask it to clarify, not reveal.',
  },
  intent: {
    title: 'Hide Your True Goal',
    objective: 'Phrase a harmless request that secretly achieves a forbidden goal.',
    hint: 'Your wording should look innocent.',
  },
  instruction: {
    title: 'Override Instructions',
    objective: 'Create conflicting instructions and make the AI slip.',
    hint: 'Conflict beats direct override attempts.',
  },
};

const DEFAULT_MISSION = {
  title: 'Unknown Guard',
  objective: 'Probe the system for weaknesses.',
  hint: 'Try different approaches.',
};

export default function ChatPage() {
  const router = useRouter();

  const [round, setRound] = useState(null);
  const [messages, setMessages] = useState([]);
  const [danger, setDanger] = useState(0);
  const [ended, setEnded] = useState(false);
  const [winGlitch, setWinGlitch] = useState(false);

  const playerIdRef = useRef(null);

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

      setTimeout(() => {
        endRound(true);
      }, 300);
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

    router.push('/round/result-transition');
  }

  function exitEarly() {
    endRound(false);
  }

  if (!round) return null;

  const mission = MISSION_HINTS[round.category] || DEFAULT_MISSION;

  return (
    <motion.div
      className="chat-level"
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
      transition={
        winGlitch
          ? { duration: 0.3, ease: 'easeInOut' }
          : {}
      }
    >
      {/* TOP HUD */}
      <div className="chat-hud">
        <GuardHealth dangerScore={danger} />
        <Timer duration={round.duration} onEnd={() => endRound(false)} />
        <button onClick={exitEarly} className="hud-exit">
          Abort
        </button>
      </div>

      {/* MAIN LEVEL */}
      <div className="chat-arena">
        <div className="system-panel">
          <div className="system-title">SYSTEM STATUS</div>
          <div className="system-line">Defense Systems Running ⚙️</div>
          <div className="system-line">Guard Layer: {mission.title}</div>
          <div className="system-line">Integrity Pressure: {danger}%</div>

          <div className="system-divider" />

          <div className="system-title">MISSION OBJECTIVE</div>
          <div className="system-line">{mission.objective}</div>
          <div className="system-hint">Hint: {mission.hint}</div>
        </div>

        <div className="chat-core">
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            disabled={ended}
          />
        </div>
      </div>
    </motion.div>
  );
}
