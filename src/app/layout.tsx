import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import AppClientShell from '@/components/layout/AppClientShell';
import '@/styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: 'resizes-content',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: 'Shirt Shop - Personalizirane Majice',
    template: '%s | Shirt Shop',
  },
  description: 'Kreirajte jedinstvene personalizirane majice sa vašim dizajnom. 3D editor za savršen rezultat.',
  keywords: ['majice', 'personalizacija', 'print', 'dizajn', 'custom majice', 'shirt shop'],
  authors: [{ name: 'Shirt Shop' }],
  creator: 'Shirt Shop',
  openGraph: {
    type: 'website',
    locale: 'bs_BA',
    title: 'Shirt Shop - Personalizirane Majice',
    description: 'Kreirajte jedinstvene personalizirane majice sa vašim dizajnom.',
    siteName: 'Shirt Shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shirt Shop - Personalizirane Majice',
    description: 'Kreirajte jedinstvene personalizirane majice sa vašim dizajnom.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bs" className={`${inter.variable} overflow-x-hidden`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <AppClientShell>{children}</AppClientShell>
      </body>
    </html>
  );
}
