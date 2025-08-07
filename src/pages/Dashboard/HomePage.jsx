import React from 'react';
import SalesStatistics from './SalesStatistics.jsx';

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white tracking-tight mb-4 flex items-center justify-center gap-3">
          
          <span>Penjualan</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-xl mx-auto">
          Ringkasan performa penjualan harian kamu. Lihat tren dan insight secara visual.
        </p>
      </header>

      <main className="flex justify-center">
        <div className="w-full max-w-6xl space-y-8">
          <SalesStatistics />

          {/* Komponen tambahan bisa ditaruh di sini */}
          {/* <TopProduct /> */}
          {/* <RevenueSummary /> */}
        </div>
      </main>
    </div>
  );
}

export default HomePage;