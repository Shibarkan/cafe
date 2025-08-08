import React, { useEffect, useRef, useState } from "react";
import { Plus, Minus, CheckCircle, Sun, Moon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";
import SearchBar from "../components/SearchBar";

export default function KasirPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [dark, setDark] = useState(() => {
    return (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // Dark mode toggle
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [dark]);

  // Fetch products
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        toast.error("Gagal mengambil produk.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCart(parsed);
      } catch {
        console.warn("Invalid cart data in localStorage");
      }
    }
  }, []);

  const saveCartLocal = (nextCart) => {
    try {
      localStorage.setItem("cart", JSON.stringify(nextCart));
      localStorage.setItem(
        "current_orders_local",
        JSON.stringify({
          id: 1,
          cart: nextCart,
          updated_at: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.error("saveCartLocal error", e);
    }
  };

  const addItem = (item) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      const updated =
        idx > -1
          ? prev.map((p, i) =>
              i === idx ? { ...p, quantity: p.quantity + 1 } : p
            )
          : [...prev, { ...item, quantity: 1 }];
      saveCartLocal(updated);
      return updated;
    });
  };

  const removeItem = (id) => {
    setCart((prev) => {
      const updated = prev
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0);
      saveCartLocal(updated);
      return updated;
    });
  };

  // Sync to supabase (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await supabase
          .from("current_orders")
          .upsert(
            { id: 1, cart, updated_at: new Date().toISOString() },
            { returning: "minimal" }
          );
      } catch (err) {
        console.error("Supabase upsert error:", err);
      }
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [cart]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Keranjang kosong.");
    try {
      const transactionId = Date.now();
      const { error: errTx } = await supabase
        .from("transactions")
        .insert([{ id: transactionId, total, date: new Date().toISOString() }]);
      if (errTx) throw errTx;

      const itemsPayload = cart.map((it) => ({
        transaction_id: transactionId,
        product_id: it.id,
        product_name: it.name,
        category: it.category,
        price: it.price,
        quantity: it.quantity,
      }));
      const { error: errItems } = await supabase
        .from("transaction_items")
        .insert(itemsPayload);
      if (errItems) throw errItems;

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem("transactions") || "[]");
      existing.push({
        id: transactionId,
        items: cart,
        total,
        date: new Date().toISOString(),
      });
      localStorage.setItem("transactions", JSON.stringify(existing));

      localStorage.setItem("paymentSuccess", "1");
      localStorage.setItem(
        "current_orders_local",
        JSON.stringify({
          id: 1,
          cart: [],
          updated_at: new Date().toISOString(),
        })
      );

      await supabase
        .from("current_orders")
        .upsert(
          { id: 1, cart: [], updated_at: new Date().toISOString() },
          { returning: "minimal" }
        );

      toast.success("Checkout berhasil!");
      setCart([]);
      localStorage.removeItem("cart");
    } catch {
      toast.error("Gagal menyimpan transaksi.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <header className="flex flex-col sm:flex-row  sm:items-center">
        <img
          src="https://i.pinimg.com/1200x/56/e9/00/56e9005a31d7d3f546d3c93f16ca8e22.jpg"
          alt="Logo"
          className="w-15 h-15 rounded-full object-cover  dark:border-indigo-500/50 "
        />
        <h1 className="text-2xl font-bold">Toko Cafe • Kasir</h1>
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition right-0 top-0 ml-auto"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* Search */}
      <section className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </section>

      {/* Category */}
      <section className="mb-4">
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {["all", "makanan", "minuman", "cemilan"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded-full border text-sm ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </section>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 flex-1">
          {loading ? (
            <p className="text-center text-gray-500">Memuat produk...</p>
          ) : (
            (selectedCategory === "all"
              ? products
              : products.filter((p) => p.category === selectedCategory)
            )
              .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item) => {
                const inCart = cart.find((c) => c.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col items-center"
                  >
                    <div className="w-28 h-28 rounded-md overflow-hidden mb-2">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-center truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      Rp{item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={!inCart}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium">
                        {inCart?.quantity || 0}
                      </span>
                      <button
                        onClick={() => addItem(item)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <aside className="lg:w-80 bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-6 h-fit">
            <h2 className="text-lg font-bold mb-3">🧾 Ringkasan</h2>
            <ul className="space-y-2 text-sm">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>Rp{(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-semibold mt-4 pt-4 border-t">
              <span>Total</span>
              <span>Rp{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 transition flex justify-center items-center gap-2"
            >
              <CheckCircle size={18} /> Checkout
            </button>
          </aside>
        )}
      </div>
    </main>
  );
}
