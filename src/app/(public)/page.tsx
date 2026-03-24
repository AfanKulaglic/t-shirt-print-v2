'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Shirt,
  Zap,
  Star,
  HeartHandshake,
  Shield,
  Save,
  ArrowUpRight,
  Rotate3d,
  Palette,
  Type,
  Layers,
  ImagePlus,
  Move,
  Quote,
  ChevronDown,
  Gift,
  Truck,
  Clock,
  CheckCircle2,
  Users,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { fetchHeaderProducts } from '@/lib/data-fetching';
import type { HeaderProduct } from '@/lib/data-fetching';

const ModelViewer = dynamic(() => import('@/components/3d/ModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
    </div>
  ),
});

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function HomePage() {
  const [headerProduct, setHeaderProduct] = useState<HeaderProduct | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const products = await fetchHeaderProducts();
        if (products.length > 0) {
          setHeaderProduct(products[0]);
        }
      } catch (e) {
        // Fallback — no product loaded
      }
    }
    loadProduct();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#0f0a18] to-[#0a0a0f]">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[15%] w-[500px] h-[500px] bg-orange-600/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-fuchsia-600/6 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] left-[40%] w-[300px] h-[300px] bg-orange-500/6 rounded-full blur-[100px]" />
        </div>

        {/* Top part — text + 3D model side by side */}
        <div className="container-custom relative z-10 grid lg:grid-cols-[1fr,auto] gap-8 items-center pt-6 pb-4 lg:pt-4 lg:pb-2">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-xl py-4"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Dobrodošli u Shirt Shop
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4"
            >
              Dizajniraj &amp;{' '}
              <span className="bg-gradient-to-r from-orange-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                Printaj
              </span>{' '}
              svoju majicu
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-gray-400 text-base md:text-lg max-w-md mb-6 leading-relaxed"
            >
              Postavi svoj dizajn na majicu u realnom vremenu koristeći naš
              interaktivni 3D editor. Rotiraj, zumiraj i prilagodi svaki detalj.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              <Link href="/editor">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-600/25 hover:shadow-orange-500/40 text-sm">
                  Započni dizajniranje
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/how-it-works">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#111118] border border-white/[0.08] hover:border-orange-500/30 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300 text-sm">
                  Saznaj više
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — Pulsating 3D T-Shirt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] mx-auto"
          >
            {/* Pulsating glow */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.3, 0.55, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-fuchsia-500/30 to-purple-600/30 rounded-full blur-3xl"
            />

            <Link href="/editor" className="relative w-full h-full block">
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <ModelViewer
                  modelPath="/shirt/scene.gltf"
                  color={headerProduct?.modelColor}
                  zoom={headerProduct?.zoomHeader ?? 5.5}
                  autoRotate={true}
                  interactive={false}
                  className="w-full h-full"
                  showShadow={true}
                  variant="card"
                />
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Bottom part — Process steps inline */}
        <div className="container-custom relative z-10 pb-6 lg:pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              Proces
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { step: '01', icon: Shirt, title: 'Otvori editor', description: 'Klikni i otvori naš 3D editor za majice.' },
              { step: '02', icon: Sparkles, title: 'Kreiraj dizajn', description: 'Dodaj slike, tekst i prilagodi u realnom vremenu.' },
              { step: '03', icon: Save, title: 'Sačuvaj i naruči', description: 'Pregledaj dizajn, sačuvaj kod i dodaj u korpu.' },
              { step: '04', icon: ArrowRight, title: 'Primi narudžbu', description: 'Štampamo i dostavljamo na tvoju adresu.' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-[#111118] border border-white/[0.06] p-4 h-full hover:border-orange-500/20 transition-all duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500/20 to-fuchsia-500/20 border border-orange-500/20">
                      <span className="text-[10px] font-bold bg-gradient-to-r from-orange-400 to-fuchsia-400 bg-clip-text text-transparent">
                        {item.step}
                      </span>
                    </div>
                    <item.icon className="w-3.5 h-3.5 text-orange-400/70" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ WHY US + STATS ═══════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/4 rounded-full blur-[130px]" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Zašto mi
            </span>
            <h2 className="text-2xl md:text-5xl font-bold text-white mb-4">
              Sve što trebaš,{' '}
              <span className="bg-gradient-to-r from-orange-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                na jednom mjestu
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Od kreiranja dizajna do isporuke na vrata — brinemo se za svaki korak.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr,1fr] gap-4 md:gap-5">
            {/* Left — Big featured card with embedded stats */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:row-span-2"
            >
              <div className="relative h-full overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#15121f] via-[#111118] to-[#0e0e16] border border-white/[0.06] p-6 md:p-10">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px]" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-fuchsia-500/8 rounded-full blur-[80px]" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-fuchsia-500/20 border border-orange-500/15 flex items-center justify-center mb-6">
                    <Zap className="w-7 h-7 text-orange-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Vrhunska tehnologija,{' '}
                    <span className="bg-gradient-to-r from-orange-400 to-fuchsia-400 bg-clip-text text-transparent">
                      ljudski pristup
                    </span>
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                    Koristimo najmoderniju DTG tehnologiju štampe i premium materijale, 
                    ali svaka narudžba prolazi kroz ručnu kontrolu kvalitete jer vjerujemo 
                    da tvoj dizajn zaslužuje savršenost.
                  </p>

                  {/* Inline stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: '10K+', label: 'Dizajniranih majica', color: 'from-orange-400 to-red-400' },
                      { value: '5K+', label: 'Zadovoljnih kupaca', color: 'from-fuchsia-400 to-pink-400' },
                      { value: '24h', label: 'Prosječna izrada', color: 'from-orange-400 to-fuchsia-400' },
                      { value: '99%', label: 'Pozitivnih recenzija', color: 'from-cyan-400 to-blue-400' },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-4">
                        <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right top — two benefit cards side by side */}
            <div className="grid grid-cols-2 gap-3 md:gap-5">
              {[
                {
                  icon: Star,
                  title: 'Vrhunski kvalitet',
                  description: 'Profesionalna oprema, premium pamuk i DTG print koji ne blijedi.',
                  gradient: 'from-orange-500 to-red-500',
                  iconBg: 'from-orange-500/20 to-red-500/20',
                },
                {
                  icon: Shield,
                  title: 'Sigurna narudžba',
                  description: 'Zaštićeni podaci, jednostavno plaćanje i garancija zadovoljstva.',
                  gradient: 'from-fuchsia-500 to-pink-500',
                  iconBg: 'from-fuchsia-500/20 to-pink-500/20',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative h-full overflow-hidden rounded-2xl bg-[#111118] border border-white/[0.06] p-5 hover:border-orange-500/20 transition-all duration-500">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.iconBg} border border-white/[0.06] flex items-center justify-center mb-4`}>
                      <item.icon className="w-5 h-5 text-white/80" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1.5">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right bottom — wide benefit card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] transition-all duration-500 hover:border-orange-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.06] via-fuchsia-500/[0.04] to-purple-500/[0.06]" />
                <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-fuchsia-500/20 border border-orange-500/15 flex items-center justify-center flex-shrink-0">
                      <HeartHandshake className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white mb-1">Podrška od A do Z</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Od prvog klika u editoru do majice u tvojim rukama — naš tim je tu za svako pitanje, savjet ili poseban zahtjev. Javi nam se bilo kada!
                      </p>
                    </div>
                  </div>
                  <Link href="/how-it-works">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap">
                      Saznaj više
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ 3D EDITOR FEATURES ═══════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px]" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-5">
              <Rotate3d className="w-3.5 h-3.5" />
              3D Editor
            </span>
            <h2 className="text-2xl md:text-5xl font-bold text-white mb-4">
              Moćan editor,{' '}
              <span className="bg-gradient-to-r from-orange-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                jednostavno korištenje
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Naš 3D editor pruža sve alate koji su ti potrebni da kreiraš savršen dizajn — bez ikakve složenosti.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                icon: Rotate3d,
                title: '360° 3D pregled',
                description: 'Rotiraj majicu u svim smjerovima i vidi kako tvoj dizajn izgleda iz svakog ugla u realnom vremenu.',
                accent: 'from-orange-500/20 to-red-500/20',
                iconColor: 'text-orange-400',
              },
              {
                icon: ImagePlus,
                title: 'Upload slika',
                description: 'Postavi vlastite slike, logoe ili ilustracije direktno na majicu. Podržani PNG, JPG i SVG formati.',
                accent: 'from-fuchsia-500/20 to-pink-500/20',
                iconColor: 'text-fuchsia-400',
              },
              {
                icon: Type,
                title: 'Dodaj tekst',
                description: 'Upiši tekst, odaberi font, veličinu i boju. Savršeno za personalizirane poruke i natpise.',
                accent: 'from-orange-500/20 to-fuchsia-500/20',
                iconColor: 'text-orange-400',
              },
              {
                icon: Palette,
                title: 'Boje majice',
                description: 'Biraj između različitih boja majice i pronađi savršenu kombinaciju sa tvojim dizajnom.',
                accent: 'from-cyan-500/20 to-blue-500/20',
                iconColor: 'text-cyan-400',
              },
              {
                icon: Move,
                title: 'Pozicioniraj slobodno',
                description: 'Pomjeraj, rotiraj i skaliraj elemente dizajna na majici sa potpunom slobodom.',
                accent: 'from-amber-500/20 to-orange-500/20',
                iconColor: 'text-amber-400',
              },
              {
                icon: Layers,
                title: 'Višestruki slojevi',
                description: 'Kombinuj više slika i teksta u slojevima. Upravljaj redoslijedom za savršen rezultat.',
                accent: 'from-orange-500/20 to-fuchsia-500/20',
                iconColor: 'text-orange-400',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-[#111118] border border-white/[0.06] p-6 h-full hover:border-orange-500/20 transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full blur-3xl" style={{}} />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} border border-white/[0.06] flex items-center justify-center mb-5`}>
                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-50 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/editor">
              <span className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-600/25 hover:shadow-orange-500/40">
                Isprobaj editor besplatno
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════ QUALITY PROMISE ═══════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[600px] h-[400px] bg-orange-600/4 rounded-full blur-[140px] -translate-x-1/2" />
        </div>
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left — Visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-gradient-to-br from-[#111118] to-[#0e0e16] border border-white/[0.06] p-6 hover:border-orange-500/20 transition-all duration-500">
                    <Shirt className="w-8 h-8 text-orange-400 mb-3" />
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-xs text-gray-500 mt-1">Pamuk premium kvalitete</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-[#111118] to-[#0e0e16] border border-white/[0.06] p-6 hover:border-fuchsia-500/20 transition-all duration-500">
                    <Palette className="w-8 h-8 text-fuchsia-400 mb-3" />
                    <div className="text-2xl font-bold text-white">DTG</div>
                    <div className="text-xs text-gray-500 mt-1">Direct-to-garment print tehnologija</div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl bg-gradient-to-br from-[#111118] to-[#0e0e16] border border-white/[0.06] p-6 hover:border-orange-500/20 transition-all duration-500">
                    <CheckCircle2 className="w-8 h-8 text-orange-400 mb-3" />
                    <div className="text-2xl font-bold text-white">60°C</div>
                    <div className="text-xs text-gray-500 mt-1">Pranje bez gubitka kvalitete</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-[#111118] to-[#0e0e16] border border-white/[0.06] p-6 hover:border-cyan-500/20 transition-all duration-500">
                    <Star className="w-8 h-8 text-cyan-400 mb-3" />
                    <div className="text-2xl font-bold text-white">5/5</div>
                    <div className="text-xs text-gray-500 mt-1">Ocjena kvalitete printa</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right — Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-5">
                <Shield className="w-3.5 h-3.5" />
                Garancija kvalitete
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
                Premium materijali,{' '}
                <span className="bg-gradient-to-r from-orange-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                  profesionalni print
                </span>
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-6">
                Svaka majica koju izrađujemo prolazi kroz rigoriznu kontrolu kvalitete. 
                Koristimo premium 100% pamučne majice i najnoviju DTG (Direct-to-Garment) 
                tehnologiju štampe koja garantuje živopisne boje i trajnost printa.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Premium pamučna majica — mekana i udobna za svakodnevno nošenje',
                  'Živopisne boje koje ne blijede ni nakon višestrukog pranja',
                  'Ekološki prihvatljive tinte sigurne za kožu',
                  'Ručna kontrola kvalitete svake narudžbe prije slanja',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-orange-400" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
              <Link href="/editor">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-600/25 hover:shadow-orange-500/40">
                  Kreiraj svoju majicu
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ SHIPPING INFO ═══════════════════════════ */}
      <section className="py-12 md:py-16 bg-[#0a0a0f] relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111118] via-[#13111f] to-[#111118] border border-white/[0.06]">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 left-1/4 w-40 h-40 bg-orange-500/10 rounded-full blur-[80px]" />
              <div className="absolute -bottom-20 right-1/4 w-40 h-40 bg-fuchsia-500/8 rounded-full blur-[80px]" />
            </div>
            <div className="relative grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
              {[
                {
                  icon: Truck,
                  title: 'Besplatna dostava',
                  description: 'Za sve narudžbe iznad 50 KM na području cijele BiH.',
                },
                {
                  icon: Gift,
                  title: 'Poklon pakovanje',
                  description: 'Svaka narudžba dolazi u premium pakovanju — spremna za poklon.',
                },
                {
                  icon: Package,
                  title: 'Brza isporuka',
                  description: 'Izrada i slanje u roku od 1-3 radna dana od potvrde narudžbe.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 md:p-10 text-center group"
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-fuchsia-500/10 border border-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ DESIGN CODES / LOAD DESIGN ═══════════════════════════ */}
      <section className="py-14 md:py-20 bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-[#111118] border border-white/[0.06]">
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-600/[0.08] rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-fuchsia-600/[0.06] rounded-full blur-3xl" />

              <div className="relative grid md:grid-cols-2 gap-0 items-center">
                {/* Content */}
                <div className="p-8 md:p-12 lg:p-16">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/15 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-5">
                    <Save className="w-3.5 h-3.5" />
                    Dizajn kodovi
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Sačuvaj i nastavi{' '}
                    <span className="bg-gradient-to-r from-orange-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                      bilo kada
                    </span>
                  </h3>

                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                    Svaki dizajn koji kreiraš dobiva jedinstveni kod. Sačuvaj ga
                    i vrati se bilo kada da nastaviš gdje si stao — bez gubljenja posla.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {[
                      'Jedinstveni kod za svaki dizajn',
                      'Nastavi uređivanje u bilo koje vrijeme',
                      'Dijeli dizajn sa prijateljima',
                    ].map((text) => (
                      <li key={text} className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-3 h-3 text-orange-400" />
                        </div>
                        {text}
                      </li>
                    ))}
                  </ul>

                  <Link href="/load-design">
                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/25">
                      Učitaj dizajn
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>

                {/* Visual Side */}
                <div className="hidden md:flex items-center justify-center p-8 md:p-12">
                  <div className="relative w-full max-w-xs">
                    {/* Decorative code card */}
                    <div className="relative bg-[#0a0a0f] border border-white/[0.08] rounded-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      </div>
                      <div className="space-y-3">
                        <div className="text-xs text-gray-600 font-mono">// Tvoj dizajn kod</div>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-3">
                          <span className="text-orange-400 font-mono text-lg font-bold tracking-widest">SS-X7K9M</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-2 bg-white/[0.06] rounded-full w-16" />
                          <div className="h-2 bg-white/[0.04] rounded-full w-24" />
                        </div>
                        <div className="flex gap-2">
                          <div className="h-2 bg-white/[0.05] rounded-full w-20" />
                          <div className="h-2 bg-white/[0.03] rounded-full w-12" />
                        </div>
                      </div>
                    </div>
                    {/* Shadow card behind */}
                    <div className="absolute inset-0 bg-[#0a0a0f] border border-white/[0.04] rounded-2xl -rotate-3 -z-10" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════ TESTIMONIALS ═══════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-[600px] h-[300px] bg-fuchsia-600/4 rounded-full blur-[140px] -translate-x-1/2" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-5">
              <Star className="w-3.5 h-3.5" />
              Recenzije
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Šta kažu naši{' '}
              <span className="bg-gradient-to-r from-orange-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                kupci
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Hiljade zadovoljnih kupaca već nosi svoje personalizirane majice.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                name: 'Amina H.',
                location: 'Sarajevo',
                text: 'Naručila sam majice za cijeli tim na poslu. Editor je nevjerovatno jednostavan, a kvaliteta printa je fantastična! Boje su žive i nakon 10+ pranja.',
                rating: 5,
              },
              {
                name: 'Damir K.',
                location: 'Mostar',
                text: 'Iznenađenje za rođendan mojoj djevojci — stavili smo našu zajedničku sliku na majicu. Isporuka stigla za 2 dana, pakovanje savršeno. Preporučujem svima!',
                rating: 5,
              },
              {
                name: 'Lejla M.',
                location: 'Tuzla',
                text: '3D pregled je genijalan — mogla sam vidjeti tačno kako će izgledati prije narudžbe. Dizajn kod je super fora, sačuvala sam ga i naručila ponovo mjesec później.',
                rating: 5,
              },
            ].map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-full rounded-2xl bg-[#111118] border border-white/[0.06] p-6 hover:border-orange-500/15 transition-all duration-500">
                  <Quote className="w-8 h-8 text-orange-500/20 mb-4" />
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/30 to-fuchsia-500/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{review.name[0]}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{review.name}</div>
                      <div className="text-xs text-gray-500">{review.location}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FAQ ═══════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#0a0a0f] relative overflow-hidden">
        <div className="container-custom relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-5">
              <ChevronDown className="w-3.5 h-3.5" />
              FAQ
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Česta{' '}
              <span className="bg-gradient-to-r from-orange-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                pitanja
              </span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {[
              {
                q: 'Koliko traje izrada i isporuka?',
                a: 'Izrada majice traje 1-2 radna dana od potvrde narudžbe. Dostava na području BiH traje dodatnih 1-2 radna dana. Ukupno možeš očekivati svoju majicu za 2-4 radna dana.',
              },
              {
                q: 'Koji formati slika su podržani?',
                a: 'Naš editor podržava PNG, JPG i SVG formate. Za najbolji kvalitet printa, preporučujemo slike rezolucije od najmanje 300 DPI. Transparentne PNG slike izgledaju posebno sjajno!',
              },
              {
                q: 'Mogu li vratiti ili zamijeniti majicu?',
                a: 'Svakako! Ako nisi zadovoljan kvalitetom printa ili veličinom, kontaktiraj nas u roku od 14 dana od prijema. Zamjena ili povrat novca — bez komplikacija.',
              },
              {
                q: 'Šta je dizajn kod i kako ga koristim?',
                a: 'Kada kreiraš dizajn u editoru, automatski se generira jedinstveni kod (npr. SS-X7K9M). Sačuvaj ga i koristi na stranici "Učitaj dizajn" da ponovo otvoriš svoj rad — savršeno za nastavak uređivanja ili ponovnu narudžbu.',
              },
              {
                q: 'Koliko košta personalizirana majica?',
                a: 'Cijene se kreću od 25 KM za jednu majicu. Dostava je besplatna za narudžbe iznad 50 KM. Grupni popusti su dostupni za narudžbe od 10+ majica — kontaktiraj nas za posebnu ponudu.',
              },
              {
                q: 'Da li je editor besplatan za korištenje?',
                a: 'Da! 3D editor je potpuno besplatan. Možeš kreirati i pregledati neograničen broj dizajna. Plaćaš samo kada odlučiš naručiti — bez skrivenih troškova.',
              },
            ].map((item, index) => (
              <motion.details
                key={item.q}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-2xl bg-[#111118] border border-white/[0.06] hover:border-orange-500/15 transition-all duration-300 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 md:p-6 list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-sm md:text-base font-medium text-white pr-4">{item.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-300 flex-shrink-0" />
                </summary>
                <div className="px-5 md:px-6 pb-5 md:pb-6 -mt-1">
                  <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
