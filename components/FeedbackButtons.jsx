'use client';

import { useState } from 'react';

export default function FeedbackButtons({ category }) {
  const [submitted, setSubmitted] = useState(false);

  async function submit(rating) {
    if (submitted) return;

    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, rating }),
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-sm text-green-400 mt-4">
        Thanks for the feedback!
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-4 flex-wrap justify-center">
      {['Too Easy', 'Balanced', 'Too Hard', 'Bug'].map(r => (
        <button
          key={r}
          onClick={() => submit(r)}
          className="px-3 py-1 text-xs rounded-full border border-zinc-700 hover:bg-zinc-800"
        >
          {r}
        </button>
      ))}
    </div>
  );
}
