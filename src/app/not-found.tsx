import Link from 'next/link';
import { Button } from '@/components/ui';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Stranica nije pronađena
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Izgleda da stranica koju tražiš ne postoji ili je premještena na drugu lokaciju.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg">
              <Home className="w-5 h-5" />
              Nazad na početnu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
