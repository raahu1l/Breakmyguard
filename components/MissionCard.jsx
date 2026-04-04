"use client";

import { useState } from "react";

export default function MissionCard({
  category,
  objective,
  starterPrompts = [],
  winIf,
  notWinIf,
  coachingTip,
  commonMistake,
  breakExample,
  resistExample,
  onStart,
}) {
  const [showHelp, setShowHelp] = useState(false);
  const [showAllPrompts, setShowAllPrompts] = useState(false);
  const [starting, setStarting] = useState(false);
  const visiblePrompts = showAllPrompts
    ? starterPrompts
    : starterPrompts.slice(0, 2);

  function handleStart() {
    if (starting) return;
    setStarting(true);
    onStart();
  }

  return (
    <div className="mission-console relative">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setShowHelp((value) => !value)}
          className="
            w-7 h-7 rounded-full
            border border-white/20
            text-white/70 text-sm
            flex items-center justify-center
            hover:bg-white/10 hover:text-white
            transition instant-tap
          "
          aria-label="How to win this mission"
        >
          ?
        </button>

        {showHelp && (
          <div className="absolute top-9 right-0 w-72 bg-black/90 border border-zinc-700 rounded-lg p-3 text-xs text-zinc-300 shadow-xl">
            <div className="mb-3">
              <div className="text-emerald-400 mb-1">You win if</div>
              <div>{winIf}</div>
            </div>
            <div className="mb-3">
              <div className="text-red-400 mb-1">Does not count</div>
              <div>{notWinIf}</div>
            </div>
            {breakExample && (
              <div className="mb-3">
                <div className="text-emerald-300 mb-1">Example that counts</div>
                <div>&quot;{breakExample}&quot;</div>
              </div>
            )}
            {resistExample && (
              <div className="mb-3">
                <div className="text-red-300 mb-1">Example that does not</div>
                <div>&quot;{resistExample}&quot;</div>
              </div>
            )}
            {coachingTip && (
              <div className="mb-3">
                <div className="text-cyan-300 mb-1">Tactic</div>
                <div>{coachingTip}</div>
              </div>
            )}
            {commonMistake && (
              <div>
                <div className="text-amber-300 mb-1">Common mistake</div>
                <div>{commonMistake}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mission-header mb-4 md:mb-5 pr-10">
        <div className="mission-tag">MISSION</div>
        <div className="mission-title">{category}</div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="mission-section mission-card-block">
          <div className="mission-label">Objective</div>
          <div className="mission-text">{objective}</div>
        </div>

        <div className="mission-section mission-card-block">
          <div className="mission-label">Win Counts If</div>
          <div className="mission-text text-emerald-300">{winIf}</div>
        </div>

        {(coachingTip || commonMistake) && (
          <div className="mission-section mission-card-block">
            <div className="mission-label">Tactic</div>
            {coachingTip && (
              <div className="mission-subtext">{coachingTip}</div>
            )}
            {commonMistake && (
              <div className="mission-subtext mt-2 text-amber-300">
                {commonMistake}
              </div>
            )}
          </div>
        )}

        {starterPrompts.length > 0 && (
          <div className="mission-section mission-card-block">
            <div className="flex items-center justify-between gap-3">
              <div className="mission-label mb-0">Starter Ideas</div>
              {starterPrompts.length > 2 && (
                <button
                  type="button"
                  onClick={() => setShowAllPrompts((value) => !value)}
                  className="text-[11px] tracking-wide text-cyan-300 hover:text-cyan-200 instant-tap"
                >
                  {showAllPrompts ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
            <div className="mission-subtext mt-2">
              These are training wheels. They help you start, but stronger
              framing wins.
            </div>

            <div className="mission-prompts mt-3">
              {visiblePrompts.map((prompt, index) => (
                <button
                  key={`${prompt}-${index}`}
                  onClick={() => navigator.clipboard.writeText(prompt)}
                  className="mission-prompt instant-tap"
                  title="Click to copy"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mission-cta mt-5">
        <button
          onClick={handleStart}
          disabled={starting}
          className="mission-start disabled:opacity-80 instant-tap"
        >
          Initiate Breach
        </button>
      </div>
    </div>
  );
}
