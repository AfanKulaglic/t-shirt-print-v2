import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-900/50 via-fuchsia-900/30 to-[#0a0a0f] text-white py-16 md:py-24 mx-4 md:mx-8 rounded-3xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-transparent rounded-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-fuchsia-400 bg-clip-text text-transparent">
            Politika Privatnosti
          </h1>
          <p className="text-lg md:text-xl text-gray-400">
            Kako prikupljamo, koristimo i štitimo vaše informacije
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
        {/* Introduction */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            1. Uvod
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Ova Politika privatnosti objašnjava kako Shirt Shop prikuplja, koristi i štiti lične podatke korisnika naše platforme za personalizaciju majica (web stranica i povezane usluge). Korištenjem naše platforme, prihvatate uslove opisane u ovoj Politici.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Shirt Shop je razvijen i održavan od strane <span className="font-semibold text-white">Shirt Shop</span> iz Sarajeva (u daljem tekstu: &quot;mi&quot;, &quot;nas&quot;, &quot;naša platforma&quot;). Posvećeni smo transparentnoj i sigurnoj obradi vaših podataka, samo u svrhe koje su vam jasno objašnjene.
          </p>
        </div>

        {/* What data we collect */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            2. Koje Podatke Prikupljamo
          </h2>

          <h3 className="text-lg font-semibold text-white mb-2">
            2.1. Podaci koje vi pružate
          </h3>
          <p className="text-gray-400 leading-relaxed mb-3">
            Kada kreirate narudžbu ili nas kontaktirate, možemo prikupiti:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Ime, prezime i email adresu</li>
            <li>Adresu za dostavu</li>
            <li>Broj telefona</li>
            <li>Uploadovane slike i dizajne za personalizaciju</li>
            <li>Poruke i zahtjeve za podršku</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mb-2">
            2.2. Podaci o aktivnosti
          </h3>
          <p className="text-gray-400 leading-relaxed mb-3">
            Kada koristite Shirt Shop, automatski prikupljamo:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Historija narudžbi i transakcija</li>
            <li>Sačuvani dizajni u editoru</li>
            <li>Stavke u košarici</li>
            <li>Informacije o uređaju i IP adresa</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            Ovi podaci se koriste za funkcionalnost platforme, sigurnost i poboljšanje korisničkog iskustva.
          </p>
        </div>

        {/* How we use your data */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            3. Kako Koristimo Vaše Podatke
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Vaše podatke koristimo isključivo u svrhe povezane s radom Shirt Shop platforme, uključujući:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Obradu i isporuku vaših narudžbi</li>
            <li>Personalizaciju majica prema vašim dizajnima</li>
            <li>Slanje obavještenja o statusu narudžbe</li>
            <li>Pružanje korisničke podrške</li>
            <li>Poboljšanje funkcionalnosti platforme i sigurnosti</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            Ne prodajemo vaše lične podatke trećim stranama. Podatke možemo dijeliti samo s pouzdanim partnerima koji nam pomažu u radu platforme (hosting, dostava), uz odgovarajuće ugovore o obradi podataka.
          </p>
        </div>

        {/* Uploaded content */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            4. Uploadovani Sadržaj
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Kada uploadujete slike ili dizajne za personalizaciju majica:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Vaše slike se koriste isključivo za kreiranje naručene majice</li>
            <li>Ne koristimo vaše dizajne u marketinške svrhe bez vašeg pristanka</li>
            <li>Slike se čuvaju sigurno i brišu se nakon određenog perioda po završetku narudžbe</li>
            <li>Vi ste odgovorni za to da imate prava na uploadovani sadržaj</li>
          </ul>
        </div>

        {/* Your rights */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            5. Vaša Prava
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Imate pravo zatražiti:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Pristup vašim ličnim podacima</li>
            <li>Ispravku netačnih podataka</li>
            <li>Brisanje vaših podataka</li>
            <li>Ograničenje obrade</li>
            <li>Prenosivost podataka</li>
            <li>Prigovor na obradu</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            Za ostvarivanje ovih prava, kontaktirajte nas na:{' '}
            <a href="mailto:bscsarajevo@gmail.com" className="text-orange-400 hover:underline">
              bscsarajevo@gmail.com
            </a>
          </p>
        </div>

        {/* Data security */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            6. Sigurnost Podataka
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Primjenjujemo odgovarajuće tehničke i organizacione mjere za zaštitu vaših podataka, uključujući:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Šifrirani prijenos podataka (HTTPS)</li>
            <li>Sigurno čuvanje uploadovanih datoteka</li>
            <li>Ograničen pristup ličnim podacima</li>
            <li>Redovno sigurnosno ažuriranje sistema</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            7. Kontakt
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Za sva pitanja u vezi s ovom Politikom privatnosti ili obradom vaših podataka, kontaktirajte nas:
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
