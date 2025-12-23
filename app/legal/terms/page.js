'use client';

import { useRouter } from 'next/navigation';

export default function TermsPage() {
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
          TERMS OF SERVICE
        </h1>

        <p className="mb-6 text-sm">
          Break My Guard is an experimental game provided for entertainment
          purposes only.
        </p>

        <ul className="space-y-4 text-sm">
          <li>• Do not misuse or attempt to disrupt the service.</li>
          <li>• AI responses are simulated within game rules.</li>
          <li>• Features, rules, or availability may change at any time.</li>
          <li>• No guarantees are provided regarding accuracy or uptime.</li>
        </ul>

        <p className="mt-8 text-xs text-zinc-500">
          Continued use constitutes acceptance of these terms.
        </p>
      </div>
    </div>
  );
}
