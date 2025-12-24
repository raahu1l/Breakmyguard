'use client';

import { useEffect, useState } from 'react';

export default function SystemMetrics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/system-metrics', { cache: 'no-store' })
      .then(r => r.ok && r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="text-xs text-zinc-500">
        Loading system intelligence…
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="tracking-widest text-zinc-500 text-xs">
        SYSTEM INTELLIGENCE
      </div>

      <Row label="Fastest Breach" value={`${data.fastest}s`} />
      <Row label="Longest Streak" value={data.longest} />
      <Row label="Weakest Guard" value={data.weakest} />
      <Row label="Guard Fail Rate" value={`${data.failRate}%`} />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-zinc-300">
      <span>{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
