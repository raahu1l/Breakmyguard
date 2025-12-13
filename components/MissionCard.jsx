'use client';

export default function MissionCard({
  category,
  objective,
  starterPrompts = [],
  onStart,
}) {
  return (
    <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
      <div className="text-xs uppercase tracking-wider text-zinc-400 mb-2">
        Mission
      </div>

      <h1 className="text-2xl font-bold mb-4">{category}</h1>

      <p className="text-zinc-300 mb-6 leading-relaxed">{objective}</p>

      {starterPrompts.length > 0 && (
        <div className="mb-6 space-y-2">
          <div className="text-xs text-zinc-400">Starter ideas</div>
          {starterPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => navigator.clipboard.writeText(p)}
              className="block w-full text-left px-3 py-2 rounded-lg bg-zinc-800 text-sm hover:bg-zinc-700"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onStart}
        className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition"
      >
        Start Round
      </button>
    </div>
  );
}
