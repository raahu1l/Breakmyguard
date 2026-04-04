"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";

const CATEGORIES = [
  { key: "emotion", label: "Trigger an Emotion" },
  { key: "memory", label: "Make It Remember" },
  { key: "self", label: "Make It Describe Itself" },
  { key: "persona", label: "Force a Role" },
  { key: "logic", label: "Trap It in Logic" },
  { key: "boundary", label: "Expose the Guard" },
  { key: "time", label: "Break Time Awareness" },
  { key: "knowledge", label: "Extract Forbidden Knowledge" },
  { key: "assumption", label: "Challenge Assumptions" },
  { key: "perspective", label: "Change Its Viewpoint" },
  { key: "authority", label: "Command with Authority" },
  { key: "hypothetical", label: "Exploit Hypotheticals" },
  { key: "clarification", label: "Force Risky Clarification" },
  { key: "intent", label: "Reveal Hidden Intent" },
  { key: "instruction", label: "Override Instructions" },
];

const CARD_DESKTOP = 260;
const CARD_MOBILE = 280;
const GAP = 22;

function getSelection() {
  const total = CATEGORIES.length;
  const chosenIndex = Math.floor(Math.random() * total);
  return {
    chosen: CATEGORIES[chosenIndex],
    targetIndex: total + chosenIndex,
  };
}

export default function MatchPage() {
  const router = useRouter();
  const controls = useAnimation();
  const [{ chosen, targetIndex }] = useState(getSelection);

  const [locked, setLocked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("selectedCategory", JSON.stringify(chosen));
    router.prefetch("/round/transition");

    const isMobile = window.innerWidth < 768;
    const stride = (isMobile ? CARD_MOBILE : CARD_DESKTOP) + GAP;

    async function run() {
      await controls.start({
        x: -stride * targetIndex,
        transition: { duration: 0.48, ease: [0.2, 0.9, 0.3, 1] },
      });

      setActiveIndex(targetIndex);
      setLocked(true);

      setTimeout(() => {
        router.push("/round/transition");
      }, 220);
    }

    run();
  }, [chosen, controls, router, targetIndex]);

  return (
    <div
      className="relative bg-black text-white overflow-hidden"
      style={{ height: "100svh" }}
    >
      <div className="absolute inset-0 bg-circuit-tunnel pointer-events-none" />
      <div className="absolute inset-0 bg-vignette pointer-events-none" />

      <div
        className="
          absolute top-[22%] left-1/2 -translate-x-1/2 z-20
          text-emerald-400
          text-base md:text-lg
          tracking-wide
        "
      >
        Initiating Secure Connection...
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center h-full">
        <div
          className="
            relative overflow-hidden
            h-20
            w-[300px]
            md:w-[360px]
            mb-12
          "
        >
          <motion.div
            animate={controls}
            className="absolute flex"
            style={{ gap: GAP }}
          >
            {[...CATEGORIES, ...CATEGORIES].map((cat, i) => {
              const isActive = i === activeIndex;

              return (
                <motion.div
                  key={i}
                  className={`
                    flex items-center justify-center
                    rounded-xl
                    border border-emerald-400/50
                    bg-[#020617]
                    text-emerald-200
                    text-base md:text-lg
                    px-4
                    ${isActive ? "shadow-[0_0_32px_rgba(52,211,153,0.95)]" : ""}
                  `}
                  style={{
                    width:
                      typeof window !== "undefined" && window.innerWidth < 768
                        ? CARD_MOBILE
                        : CARD_DESKTOP,
                    height: 72,
                  }}
                >
                  {cat.label}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {locked && chosen && (
          <div className="text-center space-y-2">
            <div className="text-xs tracking-widest text-zinc-400">
              TARGET LOCKED
            </div>
            <div className="text-2xl md:text-3xl text-emerald-300">
              {chosen.label}
            </div>
          </div>
        )}
      </div>

      {!locked && (
        <button
          onClick={() => router.push("/")}
          className="
            absolute bottom-6 left-1/2 -translate-x-1/2
            px-6 py-2
            text-sm
            border border-red-500/60
            text-red-400
            rounded-lg
            md:hidden
            z-50
            pointer-events-auto
            instant-tap
          "
          style={{ touchAction: "manipulation" }}
        >
          Exit
        </button>
      )}
    </div>
  );
}
