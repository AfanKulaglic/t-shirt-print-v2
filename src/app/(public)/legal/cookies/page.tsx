import React from 'react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-900/50 via-fuchsia-900/30 to-[#0a0a0f] text-white py-16 md:py-24 mx-4 md:mx-8 rounded-3xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-transparent rounded-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-fuchsia-400 bg-clip-text text-transparent">
            Politika Kolačića
          </h1>
          <p className="text-lg md:text-xl text-gray-400">
            Kako koristimo kolačiće na Shirt Shop platformi
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
        {/* What are cookies */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            1. Šta su Kolačići?
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Kolačići su mali tekstualni fajlovi koji se pohranjuju na vašem uređaju (računar, tablet, mobilni telefon) kada posjetite web stranicu. Koriste se za pamćenje vaših postavki, analizu prometa i poboljšanje korisničkog iskustva.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Na <span className="font-semibold text-white">Shirt Shop</span> platformi koristimo kolačiće kako bismo vam pružili najbolje moguće iskustvo prilikom personalizacije i naručivanja majica.
          </p>
        </div>

        {/* What cookies we use */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            2. Koje Kolačiće Koristimo
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Neophodni Kolačići
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Ovi kolačići su neophodni za osnovnu funkcionalnost platforme. Omogućavaju navigaciju, pristup sigurnim područjima i rad košarice za kupovinu. Bez ovih kolačića, platforma ne može pravilno funkcionirati.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Kolačići Sesije
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Koristimo kolačiće sesije za pamćenje vaših aktivnosti tokom posjete, uključujući stavke u košarici i napredak u editoru za personalizaciju. Ovi kolačići se brišu kada zatvorite preglednik.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Funkcionalni Kolačići
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Ovi kolačići pamte vaše izbore i postavke (npr. sačuvani dizajni, preferencije prikaza) kako bismo vam pružili personalizirano iskustvo kada ponovo posjetite platformu.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Analitički Kolačići
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Koristimo analitičke kolačiće za razumijevanje kako posjetitelji koriste našu platformu. Ovi podaci nam pomažu da poboljšamo sadržaj i korisničko iskustvo. Prikupljene informacije su anonimne i agregirane.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Kolačići Trećih Strana
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Neki dijelovi naše platforme mogu koristiti kolačiće trećih strana (npr. za ugradnju sadržaja, funkcije društvenih mreža). Ovi kolačići su pod kontrolom trećih strana i podliježu njihovim politikama privatnosti.
              </p>
            </div>
          </div>
        </div>

        {/* How to manage cookies */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            3. Kako Upravljati Kolačićima
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Većina web preglednika automatski prihvata kolačiće, ali možete promijeniti postavke preglednika za kontrolu ili blokiranje kolačića. Evo kako to učiniti u popularnim preglednicima:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
            <li>
              <span className="font-semibold text-white">Chrome:</span> Postavke → Privatnost i sigurnost → Kolačići
            </li>
            <li>
              <span className="font-semibold text-white">Firefox:</span> Postavke → Privatnost i sigurnost → Kolačići
            </li>
            <li>
              <span className="font-semibold text-white">Safari:</span> Preferencije → Privatnost → Kolačići
            </li>
            <li>
              <span className="font-semibold text-white">Edge:</span> Postavke → Kolačići i dozvole za stranice
            </li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            Napomena: Blokiranje neophodnih kolačića može utjecati na funkcionalnost platforme, uključujući rad košarice i editora za personalizaciju.
          </p>
        </div>

        {/* Specific cookies */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            4. Kolačići Koje Koristimo
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orange-500/10">
                  <th className="text-left py-3 px-2 text-white font-semibold">Naziv Kolačića</th>
                  <th className="text-left py-3 px-2 text-white font-semibold">Svrha</th>
                  <th className="text-left py-3 px-2 text-white font-semibold">Trajanje</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-orange-500/5">
                  <td className="py-3 px-2">shirt_shop_cart</td>
                  <td className="py-3 px-2">Čuvanje stavki u košarici</td>
                  <td className="py-3 px-2">7 dana</td>
                </tr>
                <tr className="border-b border-orange-500/5">
                  <td className="py-3 px-2">shirt_shop_session</td>
                  <td className="py-3 px-2">Upravljanje sesijom</td>
                  <td className="py-3 px-2">Sesija</td>
                </tr>
                <tr className="border-b border-orange-500/5">
                  <td className="py-3 px-2">shirt_shop_designs</td>
                  <td className="py-3 px-2">Sačuvani dizajni u editoru</td>
                  <td className="py-3 px-2">30 dana</td>
                </tr>
                <tr className="border-b border-orange-500/5">
                  <td className="py-3 px-2">shirt_shop_order_tracking</td>
                  <td className="py-3 px-2">Praćenje narudžbi</td>
                  <td className="py-3 px-2">90 dana</td>
                </tr>
                <tr className="border-b border-orange-500/5">
                  <td className="py-3 px-2">shirt_shop_preferences</td>
                  <td className="py-3 px-2">Korisničke preferencije</td>
                  <td className="py-3 px-2">1 godina</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Changes */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            5. Izmjene Ove Politike
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Možemo povremeno ažurirati ovu Politiku kolačića kako bismo odrazili promjene u našoj praksi ili iz drugih operativnih, pravnih ili regulatornih razloga. Savjetujemo vam da povremeno pregledate ovu stranicu.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            6. Kontakt
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Za sva pitanja u vezi s ovom Politikom kolačića, kontaktirajte nas:
          </p>
          <ul className="list-none text-gray-400 space-y-2">
            <li>
              <span className="font-semibold text-white">Email:</span>{' '}
              <a href="mailto:bscsarajevo@gmail.com" className="text-orange-400 hover:underline">
                bscsarajevo@gmail.com
              </a>
            </li>
            <li>
              <span className="font-semibold text-white">Telefon:</span> 033 571 111
            </li>
            <li>
              <span className="font-semibold text-white">Adresa:</span> Vrbanja 1, Sarajevo, Bosna i Hercegovina
            </li>
          </ul>
        </div>

        {/* Last updated */}
        <div className="text-center text-gray-500 text-sm">
          <p>Posljednje ažuriranje: Januar 2026.</p>
        </div>
      </section>
    </div>
  );
}
