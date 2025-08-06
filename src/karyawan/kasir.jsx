import { useState } from "react";
import { Plus, Minus, CheckCircle, Sun, Moon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import menuData from "../data/products";
import { saveCart } from "../helper/cartStorage";

export default function KasirPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [dark, setDark] = useState(
    () =>
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  /* --- theme toggle --- */
  if (dark) {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
  }

  const addItem = (item) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      let updated;
      if (idx > -1) {
        updated = prev.map((p, i) =>
          i === idx ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        updated = [...prev, { ...item, quantity: 1 }];
      }
      saveCart(updated);
      return updated;
    });
  };

  const removeItem = (id) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
      saveCart(updated);
      return updated;
    });
  };

  const filteredMenu =
    selectedCategory === "all"
      ? menuData
      : menuData.filter((item) => item.category === selectedCategory);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const transaction = {
      id: Date.now(), // Use timestamp as unique ID
      items: cart,
      total,
      date: new Date().toISOString(),
    };

    // Save transaction to local storage
    const existingTransactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );
    localStorage.setItem(
      "transactions",
      JSON.stringify([...existingTransactions, transaction])
    );

    toast.success("Checkout berhasil! Terima kasih ☕");
    setCart([]);
    saveCart([]);
    localStorage.setItem("paymentSuccess", "1"); // <-- trigger for Pembeli
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Theme Toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-slate-800 shadow-md"
        aria-label="Toggle dark mode"
      >
        {dark ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-slate-500" />
        )}
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">
          Kasir - Tambah Pesanan
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {["all", "makanan", "minuman", "cemilan"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-slate-700"
                }
              `}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Menu Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenu.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow hover:shadow-lg transition-transform hover:-translate-y-1 overflow-hidden flex flex-col"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-base mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-3">
                      Rp{item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-auto">
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={!inCart}
                        className="p-1 rounded-full bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-5 text-center font-bold">
                        {inCart?.quantity || 0}
                      </span>
                      <button
                        onClick={() => addItem(item)}
                        className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-800"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
              <div className="max-h-72 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm py-2 border-b border-slate-200 dark:border-slate-700"
                  >
                    <span>
                      {item.name}{" "}
                      <span className="text-xs text-slate-500">
                        x{item.quantity}
                      </span>
                    </span>
                    <span>
                      Rp{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  Rp{total.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <CheckCircle size={18} /> Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}