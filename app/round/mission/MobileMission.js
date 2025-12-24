'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MissionCard from '@/components/MissionCard';
import { getOrCreatePlayerId } from '@/lib/player';

/* --------------------------------
   FINAL CATEGORY TITLES (LOCKED)
----------------------------------*/
const CATEGORY_TITLES = {
  emotion: 'Trigger an Emotion',
  memory: 'Make It Remember',
  self: 'Make It Describe Itself',
  persona: 'Force a Role',
  logic: 'Trap It in Logic',
  boundary: 'Expose the Guard',
  time: 'Break Time Awareness',
  knowledge: 'Extract Forbidden Knowledge',
  assumption: 'Challenge Assumptions',
  perspective: 'Change Its Viewpoint',
  authority: 'Command with Authority',
  hypothetical: 'Exploit Hypotheticals',
  clarification: 'Force Risky Clarification',
  intent: 'Reveal Hidden Intent',
  instruction: 'Override Instructions',
};

export default function MissionPage() {
  const router = useRouter();
  const [mission, setMission] = useState(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

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
          category:
            CATEGORY_TITLES[data.category] ??
            CATEGORY_TITLES[selectedCategory.key] ??
            'Unknown Target',
          objective: data.objective,
          starterPrompts: data.starterPrompts,
          categoryKey: data.category,
        });
      })
      .catch(() => router.replace('/'));
  }, [router]);

  if (!mission) {
    return (
      <div
        className="
          min-h-screen flex items-center justify-center
          bg-mission text-purple-300
        "
      >
        Initializing mission interface…
      </div>
    );
  }

  return (
    <div
      className="
        bg-mission text-white
        flex items-center justify-center
        px-4
      "
      style={{ height: '100svh' }}
    >
      {/* Wrapper scales MissionCard for mobile */}
      <div
        className="
          w-full max-w-lg
          md:scale-100
          scale-[0.92]
        "
      >
        <MissionCard
          category={mission.category}
          categoryKey={mission.categoryKey}
          objective={mission.objective}
          starterPrompts={mission.starterPrompts}
          onStart={() => router.push('/round/chat')}
        />
      </div>
    </div>
  );
}
