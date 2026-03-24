'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const navLinks = [
  { href: '/legal/privacy', label: 'Privatnost' },
  { href: '/legal/terms', label: 'Uslovi' },
  { href: '/legal/cookies', label: 'Kolačići' },
];

export function SimpleNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#0a0a0f]/90 backdrop-blur-lg border-b border-orange-500/10 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium bg-gradient-to-r from-orange-400 to-fuchsia-400 bg-clip-text text-transparent">
              Shirt Shop
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SimpleNav;
