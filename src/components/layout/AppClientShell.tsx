'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { AppToaster } from '@/components/ui/AppToaster';

const Preloader = dynamic(() => import('@/components/3d/Preloader'), {
  ssr: false,
});

interface AppClientShellProps {
  children: React.ReactNode;
}

function PreloaderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const storefrontHeavyAssets = !pathname?.startsWith('/admin');
  return <Preloader enabled={storefrontHeavyAssets}>{children}</Preloader>;
}

export default function AppClientShell({ children }: AppClientShellProps) {
  return (
    <>
      <Suspense fallback={null}>
        <PreloaderGate>{children}</PreloaderGate>
      </Suspense>
      <AppToaster position="bottom-right" />
    </>
  );
}
