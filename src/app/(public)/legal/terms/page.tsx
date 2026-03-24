import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-900/50 via-fuchsia-900/30 to-[#0a0a0f] text-white py-16 md:py-24 mx-4 md:mx-8 rounded-3xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-transparent rounded-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-fuchsia-400 bg-clip-text text-transparent">
            Uslovi Korištenja
          </h1>
          <p className="text-lg md:text-xl text-gray-400">
            Pravila i smjernice za korištenje Shirt Shop platforme
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
        {/* Acceptance */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            1. Prihvatanje Uslova
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Dobrodošli na <span className="font-semibold text-white">Shirt Shop</span>. Korištenjem naše web stranice i povezanih usluga (platforma), prihvatate ove Uslove korištenja. Ako se ne slažete s ovim uslovima, molimo vas da ne koristite platformu.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Shirt Shop je razvijen i održavan od strane <span className="font-semibold text-white">Shirt Shop</span> iz Sarajeva. Ovi uslovi se primjenjuju na sve korisnike platforme.
          </p>
        </div>

        {/* What is Shirt Shop */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            2. Šta je Shirt Shop
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Shirt Shop je platforma za personalizaciju majica koja korisnicima omogućava:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>
              <span className="font-semibold text-white">Personalizaciju</span> — kreiranje jedinstvenih dizajna na majicama
            </li>
            <li>
              <span className="font-semibold text-white">3D Pregled</span> — vizualizaciju majice u realnom vremenu
            </li>
            <li>
              <span className="font-semibold text-white">Naručivanje</span> — kupovinu personaliziranih majica s dostavom
            </li>
            <li>
              <span className="font-semibold text-white">Praćenje</span> — praćenje statusa narudžbe
            </li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            Platforma je specijalizirana za personalizirane majice sa 3D editorom koji omogućava dizajniranje na 4 zone printa.
          </p>
        </div>

        {/* Orders */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            3. Narudžbe i Plaćanje
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Prilikom naručivanja, slažete se sa sljedećim:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Pružiti tačne i potpune informacije za dostavu</li>
            <li>Platiti navedenu cijenu uključujući troškove dostave</li>
            <li>Pregledati dizajn prije potvrde narudžbe</li>
            <li>Prihvatiti da je svaki proizvod izrađen po narudžbi</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            Cijene su izražene u konvertibilnim markama (BAM) i uključuju PDV gdje je primjenjivo.
          </p>
        </div>

        {/* Personalization */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            4. Personalizacija i Sadržaj
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Korištenjem našeg editora za personalizaciju, prihvatate:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Da imate prava na sve uploadovane slike i dizajne</li>
            <li>Da sadržaj ne krši autorska prava trećih strana</li>
            <li>Da sadržaj nije uvredljiv, ilegalan ili neprikladan</li>
            <li>Odgovornost za kvalitet uploadovanih slika</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            Zadržavamo pravo da odbijemo izradu proizvoda sa sadržajem koji smatramo neprikladnim.
          </p>
        </div>

        {/* Acceptable Use */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            5. Prihvatljivo Korištenje
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Kao korisnik, slažete se da platformu koristite u skladu sa zakonom i ovim Uslovima. Nećete:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Koristiti tuđi intelektualni vlasništvo bez dozvole</li>
            <li>Uploadovati sadržaj koji je uvredljiv, mrziteljski ili ilegalan</li>
            <li>Pokušavati hakirati ili kompromitirati sigurnost platforme</li>
            <li>Koristiti platformu za lažne ili prijevarne narudžbe</li>
            <li>Zloupotrebljavati sistem za praćenje narudžbi</li>
          </ul>
        </div>

        {/* Returns and Refunds */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            6. Povrati i Reklamacije
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            S obzirom na personaliziranu prirodu proizvoda:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Personalizirane majice se ne mogu vratiti osim u slučaju greške u izradi</li>
            <li>Reklamacije se prihvataju za oštećene ili neispravne proizvode</li>
            <li>Reklamaciju morate prijaviti u roku od 14 dana od prijema</li>
            <li>Potrebno je priložiti fotografije kao dokaz</li>
            <li>U slučaju opravdane reklamacije, nudimo zamjenu ili povrat novca</li>
          </ul>
        </div>

        {/* Delivery */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            7. Dostava
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Informacije o dostavi:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Vrijeme izrade je 3-5 radnih dana</li>
            <li>Dostava se vrši na području Bosne i Hercegovine</li>
            <li>Troškovi dostave se obračunavaju prema lokaciji</li>
            <li>Možete pratiti status narudžbe putem broja za praćenje</li>
            <li>Nismo odgovorni za kašnjenja uzrokovana kurirskom službom</li>
          </ul>
        </div>

        {/* Intellectual Property */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            8. Intelektualno Vlasništvo
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Sav sadržaj na Shirt Shop platformi, uključujući tekst, grafiku, logotipe, ikone, slike i softver, zaštićen je autorskim pravom i zakonima o intelektualnom vlasništvu.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Vaši uploadovani dizajni ostaju vaše vlasništvo. Korištenjem platforme, dajete nam ograničenu licencu za korištenje tih dizajna isključivo u svrhu izrade naručene majice.
          </p>
        </div>

        {/* Liability */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            9. Ograničenje Odgovornosti
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            U najvećoj mjeri dozvoljenoj zakonom:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
            <li>Platforma se pruža &quot;kakva jeste&quot; bez ikakvih garancija</li>
            <li>Nismo odgovorni za indirektnu ili posljedičnu štetu</li>
            <li>Naša odgovornost je ograničena na vrijednost narudžbe</li>
            <li>Nismo odgovorni za sadržaj koji korisnici uploaduju</li>
          </ul>
        </div>

        {/* Changes */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            10. Izmjene Uslova
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Zadržavamo pravo da izmijenimo ove Uslove korištenja u bilo kojem trenutku. Značajne izmjene će biti objavljene na platformi. Nastavak korištenja platforme nakon izmjena predstavlja prihvatanje novih uslova.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-[#12121a] backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            11. Kontakt
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Za sva pitanja u vezi s ovim Uslovima korištenja, kontaktirajte nas:
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
