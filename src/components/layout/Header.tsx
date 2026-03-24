'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Package, Palette, Shirt, Sparkles, Truck, BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationItems } from '@/data/navigation';
import { Button } from '@/components/ui';
import { useCart } from '@/context/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { totals, openCart } = useCart();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navIcons: Record<string, React.ReactNode> = {
    '/': <Sparkles className="w-3.5 h-3.5" />,
    '/editor': <Shirt className="w-3.5 h-3.5" />,
    '/how-it-works': <BookOpen className="w-3.5 h-3.5" />,
    '/shipping': <Truck className="w-3.5 h-3.5" />,
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-[#0a0a0f]/85 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/[0.06]'
            : 'bg-transparent'
        )}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow duration-300">
                <Shirt className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-orange-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                  Shirt Shop
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase leading-tight hidden sm:block">
                  Dizajniraj • Printaj • Nosi
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-full px-1.5 py-1.5 border border-white/[0.04]">
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2',
                      pathname === item.href
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    {pathname === item.href && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-fuchsia-500/15 rounded-full border border-orange-500/20"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {navIcons[item.href]}
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <Link href="/load-design" className="hidden lg:block">
                <span className={cn(
                  'inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-300',
                  pathname === '/load-design'
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                )}>
                  <Palette className="w-3.5 h-3.5" />
                  Učitaj dizajn
                </span>
              </Link>

              <Link href="/track-order" className="hidden lg:block">
                <span className={cn(
                  'inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-300',
                  pathname === '/track-order'
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                )}>
                  <Package className="w-3.5 h-3.5" />
                  Prati narudžbu
                </span>
              </Link>

              <div className="w-px h-6 bg-white/[0.06] mx-1 hidden lg:block" />

              <button
                className="relative p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
                onClick={openCart}
              >
                <ShoppingBag className="w-5 h-5" />
                {totals.itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30"
                  >
                    {totals.itemCount > 99 ? '99+' : totals.itemCount}
                  </motion.span>
                )}
              </button>

              <Link href="/editor" className="hidden md:block ml-1">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35">
                  Kreiraj
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <button
                className="lg:hidden p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-[#0c0c12] border-l border-white/[0.06] shadow-2xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-fuchsia-600 flex items-center justify-center">
                      <Shirt className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-bold text-white">Meni</span>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-1">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200',
                          pathname === item.href
                            ? 'bg-gradient-to-r from-orange-500/15 to-fuchsia-500/10 text-orange-400 border border-orange-500/15'
                            : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                        )}
                      >
                        <span className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center',
                          pathname === item.href
                            ? 'bg-orange-500/20'
                            : 'bg-white/[0.04]'
                        )}>
                          {navIcons[item.href]}
                        </span>
                        {item.title}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-1">
                    <Link
                      href="/load-design"
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200',
                        pathname === '/load-design'
                          ? 'bg-gradient-to-r from-orange-500/15 to-fuchsia-500/10 text-orange-400 border border-orange-500/15'
                          : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                      )}
                    >
                      <span className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        pathname === '/load-design' ? 'bg-orange-500/20' : 'bg-white/[0.04]'
                      )}>
                        <Palette className="w-3.5 h-3.5" />
                      </span>
                      Učitaj dizajn
                    </Link>
                    <Link
                      href="/track-order"
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200',
                        pathname === '/track-order'
                          ? 'bg-gradient-to-r from-orange-500/15 to-fuchsia-500/10 text-orange-400 border border-orange-500/15'
                          : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                      )}
                    >
                      <span className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        pathname === '/track-order' ? 'bg-orange-500/20' : 'bg-white/[0.04]'
                      )}>
                        <Package className="w-3.5 h-3.5" />
                      </span>
                      Prati narudžbu
                    </Link>
                  </div>
                </nav>

                <div className="p-4 border-t border-white/[0.06]">
                  <Link href="/editor" onClick={() => setIsMenuOpen(false)}>
                    <span className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20">
                      <Sparkles className="w-4 h-4" />
                      Započni dizajniranje
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
