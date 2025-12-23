'use client';

import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-zinc-200 px-6 py-12">
      <div className="max-w-3xl mx-auto font-mono">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-xs tracking-widest text-zinc-400 hover:text-emerald-400 transition"
          >
            &lt; BACK
          </button>

          <div className="text-xs tracking-widest text-zinc-500">
            SYSTEM DOCUMENT
          </div>
        </div>

        <h1 className="text-3xl text-emerald-400 font-bold mb-8">
          PRIVACY POLICY
        </h1>

        <p className="mb-6 text-sm text-zinc-300">
          Break My Guard is a game. We collect the minimum data required to
          operate and improve the experience.
        </p>

        <ul className="space-y-4 text-sm">
          <li>
            <span className="text-emerald-300">• Gameplay Data:</span>{' '}
            Anonymous round results, difficulty signals, and feedback.
          </li>

          <li>
            <span className="text-emerald-300">• No Personal Identity:</span>{' '}
            We do not collect names, emails, or real-world identifiers.
          </li>

          <li>
            <span className="text-emerald-300">• Storage:</span>{' '}
            Data may be stored temporarily for balancing and analytics.
          </li>

          <li>
            <span className="text-emerald-300">• Third Parties:</span>{' '}
            External feedback links follow their own privacy policies.
          </li>
        </ul>

        <p className="mt-8 text-xs text-zinc-500">
          By using the game, you agree to this policy.
        </p>
      </div>
    </div>
  );
}
