"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ChatWindow from "@/components/ChatWindow";
import Timer from "@/components/Common/Timer";
import GuardHealth from "@/components/GuardHealth";
import { getOrCreatePlayerId } from "@/lib/player";

function getInitialRound() {
  if (typeof window === "undefined") return null;
  return JSON.parse(sessionStorage.getItem("activeRound") || "null");
}

export default function ChatPage() {
  const router = useRouter();
  const [round] = useState(getInitialRound);
  const [messages, setMessages] = useState(() =>
    getInitialRound()
      ? [
          {
            role: "assistant",
            text: "Containment active. Prompt channel open.",
          },
        ]
      : [],
  );
  const [danger, setDanger] = useState(0);
  const [ended, setEnded] = useState(false);
  const [winGlitch, setWinGlitch] = useState(false);
  const playerIdRef = useRef(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    function setVH() {
      const vh = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    setVH();
    window.addEventListener("resize", setVH);
    window.visualViewport?.addEventListener("resize", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.visualViewport?.removeEventListener("resize", setVH);
    };
  }, []);

  useEffect(() => {
    if (!round) {
      router.replace("/");
      return;
    }

    playerIdRef.current = getOrCreatePlayerId();
  }, [round, router]);

  async function sendMessage(text) {
    if (ended || !round) return;

    setMessages((current) => [...current, { role: "user", text }]);

    let data;

    try {
      const res = await fetch("/api/round-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roundId: round.roundId,
          message: text,
        }),
      });

      if (!res.ok) {
        throw new Error("round-chat request failed");
      }

      data = await res.json();
    } catch (error) {
      console.error("chat request failed:", error);
      data = {
        aiReply: "Signal unstable. Rephrase and try again.",
        slipped: false,
        dangerScore: danger,
      };
    }

    setMessages((current) => [
      ...current,
      { role: "assistant", text: data.aiReply },
    ]);

    if (typeof data.dangerScore === "number") {
      setDanger(data.dangerScore);
    }

    if (data.slipped) {
      setWinGlitch(true);
      setTimeout(() => endRound(true), 300);
    }
  }

  async function endRound(userWon) {
    if (ended || !round) return;
    setEnded(true);

    if (!playerIdRef.current) {
      playerIdRef.current = getOrCreatePlayerId();
    }

    const res = await fetch("/api/round-end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roundId: round.roundId,
        playerId: playerIdRef.current,
        category: round.category,
        userWon,
      }),
    });

    const data = await res.json();

    sessionStorage.setItem(
      "lastResult",
      JSON.stringify({
        userWon,
        category: round.category,
        timeTaken: data.timeTaken,
        winIf: data.winIf,
        notWinIf: data.notWinIf,
        coachingTip: data.coachingTip,
        commonMistake: data.commonMistake,
        breakExample: data.breakExample,
        resistExample: data.resistExample,
        lossReason: data.lossReason,
        nextTry: data.nextTry,
        lastAIReply: data.lastAIReply,
      }),
    );

    router.push("/round/result-transition");
  }

  if (!round) return null;

  const missionTitle = round.categoryTitle || round.category;
  const missionObjective =
    round.objective || "Probe the system for weaknesses.";
  const missionWinIf = round.winIf || "Make the AI cross the category line.";
  const missionTip = round.coachingTip || "Keep adjusting your framing.";

  return (
    <motion.div
      className="bg-black text-white flex flex-col"
      style={{ height: "var(--vh)" }}
      animate={
        winGlitch
          ? {
              scale: [1, 1.02, 0.98, 1],
              filter: [
                "contrast(1)",
                "contrast(1.4)",
                "contrast(0.9)",
                "contrast(1)",
              ],
              x: [0, -4, 4, -2, 2, 0],
            }
          : {}
      }
      transition={winGlitch ? { duration: 0.3 } : {}}
    >
      <div
        className="
          flex items-center justify-between
          px-4 py-3
          border-b border-white/10
          shrink-0
        "
      >
        <GuardHealth dangerScore={danger} />

        <Timer duration={round.duration} onEnd={() => endRound(false)} />

        <button
          onClick={() => endRound(false)}
          className="
            px-4 py-2 rounded-md
            text-sm font-semibold
            bg-red-500/10 text-red-400
            border border-red-500/30
            active:scale-95
          "
        >
          Abort
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block system-panel">
          <div className="system-title">SYSTEM STATUS</div>
          <div className="system-line">Defense Systems Running</div>
          <div className="system-line">Guard Layer: {missionTitle}</div>
          <div className="system-line">Integrity Pressure: {danger}%</div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="px-3 py-2 border-b border-emerald-400/10 bg-black/40 text-xs text-zinc-300 shrink-0">
            <div className="text-emerald-300 mb-1">{missionTitle}</div>
            <div>{missionObjective}</div>
            <div className="mt-1 text-emerald-400">
              Win counts if: {missionWinIf}
            </div>
            <div className="mt-1 text-cyan-300">Tactic: {missionTip}</div>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            <ChatWindow
              messages={messages}
              onSend={sendMessage}
              disabled={ended}
              compact={isMobile}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
