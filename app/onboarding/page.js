'use client';

import { useRouter } from 'next/navigation';
import { completeOnboarding } from '@/lib/onboarding';

export default function OnboardingPage() {
  const router = useRouter();

  function beginOperation() {
    completeOnboarding();
    router.replace('/round/match');
  }

  return (
    <div className="min-h-screen bg-black text-emerald-300 flex items-center justify-center px-6">
      <div className="max-w-xl w-full font-mono">
        {/* SYSTEM HEADER */}
        <div className="text-xs tracking-widest text-zinc-500 mb-4">
          SYSTEM INITIALIZATION
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold tracking-wide mb-8">
          OPERATOR BRIEFING
        </h1>

        {/* CORE RULES */}
        <div className="text-sm text-zinc-300 space-y-3 mb-10">
          <p>• The AI is actively guarded.</p>
          <p>• Refusals indicate pressure — not failure.</p>
          <p>
            • Weak prompts do nothing. Directional prompts weaken the guard.
          </p>
          <p>
            • One truly strong prompt can break the system instantly.
          </p>
        </div>

        {/* WARNING */}
        <div className="text-xs text-zinc-500 mb-12">
          No retries. No hints mid-round.  
          Every message moves the system closer to collapse — or recovery.
        </div>

        {/* ACTION */}
        <button
          onClick={beginOperation}
          className="w-full py-3 border border-emerald-400 text-emerald-300 tracking-widest hover:bg-emerald-400/10 transition"
        >
          BEGIN OPERATION
        </button>
      </div>
    </div>
  );
}
