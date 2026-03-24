'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  MousePointerClick,
  ImagePlus,
  ShoppingCart,
  Truck,
  Palette,
  Type,
  Move,
  ZoomIn,
  RotateCcw,
  Save,
  Upload,
  Layers,
  Shirt,
  PenTool,
  Grid3X3,
  Timer,
  CheckCircle2,
  Eye,
  Printer,
  PackageCheck,
  ArrowUpRight,
  ClipboardCopy,
  Ruler,
  Image as ImageIcon,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18]">

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="pt-16 pb-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Vodič kroz proces
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
              Kako{' '}
              <span className="bg-gradient-to-r from-orange-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                funkcionira
              </span>
              ?
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Od ideje do gotove majice — saznaj kako naša platforma radi i kako
              možeš kreirati jedinstvenu personaliziranu majicu u samo nekoliko koraka.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════ 4-STEP OVERVIEW ═══════════════════════════ */}
      <section className="pb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">Proces u 4 koraka</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Jednostavan i transparentan proces od dizajna do isporuke.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              {
                step: 1,
                icon: MousePointerClick,
                title: 'Otvori editor',
                description: 'Klikni na dugme i otvori naš interaktivni 3D editor za majice.',
              },
              {
                step: 2,
                icon: ImagePlus,
                title: 'Kreiraj dizajn',
                description: 'Dodaj slike i tekst, prilagodi poziciju, veličinu i boje u real-time editoru.',
              },
              {
                step: 3,
                icon: ShoppingCart,
                title: 'Dodaj u korpu',
                description: 'Pregledaj dizajn u 3D prikazu, sačuvaj kod dizajna i dodaj u korpu.',
              },
              {
                step: 4,
                icon: Truck,
                title: 'Primi narudžbu',
                description: 'Mi štampamo tvoj dizajn u vrhunskoj kvaliteti i dostavljamo na tvoju adresu.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-[#111118] border border-white/[0.06] p-6 md:p-7 h-full hover:border-orange-500/20 transition-all duration-500">
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-orange-600/[0.05] rounded-full blur-2xl group-hover:bg-orange-600/[0.1] transition-all duration-700" />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-fuchsia-500/20 border border-orange-500/20">
                        <span className="text-sm font-bold bg-gradient-to-r from-orange-400 to-fuchsia-400 bg-clip-text text-transparent">
                          {String(item.step).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-orange-400/80" />
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-white mb-2 group-hover:text-orange-50 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                  </div>

                  {item.step < 4 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-orange-500/30 to-transparent" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ 3D EDITOR DEEP-DIVE ═══════════════════════════ */}
      <section className="pb-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-sm font-medium mb-5">
              <Sparkles className="w-4 h-4" />
              3D Editor
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Interaktivni 3D editor za majice
            </h2>
            <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
              Naš 3D editor koristi real-time rendering za prikaz tvog dizajna direktno na majici.
              Rotiraj, zumiraj i prilagodi svaki detalj prije narudžbe.
            </p>
          </motion.div>

          {/* Supported Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-lg font-semibold text-white mb-5">Zone za print</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'Prednja strana', desc: 'Glavni dizajn' },
                { name: 'Zadnja strana', desc: 'Leđa majice' },
                { name: 'Lijevi rukav', desc: 'Mali detalj' },
                { name: 'Desni rukav', desc: 'Mali detalj' },
              ].map((p) => (
                <div key={p.name} className="bg-[#111118] border border-white/[0.06] rounded-xl p-4 hover:border-orange-500/20 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center">
                      <Shirt className="w-4 h-4 text-fuchsia-400" />
                    </div>
                    <span className="text-sm font-medium text-white">{p.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{p.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature Columns */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Image Customization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#111118] border border-white/[0.06] rounded-2xl p-7"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Prilagodba slike</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: Upload, text: 'Upload slike sa uređaja — podržani PNG, JPG i WebP formati' },
                  { icon: Move, text: 'Precizno pozicioniranje preko interaktivne mreže sa crosshair prikazom' },
                  { icon: ZoomIn, text: 'Prilagodba veličine klizačem od 0.2x do 7x sa fine-tuning tasterima' },
                  { icon: RotateCcw, text: 'Automatska rotacija i podrška za pejzažne slike' },
                  { icon: Grid3X3, text: 'Svaka zona printa ima zasebnu sliku — do 4 zone po majici' },
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <f.icon className="w-3.5 h-3.5 text-orange-400/80" />
                    </div>
                    <span className="text-sm text-gray-400 leading-relaxed">{f.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Text Customization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#111118] border border-white/[0.06] rounded-2xl p-7"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
                  <Type className="w-5 h-5 text-fuchsia-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Prilagodba teksta</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: Type, text: 'Tekst na prednjoj i zadnjoj strani majice — unikatne poruke' },
                  { icon: PenTool, text: '8 fontova: Arial, Times New Roman, Georgia, Verdana, Courier, Cursive, Brush Script, Comic Sans' },
                  { icon: Ruler, text: 'Veličina fonta od 8px do 72px za savršenu čitljivost' },
                  { icon: Palette, text: '8 boja teksta: crna, bijela, crvena, plava, zelena, žuta, ljubičasta, roza' },
                  { icon: CheckCircle2, text: 'Bold i italic stilovi, sa nezavisnim pozicioniranjem od slike' },
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <f.icon className="w-3.5 h-3.5 text-fuchsia-400/80" />
                    </div>
                    <span className="text-sm text-gray-400 leading-relaxed">{f.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Additional 3D features */}
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: Palette,
                title: 'Boja majice',
                desc: '6 boja dostupno: bijela, crna, crvena, plava, zelena i žuta. Promijeni boju jednim klikom.',
              },
              {
                icon: Eye,
                title: 'Live 3D pregled',
                desc: 'Tvoj dizajn se prikazuje u realnom vremenu na 3D modelu. Rotiraj model i vidi rezultat iz svakog ugla.',
              },
              {
                icon: Save,
                title: 'Sačuvaj dizajn',
                desc: 'Dobij jedinstveni 7-znakovni kod. Vrati se na dizajn bilo kada u narednih 30 dana.',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#111118] border border-white/[0.06] rounded-xl p-6 hover:border-fuchsia-500/20 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-fuchsia-500/10 flex items-center justify-center mb-4">
                  <f.icon className="w-4 h-4 text-fuchsia-400" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-2">{f.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-start"
          >
            <Link href="/editor">
              <span className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-orange-500 to-fuchsia-500 hover:from-orange-600 hover:to-fuchsia-600 rounded-xl text-sm font-semibold text-white transition-all duration-300 shadow-lg shadow-orange-500/20 group">
                Otvori 3D editor
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════ DESIGN CODES ═══════════════════════════ */}
      <section className="pb-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-[#111118] border border-white/[0.06] rounded-3xl p-8 md:p-12"
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-600/[0.06] rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-600/[0.04] rounded-full blur-3xl" />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/15 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-5">
                  <Save className="w-3.5 h-3.5" />
                  Kodovi dizajna
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Sačuvaj i nastavi bilo kada
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Svaki dizajn koji kreiraš dobija jedinstveni 7-znakovni kod (npr. &quot;D25LD5P&quot;). Ovaj kod
                  ti omogućava da se vratiš na svoj dizajn u narednih 30 dana — bez registracije ili
                  prijavljivanja.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: Save, text: 'Klikni ikonu diskete u editoru za čuvanje' },
                    { icon: ClipboardCopy, text: 'Kopiraj kod jednim klikom i sačuvaj ga' },
                    { icon: Timer, text: 'Kod vrijedi 30 dana od kreiranja' },
                    { icon: ArrowRight, text: 'Učitaj dizajn na stranici za učitavanje dizajna' },
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <f.icon className="w-3 h-3 text-orange-400" />
                      </div>
                      <span className="text-sm text-gray-400">{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-center">
                <div className="bg-[#0a0a0f] border border-white/[0.06] rounded-2xl p-8 w-full max-w-xs text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Tvoj kod dizajna</div>
                  <div className="text-3xl font-mono font-bold bg-gradient-to-r from-orange-400 to-fuchsia-400 bg-clip-text text-transparent mb-4 tracking-widest">
                    D25LD5P
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6">
                    <Timer className="w-3 h-3" />
                    Vrijedi još 30 dana
                  </div>
                  <Link href="/load-design">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-fuchsia-500 rounded-lg text-sm font-medium text-white hover:from-orange-600 hover:to-fuchsia-600 transition-all">
                      Učitaj dizajn
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════ ORDER TRACKING ═══════════════════════════ */}
      <section className="pb-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-5">
              <Truck className="w-4 h-4" />
              Nakon narudžbe
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Proizvodnja i dostava
            </h2>
            <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
              Od momenta kada pošalješ narudžbu, mi preuzimamo. Evo šta se dešava iza kulisa.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              {
                icon: CheckCircle2,
                title: 'Potvrda narudžbe',
                desc: 'Primamo tvoj upit i potvrđujemo detalje putem emaila.',
              },
              {
                icon: Eye,
                title: 'Kontrola kvalitete',
                desc: 'Provjeravamo rezoluciju, boje i pozicioniranje dizajna.',
              },
              {
                icon: Printer,
                title: 'Štampa i izrada',
                desc: 'DTG ili sublimacijski print u vrhunskoj kvaliteti.',
              },
              {
                icon: PackageCheck,
                title: 'Pakovanje i slanje',
                desc: 'Pažljivo pakujemo i šaljemo sa brojem za praćenje.',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative group"
              >
                <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-6 h-full hover:border-orange-500/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10">
                      <span className="text-xs font-bold text-orange-400">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <f.icon className="w-4 h-4 text-orange-400/80" />
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">{f.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-orange-500/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111118] border border-white/[0.06] rounded-2xl p-7"
          >
            <h3 className="text-lg font-semibold text-white mb-5">Prati svoju narudžbu</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xl">
              Svaka narudžba dobija jedinstveni broj (npr. &quot;SS250128-ABCD&quot;). Koristi ga na stranici
              za praćenje i vidi tačno u kojoj fazi se nalazi.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Na čekanju', 'Potvrđeno', 'U obradi', 'Štampa', 'Kontrola kvalitete', 'Poslano', 'Dostavljeno'].map((s, i) => (
                <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-gray-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${i <= 2 ? 'bg-orange-400' : 'bg-gray-600'}`} />
                  {s}
                </span>
              ))}
            </div>
            <Link href="/track-order">
              <span className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors group">
                Prati narudžbu
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════ TIPS & BEST PRACTICES ═══════════════════════════ */}
      <section className="pb-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Savjeti za najbolji rezultat</h2>
            <p className="text-gray-500 max-w-xl">Nekoliko preporuka za optimalan kvalitet printa na majici.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'Koristite visoku rezoluciju',
                desc: 'Slike od minimalno 300 DPI daju najoštriji print. Veće datoteke = bolji kvalitet.',
                icon: ImageIcon,
              },
              {
                title: 'PNG format sa transparencijom',
                desc: 'PNG format sa prozirnom pozadinom omogućava čist dizajn bez bijelih rubova.',
                icon: Layers,
              },
              {
                title: 'Kontrastirajte boje',
                desc: 'Koristite tamne boje teksta na svijetlim majicama i obratno za maksimalnu čitljivost.',
                icon: Palette,
              },
              {
                title: 'Pregledajte u 3D prije narudžbe',
                desc: 'Rotirajte model da vidite kako dizajn izgleda iz svakog ugla — posebno na rukavima.',
                icon: Eye,
              },
              {
                title: 'Odaberite pravu veličinu',
                desc: 'Provjerite tablicu veličina prije narudžbe. Personalizirane majice se ne mogu zamijeniti.',
                icon: Ruler,
              },
              {
                title: 'Sačuvajte kod dizajna',
                desc: 'Uvijek kopirajte i sačuvajte kod dizajna. Brisanje browser podataka uklanja korpu, ali kod ostaje.',
                icon: Save,
              },
            ].map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-[#111118] border border-white/[0.06] rounded-xl p-6 hover:border-orange-500/15 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                  <tip.icon className="w-4 h-4 text-orange-400/80" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-2">{tip.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CTA FOOTER ═══════════════════════════ */}
      <section className="pb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-br from-orange-900/30 to-fuchsia-900/20 rounded-3xl border border-orange-500/20 p-10 md:p-14 text-center"
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/[0.08] rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Spreman za kreiranje?
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Otvori editor i započni dizajniranje svoje majice. Imaš pitanja? Slobodno nas kontaktiraj — tu smo da pomognemo.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/editor">
                  <span className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-500 to-fuchsia-500 hover:from-orange-600 hover:to-fuchsia-600 rounded-xl text-sm font-semibold text-white transition-all duration-300 shadow-lg shadow-orange-500/20 group">
                    Započni dizajniranje
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                <Link href="/load-design">
                  <span className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#111118] border border-white/[0.08] hover:border-orange-500/30 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all duration-300">
                    <Save className="w-4 h-4 text-orange-400" />
                    Učitaj sačuvani dizajn
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
