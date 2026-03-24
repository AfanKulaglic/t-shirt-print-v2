import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Shirt, ArrowRight, ArrowUpRight, Sparkles, Package, Truck, Palette, FileText, Shield, Cookie } from 'lucide-react';
import { footerLinks } from '@/data/navigation';

const supportIcons: Record<string, React.ReactNode> = {
  '/track-order': <Package className="w-3.5 h-3.5" />,
  '/shipping': <Truck className="w-3.5 h-3.5" />,
  '/load-design': <Palette className="w-3.5 h-3.5" />,
};

const legalIcons: Record<string, React.ReactNode> = {
  '/legal/terms': <FileText className="w-3.5 h-3.5" />,
  '/legal/privacy': <Shield className="w-3.5 h-3.5" />,
  '/legal/cookies': <Cookie className="w-3.5 h-3.5" />,
};

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#08080c] overflow-hidden">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-600/[0.04] rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-fuchsia-600/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Newsletter / CTA strip */}
      <div className="relative container-custom py-10 md:py-14">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111118] via-[#13111f] to-[#111118] border border-white/[0.06]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 left-1/4 w-40 h-40 bg-orange-500/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 right-1/4 w-40 h-40 bg-fuchsia-500/8 rounded-full blur-[80px]" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-5 p-6 md:p-8 lg:p-10">
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1.5">
                Spreman za svoju jedinstvenu majicu?
              </h3>
              <p className="text-sm text-gray-400">
                Pokreni 3D editor i dizajniraj nešto posebno — besplatno.
              </p>
            </div>
            <Link href="/editor" className="flex-shrink-0">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35">
                <Sparkles className="w-4 h-4" />
                Otvori editor
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="relative container-custom pb-10 md:pb-14">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow duration-300">
                <Shirt className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-orange-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                  Shirt Shop
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase leading-tight">
                  Dizajniraj • Printaj • Nosi
                </span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Vaš pouzdani partner za personalizirane majice. Kreirajte jedinstvene
              dizajne sa našim 3D editorom.
            </p>

            {/* Contact cards */}
            <div className="flex flex-col gap-2">
              <a
                href="tel:+38733571111"
                className="group inline-flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-orange-500/20 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">033 571 111</span>
              </a>
              <a
                href="mailto:info@shirtshop.ba"
                className="group inline-flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-orange-500/20 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-fuchsia-400" />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">info@shirtshop.ba</span>
              </a>
              <div className="inline-flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="text-sm text-gray-500">Sarajevo, BiH</span>
              </div>
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">Podrška</h4>
            <ul className="space-y-1.5">
              {footerLinks.support.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-all duration-200"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-orange-500/10 flex items-center justify-center transition-colors duration-200">
                      <span className="text-gray-500 group-hover:text-orange-400 transition-colors">
                        {supportIcons[link.href]}
                      </span>
                    </span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      {link.title}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-orange-400 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">Pravne informacije</h4>
            <ul className="space-y-1.5">
              {footerLinks.legal.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-all duration-200"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-orange-500/10 flex items-center justify-center transition-colors duration-200">
                      <span className="text-gray-500 group-hover:text-orange-400 transition-colors">
                        {legalIcons[link.href]}
                      </span>
                    </span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      {link.title}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-orange-400 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links / Pages */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">Stranice</h4>
            <ul className="space-y-1.5">
              {[
                { title: 'Početna', href: '/' },
                { title: '3D Editor', href: '/editor' },
                { title: 'Kako funkcionira', href: '/how-it-works' },
                { title: 'Korpa', href: '/cart' },
              ].map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-all duration-200"
                  >
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      {link.title}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-orange-400 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="container-custom py-5 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} Shirt Shop. Sva prava zadržana.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">Made with</span>
              <span className="text-orange-500 text-xs">♥</span>
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">in Sarajevo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
