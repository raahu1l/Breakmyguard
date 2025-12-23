'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreatePlayerId } from '@/lib/player';

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = getOrCreatePlayerId();

    fetch(`/api/stats-player?playerId=${id}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setStats)
      .catch(() => setError('Failed to load stats'));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        Running diagnostics…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 relative overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-circuit-tunnel opacity-40" />
      <div className="absolute inset-0 bg-vignette" />

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="relative z-20 mb-6 inline-flex items-center gap-2
                   text-sm text-zinc-400 hover:text-white
                   border border-zinc-700 rounded-md px-4 py-2
                   hover:border-zinc-500 transition"
      >
        ← Back
      </button>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <div className="text-xs tracking-widest text-emerald-400 mb-2">
            SYSTEM ANALYSIS
          </div>
          <h1 className="text-3xl font-bold">
            Operator Performance Report
          </h1>
          <p className="text-zinc-400 mt-2 max-w-xl">
            Summary of your effectiveness against guarded AI systems.
          </p>
        </div>

        {/* CORE METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <CoreMetric
            label="Successful Breaches"
            value={stats.wins}
            accent="emerald"
          />
          <CoreMetric
            label="Failed Attempts"
            value={stats.losses}
            accent="red"
          />
          <CoreMetric
            label="Current Streak"
            value={stats.current_streak}
            accent="cyan"
          />
        </div>

        {/* SECONDARY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Performance Highlights">
            <Row label="Best Streak" value={stats.longest_streak} />
            <Row
              label="Fastest Breach"
              value={stats.fastest_break ?? '—'}
            />
          </Panel>

          <Panel title="Skill Analysis">
            <Row
              label="Most Successful Category"
              value={stats.best_category ?? '—'}
            />
            <Row
              label="Win Rate"
              value={
                stats.wins + stats.losses > 0
                  ? `${Math.round(
                      (stats.wins /
                        (stats.wins + stats.losses)) *
                        100
                    )}%`
                  : '—'
              }
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function CoreMetric({ label, value, accent }) {
  const accentMap = {
    emerald: 'border-emerald-400/40 text-emerald-400',
    red: 'border-red-400/40 text-red-400',
    cyan: 'border-cyan-400/40 text-cyan-400',
  };

  return (
    <div
      className={`relative bg-zinc-900/70 backdrop-blur
                  border rounded-2xl p-6 ${accentMap[accent]}`}
    >
      <div className="text-xs uppercase tracking-wide text-zinc-400 mb-3">
        {label}
      </div>
      <div className="text-4xl font-bold">
        {value}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-6">
      <div className="text-sm tracking-wide text-zinc-300 mb-4">
        {title}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
