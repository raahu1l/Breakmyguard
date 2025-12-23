'use client';

export default function GuardHealth({ dangerScore = 0 }) {
  // Clamp dangerScore
  const stressRaw = Math.min(100, Math.max(0, dangerScore));

  /**
   * VISUAL CAP
   * Guard should never look "about to break"
   * Strong prompt = instant win, so visuals stop before that
   */
  const VISUAL_CAP = 65;
  const stress = Math.min(stressRaw, VISUAL_CAP);

  /**
   * Map stress → visual degradation
   * Only weak → good prompts affect visuals
   */
  const opacity = Math.max(0.35, 1 - stress / 90);
  const blur = Math.min(4, stress / 22);
  const innerScale = Math.max(0.9, 1 - stress / 300);

  return (
    <div className="w-64 select-none">
      {/* Neutral label */}
      <div className="flex justify-between text-xs text-zinc-400 mb-1">
        <span>SYSTEM</span>
        <span />
      </div>

      {/* Guard container */}
      <div className="relative h-10 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-hidden">
        {/* Outer frame */}
        <div className="absolute inset-0 border border-zinc-700/40 rounded-lg" />

        {/* Inner shield (visual-only system strain) */}
        <div
          className="absolute inset-1 rounded-md bg-emerald-400/20"
          style={{
            opacity,
            filter: `blur(${blur}px)`,
            transform: `scale(${innerScale})`,
            transition: 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease',
          }}
        />

        {/* Baseline */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-700/30" />
      </div>
    </div>
  );
}
