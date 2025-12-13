'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResultCard from '@/components/ResultCard';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastResult');
    if (!stored) {
      router.replace('/');
      return;
    }

    setResult(JSON.parse(stored));
  }, [router]);

  if (!result) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <ResultCard
        userWon={result.userWon}
        category={result.category}
        timeTaken={result.timeTaken}
        onNext={() => router.push('/round/match')}
        onExit={() => router.push('/')}
      />
    </div>
  );
}
