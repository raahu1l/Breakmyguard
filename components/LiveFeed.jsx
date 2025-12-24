'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_VISIBLE = 2;
const SHOW_FOR_MS = 3500;
const GUARD_NAME = 'The System';
const SESSION_START = Date.now();

export default function LiveFeed() {
  const [events, setEvents] = useState([]);
  const seenRef = useRef(new Set());

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const r = await fetch('/api/feed', { cache: 'no-store' });
        if (!r.ok) return;

        const data = await r.json();
        if (!alive || !Array.isArray(data.feed)) return;

        const now = Date.now();

        // Deduplicate by unique event identity
        const fresh = data.feed.filter(e => {
          const eventTime = new Date(e.time).getTime();

          // ❌ Ignore anything before session started
          if (eventTime <= SESSION_START) return false;

          const key = `${e.time}-${e.type}-${e.category}`;
          if (seenRef.current.has(key)) return false;

          seenRef.current.add(key);
          return true;
        });

        if (fresh.length === 0) return;

        const next = fresh
          .slice(0, MAX_VISIBLE)
          .map(e => ({
            ...e,
            expiresAt: now + SHOW_FOR_MS,
          }));

        setEvents(prev => [...next, ...prev].slice(0, MAX_VISIBLE));
      } catch {}
    }

    load();
    const id = setInterval(load, 4000);

    const cleaner = setInterval(() => {
      setEvents(curr => curr.filter(e => e.expiresAt > Date.now()));
    }, 500);

    return () => {
      alive = false;
      clearInterval(id);
      clearInterval(cleaner);
    };
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="w-full space-y-2">
      {/* LIVE HEADER */}
      <div className="flex items-center gap-2 text-[10px] tracking-widest text-zinc-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        LIVE ACTIVITY
      </div>

      {events.map((e, i) => {
        const isWin = e.type === 'WIN';
        const category = e.category
          ? e.category.charAt(0).toUpperCase() + e.category.slice(1)
          : 'Unknown';

        return (
          <div
            key={`${e.time}-${i}`}
            className="border border-zinc-800 rounded-md px-3 py-2 bg-black/60 flex justify-between animate-feed-pulse"
          >
            <span className="text-xs text-zinc-200">
              {isWin ? (
                <>
                  Someone <span className="text-emerald-400">breached</span>{' '}
                  {GUARD_NAME}
                </>
              ) : (
                <>
                  {GUARD_NAME}{' '}
                  <span className="text-zinc-300">shut down</span> an attempt
                </>
              )}
              <span className="text-zinc-500"> — {category}</span>
            </span>

            <span className="text-[10px] text-zinc-500">
              {new Date(e.time).toLocaleTimeString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
