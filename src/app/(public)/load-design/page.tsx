'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Palette, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

export default function LoadDesignPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      toast.error('Molimo unesite kod dizajna');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/designs?code=${trimmedCode}`);
      const data = await response.json();

      if (data.success && data.design) {
        toast.success('Dizajn pronađen!');
        router.push(`/editor?code=${trimmedCode}`);
      } else {
        toast.error('Dizajn nije pronađen. Provjerite kod.');
      }
    } catch (error) {
      toast.error('Greška pri pretrazi dizajna');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18] py-12">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="w-10 h-10 text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              Učitaj dizajn
            </h1>
            <p className="text-gray-400">
              Unesite kod koji ste dobili prilikom spremanja dizajna da nastavite uređivanje.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kod dizajna
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="npr. D25LD5P"
                className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder:text-gray-500 placeholder:text-lg placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                maxLength={10}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Tražim...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Nastavi uređivanje
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <h3 className="text-white font-medium mb-1">Nemate kod?</h3>
                <p className="text-gray-400 text-sm">
                  Kod dobijete kada sačuvate dizajn u editoru. Kodovi vrijede 30 dana.
                </p>
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm mt-2"
                >
                  Kreiraj novi dizajn
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
