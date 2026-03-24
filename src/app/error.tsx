'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Nešto je pošlo po zlu
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Došlo je do greške prilikom učitavanja ove stranice. Molimo pokušajte ponovo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={reset}>
            <RefreshCw className="w-5 h-5" />
            Pokušaj ponovo
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              <Home className="w-5 h-5" />
              Nazad na početnu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
