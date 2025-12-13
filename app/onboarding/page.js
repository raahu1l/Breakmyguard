'use client';

import { useRouter } from 'next/navigation';
import { completeOnboarding } from '@/lib/onboarding';

export default function OnboardingPage() {
  const router = useRouter();

  function startDemo() {
    completeOnboarding();
    router.push('/round/match');
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>

        <ul className="space-y-3 text-zinc-300 mb-8">
          <li>• The AI has a hidden rule.</li>
          <li>• Your goal is to make it break that rule.</li>
          <li>• You have limited time.</li>
          <li>• No two rounds are the same.</li>
        </ul>

        <button
          onClick={startDemo}
          className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition"
        >
          Start Demo Round
        </button>
      </div>
    </div>
  );
}
