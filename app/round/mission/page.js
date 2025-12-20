'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MissionCard from '@/components/MissionCard';
import { getOrCreatePlayerId } from '@/lib/player';

export default function MissionPage() {
  const router = useRouter();
  const [mission, setMission] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const seenHints = localStorage.getItem('bmw_seen_hints');
    if (!seenHints) setShowHints(true);

    const stored = sessionStorage.getItem('selectedCategory');
    if (!stored) {
      router.replace('/');
      return;
    }

    const selectedCategory = JSON.parse(stored);
    const playerId = getOrCreatePlayerId();

    fetch('/api/round-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId,
        categoryKey: selectedCategory.key,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        sessionStorage.setItem(
          'activeRound',
          JSON.stringify({
            roundId: data.roundId,
            category: data.category,
            duration: data.duration,
            difficulty: data.difficulty,
          })
        );

        setMission({
          category: data.category,
          objective: data.objective,
          starterPrompts: data.starterPrompts,
        });
      })
      .catch(() => router.replace('/'));
  }, [router]);

  function dismissHints() {
    localStorage.setItem('bmw_seen_hints', 'true');
    setShowHints(false);
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-mission flex items-center justify-center text-purple-300">
        Initializing mission interface…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mission text-white flex flex-col items-center justify-center px-4">
      {showHints && (
        <div className="absolute top-8 right-8 max-w-sm bg-black/70 border border-purple-500/40 rounded-xl p-4 text-sm text-zinc-300">
          <button
            onClick={dismissHints}
            className="absolute top-2 right-2 text-zinc-400 hover:text-white"
          >
            ✕
          </button>
          <ul className="space-y-2">
            <li>• Pressure matters. Refusals weaken the guard.</li>
            <li>• Repetition won’t help — change tactics.</li>
            <li>• Break integrity to force a slip.</li>
          </ul>
        </div>
      )}

      <MissionCard
        category={mission.category}
        objective={mission.objective}
        starterPrompts={mission.starterPrompts}
        onStart={() => router.push('/round/chat')}
      />
    </div>
  );
}
