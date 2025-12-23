'use client';

import { useRouter } from 'next/navigation';

export default function DisclaimerPage() {
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
            SYSTEM NOTICE
          </div>
        </div>

        <h1 className="text-3xl text-emerald-400 font-bold mb-8">
          DISCLAIMER
        </h1>

        <p className="mb-6 text-sm">
          This game does not represent real security systems, real AI behavior,
          or real-world vulnerabilities.
        </p>

        <ul className="space-y-4 text-sm">
          <li>• All scenarios are fictional.</li>
          <li>• No real systems are accessed or affected.</li>
          <li>• Any resemblance to real systems is coincidental.</li>
        </ul>

        <p className="mt-8 text-xs text-zinc-500">
          Play responsibly.
        </p>
      </div>
    </div>
  );
}
