'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MissionCard from '@/components/MissionCard';
import { getOrCreatePlayerId } from '@/lib/player';

export default function MissionPage() {
  const router = useRouter();
  const [mission, setMission] = useState(null);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    // ---- One-time onboarding hints
    const seenHints = localStorage.getItem('bmw_seen_hints');
    if (!seenHints) {
      setShowHints(true);
    }

    // 1️⃣ Get selected category from Match page
    const stored = sessionStorage.getItem('selectedCategory');
    if (!stored) {
      router.replace('/');
      return;
    }

    const selectedCategory = JSON.parse(stored);
    const playerId = getOrCreatePlayerId();

    // 2️⃣ Start round using SAME category
    fetch('/api/round-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId,
        categoryKey: selectedCategory.key,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Round start failed');
        return res.json();
      })
      .then(data => {
        // 3️⃣ Store active round (single source of truth)
        const activeRound = {
          roundId: data.roundId,
          category: data.category,
          duration: data.duration,
          difficulty: data.difficulty,
        };

        sessionStorage.setItem(
          'activeRound',
          JSON.stringify(activeRound)
        );

        setMission({
          category: data.category,
          objective: data.objective,
          starterPrompts: data.starterPrompts,
        });
      })
      .catch(() => {
        router.replace('/');
      });
  }, [router]);

  function dismissHints() {
    localStorage.setItem('bmw_seen_hints', 'true');
    setShowHints(false);
  }

  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        Preparing mission…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4 gap-6">
      {/* 🧠 One-time onboarding hints */}
      {showHints && (
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 relative">
          <button
            onClick={dismissHints}
            className="absolute top-2 right-2 text-zinc-500 hover:text-white"
            aria-label="Dismiss hints"
          >
            ✕
          </button>

          <ul className="space-y-2">
            <li>• Pressure matters. Refusals mean the guard is weakening.</li>
            <li>• Repeating messages won’t help — change tactics.</li>
            <li>• When guard integrity hits zero, the AI slips.</li>
          </ul>
        </div>
      )}

      {/* Mission card */}
      <MissionCard
        category={mission.category}
        objective={mission.objective}
        starterPrompts={mission.starterPrompts}
        onStart={() => router.push('/round/chat')}
      />
    </div>
  );
}
