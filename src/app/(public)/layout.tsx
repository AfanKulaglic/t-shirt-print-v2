'use client';

import { usePathname } from 'next/navigation';
import { Header, Footer, SimpleNav } from '@/components/layout';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart';

// Pages that show SimpleNav instead of main Header (legal/info pages)
const legalRoutes = ['/legal/privacy', '/legal/terms', '/legal/cookies'];

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditor = pathname?.startsWith('/editor');
  const isLegalPage = legalRoutes.some(route => pathname?.startsWith(route));

  return (
    <CartProvider>
      {/* Show SimpleNav for legal pages, Header for everything else */}
      {isLegalPage ? (
        <SimpleNav />
      ) : (
        <div className={isEditor ? 'hidden md:block' : ''}>
          <Header />
        </div>
      )}
      <main className={`flex-1 ${isLegalPage ? 'pt-0' : isEditor ? 'pt-0 md:pt-20' : 'pt-20'}`}>
        {children}
      </main>
      {!isEditor && !isLegalPage && <Footer />}
      <CartDrawer />
    </CartProvider>
  );
}
