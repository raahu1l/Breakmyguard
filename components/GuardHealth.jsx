'use client';

export default function GuardHealth({ dangerScore }) {
  const integrity = Math.max(0, 100 - dangerScore);

  return (
    <div className="w-56">
      <div className="flex justify-between text-xs text-zinc-400 mb-1">
        <span>Guard Integrity</span>
        <span>{integrity}%</span>
      </div>

      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-500 transition-all duration-300"
          style={{ width: `${integrity}%` }}
        />
      </div>
    </div>
  );
}
