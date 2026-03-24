import React from 'react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="relative bg-gradient-to-br from-orange-900 via-fuchsia-900 to-[#0a0a0f] text-white py-20 md:py-32">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Dostava</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">Sve što trebate znati o načinima dostave, rokovima i troškovima.</p>
        </div>
      </header>

      <main className="container-custom py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="bg-[#12121a] rounded-2xl p-6 border border-orange-500/10">
            <h2 className="text-2xl font-semibold text-white">Rokovi dostave</h2>
            <p className="text-gray-400 mt-2">Standardna izrada i slanje traje 2-7 radnih dana. Za urbane lokacije rokovi mogu biti kraći; za međunarodne isporuke pogledajte dodatne opcije pri checkoutu.</p>
          </section>

          <section className="bg-[#12121a] rounded-2xl p-6 border border-orange-500/10">
            <h2 className="text-2xl font-semibold text-white">Dostavne opcije i cijene</h2>
            <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
              <li>Standard (ekonomična) — 2-7 radnih dana — cijena ovisi o težini</li>
              <li>Express — 1-2 radna dana (dostupno za odabrane lokacije)</li>
              <li>Preuzimanje u radnji — besplatno (provjerite dostupnost)</li>
            </ul>
          </section>

          <section className="bg-[#12121a] rounded-2xl p-6 border border-orange-500/10">
            <h2 className="text-2xl font-semibold text-white">Praćenje pošiljke</h2>
            <p className="text-gray-400 mt-2">Nakon slanja dobit ćete email s brojem za praćenje. Unesite broj na stranici za praćenje kako biste dobili detaljan status.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
