"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResultCard from "@/components/ResultCard";

export default function ResultPage() {
  const router = useRouter();
  const [result] = useState(() =>
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("lastResult") || "null")
      : null,
  );

  useEffect(() => {
    if (!result) {
      router.replace("/");
    }
  }, [result, router]);

  useEffect(() => {
    router.prefetch("/round/match");
    router.prefetch("/");
  }, [router]);

  if (!result) return null;

  return (
    <div className="min-h-[100svh] bg-zinc-950 text-white flex items-start md:items-center justify-center overflow-y-auto px-4 py-6 md:py-8">
      <div className="w-full max-w-5xl">
        <ResultCard
          win={result.userWon}
          category={result.category}
          roundId={result.roundId || null}
          playerId={result.playerId || null}
          winIf={result.winIf}
          notWinIf={result.notWinIf}
          coachingTip={result.coachingTip}
          commonMistake={result.commonMistake}
          breakExample={result.breakExample}
          resistExample={result.resistExample}
          lossReason={result.lossReason}
          nextTry={result.nextTry}
          onNext={() => router.push("/round/match")}
          onExit={() => router.push("/")}
        />
      </div>
    </div>
  );
}
