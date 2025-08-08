// src/pages/PembeliPage.jsx
import { useEffect, useRef, useState } from "react";
import { Receipt } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

function Toast({ message, onClose, visible }) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl p-6 text-center transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
        <p className="text-sm mb-4">{message}</p>
        <button onClick={onClose} className="bg-black text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}

export default function PembeliPage() {
  const [cart, setCart] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const channelRef = useRef(null);

  // on mount: read localStorage immediate value (so no reload needed)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("current_orders_local");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.cart)) setCart(parsed.cart);
      }
    } catch (e) {
      console.warn("failed to parse current_orders_local");
    }

    // subscribe to storage events (other tabs will trigger this when Kasir updates localStorage)
    const onStorage = (e) => {
      try {
        if (!e) return;
        if (e.key === "current_orders_local") {
          if (!e.newValue) {
            setCart([]);
            return;
          }
          const parsed = JSON.parse(e.newValue);
          if (parsed && Array.isArray(parsed.cart)) setCart(parsed.cart);
        }
        if (e.key === "paymentSuccess" && e.newValue === "1") {
          setShowToast(true);
          localStorage.removeItem("paymentSuccess");
        }
      } catch (err) {
        console.error("storage event parse error", err);
      }
    };
    window.addEventListener("storage", onStorage);

    // Also subscribe to Supabase Realtime for cross-device sync:
    let isMounted = true;
    (async () => {
      try {
        const channel = supabase
          .channel("public:current_orders")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "current_orders", filter: "id=eq.1" },
            (payload) => {
              // prefer payload.new (instant), don't re-fetch
              if (payload?.new) {
                // update local cart
                if (isMounted) setCart(payload.new.cart || []);
                // also mirror into localStorage so other tabs (same origin) remain consistent
                try {
                  localStorage.setItem("current_orders_local", JSON.stringify({ id: 1, cart: payload.new.cart || [], updated_at: new Date().toISOString() }));
                } catch (e) {}
              }
              if (payload?.eventType === "DELETE") {
                if (isMounted) setCart([]);
                try {
                  localStorage.setItem("current_orders_local", JSON.stringify({ id: 1, cart: [], updated_at: new Date().toISOString() }));
                } catch (e) {}
              }
            }
          );
        channelRef.current = channel;
        // subscribe (wrap in try/catch because subscribe might be sync or async depending on supabase-js)
        try {
          await channel.subscribe();
        } catch (err) {
          console.error("channel subscribe error:", err);
        }
      } catch (err) {
        console.error("realtime setup error:", err);
      }
    })();

    // immediate check for paymentSuccess (same tab checkout)
    if (localStorage.getItem("paymentSuccess") === "1") {
      setShowToast(true);
      localStorage.removeItem("paymentSuccess");
    }

    return () => {
      isMounted = false;
      window.removeEventListener("storage", onStorage);
      try {
        if (channelRef.current?.unsubscribe) {
          try { channelRef.current.unsubscribe(); } catch (e) {}
        }
        try { supabase.removeChannel(channelRef.current); } catch (e) {}
      } catch (e) {}
    };
  }, []);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <Toast message="Terima kasih telah berbelanja di Toko Cafe." visible={showToast} onClose={() => setShowToast(false)} />
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl p-6">
        <div className="text-center mb-4">
          <img src="https://i.pinimg.com/1200x/56/e9/00/56e9005a31d7d3f546d3c93f16ca8e22.jpg" alt="Logo" className="w-20 h-20 rounded-full mx-auto mb-2" />
          <h1 className="text-3xl font-bold">Toko Cafe</h1>
          <p className="text-sm text-slate-500">Silakan cek pesanan Anda.</p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center text-slate-500">Belum ada pesanan.</div>
        ) : (
          <>
            <h2 className="font-semibold mb-3">Pesanan Anda:</h2>
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {cart.map((item) => (
                <li key={item.id} className="py-2 flex justify-between">
                  <span>{item.name} <span className="text-xs">x{item.quantity}</span></span>
                  <span>Rp{(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4 font-bold">
              <span>Total:</span>
              <span>Rp{total.toLocaleString()}</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded mt-4 flex items-center gap-2">
              <Receipt size={20} className="text-emerald-600" />
              <span>Pembayaran dilakukan ke kasir.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
