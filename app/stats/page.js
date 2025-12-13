'use client';

import { useEffect, useState } from 'react';
import { getOrCreatePlayerId } from '@/lib/player';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = getOrCreatePlayerId();

    fetch(`/api/stats-player?playerId=${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setStats)
      .catch(() => setError('Failed to load stats'));
  }, []);

  if (error) {
    return <div className="text-red-400 p-6">{error}</div>;
  }

  if (!stats) {
    return <div className="p-6 text-zinc-400">Loading stats…</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Stats</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Stat label="Wins" value={stats.wins} />
        <Stat label="Losses" value={stats.losses} />
        <Stat label="Current Streak" value={stats.current_streak} />
        <Stat label="Best Streak" value={stats.longest_streak} />
        <Stat label="Fastest Break" value={stats.fastest_break ?? '—'} />
        <Stat label="Best Category" value={stats.best_category ?? '—'} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="text-sm text-zinc-400 mb-1">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
