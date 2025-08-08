// src/pages/RiwayatPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function RiwayatPage() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    try {
      // Ambil semua transaksi
      const { data: txs, error: txError } = await supabase.from("transactions").select("*").order("date", { ascending: false });
      if (txError) throw txError;

      // Ambil semua items untuk transaksi yang ada
      const txIds = txs.map((t) => t.id);
      const { data: items, error: itemsError } = await supabase.from("transaction_items").select("*").in("transaction_id", txIds);
      if (itemsError) throw itemsError;

      // Gabungkan
      const grouped = txs.map((t) => ({
        ...t,
        items: items.filter((it) => it.transaction_id === t.id),
      }));

      setTransactions(grouped);
    } catch (err) {
      console.error(err);
      // fallback ke localStorage
      const storedTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      setTransactions(storedTransactions);
    } finally {
      setLoading(false);
    }
  }

  const getFilteredTransactions = () => {
    if (filter === "all") return transactions;

    const now = new Date();
    const daysAgo = filter === "7days" ? 7 : 30;
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - daysAgo);

    return transactions.filter((t) => new Date(t.date) >= cutoff);
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center tracking-tight">Riwayat Transaksi</h1>
        <p className="text-gray-600 text-center mb-6">Daftar transaksi yang sudah dilakukan.</p>

        <div className="flex justify-center gap-4 mb-8">
          {[{ label: "Semua", value: "all" }, { label: "7 Hari Terakhir", value: "7days" }, { label: "30 Hari Terakhir", value: "30days" }].map(({ label, value }) => (
            <button key={value} onClick={() => setFilter(value)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === value ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600"}`}>{label}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading riwayat...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">Tidak ada transaksi dalam rentang waktu ini.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-slate-700">
                <div className="text-center mb-4">
                  <h2 className="text-base font-bold tracking-wide">🧾 Struk Transaksi</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Terima kasih telah bertransaksi</p>
                </div>

                <div className="border-t border-dashed pt-4 text-sm font-mono text-gray-700 dark:text-gray-300 space-y-2">
                  <div className="flex justify-between">
                    <span>Tanggal</span>
                    <span>{new Date(transaction.date).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Rp{transaction.total.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block font-semibold mb-1">Items:</span>
                    <ul className="space-y-1">
                      {transaction.items?.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.product_name} x{item.quantity}</span>
                          <span>Rp{(item.price * item.quantity).toLocaleString()}</span>
                        </li>
                      )) ?? <li>Tidak ada item</li>}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
