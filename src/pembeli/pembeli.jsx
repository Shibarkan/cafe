import { useEffect, useState } from "react";
import { loadCart } from "../helper/cartStorage";
import { Receipt, X } from "lucide-react";

// ---------- Toast component ----------
function Toast({ message, onClose, visible }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(t);
    } else {
      setAnimate(false);
    }
  }, [visible]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
      aria-live="polite"
    >
      <div
        className={`relative w-full max-w-sm bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] p-8 text-center border border-slate-200 dark:border-slate-700 transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Animated Check */}
        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30 animate-pulse-slow"></div>
            <svg
              className="w-full h-full relative z-10"
              viewBox="0 0 52 52"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={`stroke-current text-emerald-200 transition-opacity duration-700 ease-out ${
                  animate ? "opacity-100" : "opacity-0"
                }`}
                cx="26"
                cy="26"
                r="25"
                fill="none"
                strokeWidth="2"
              />
              <circle
                className={`stroke-current text-emerald-500 dark:text-emerald-400 transition-all duration-700 ease-out ${
                  animate ? "opacity-100" : "opacity-0"
                }`}
                cx="26"
                cy="26"
                r="25"
                fill="none"
                strokeWidth="2"
                strokeDasharray="157"
                strokeDashoffset={animate ? "0" : "157"}
                strokeLinecap="round"
              />
              <path
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                className={`stroke-current text-emerald-500 dark:text-emerald-400 transition-all duration-500 ease-out delay-300 ${
                  animate ? "opacity-100" : "opacity-0"
                }`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="30"
                strokeDashoffset={animate ? "0" : "30"}
                fill="none"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Pembayaran Berhasil!
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full max-w-[200px] bg-black text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Close
        </button>

        <style>{`
          @keyframes pulse-slow {
            0%,100% { transform: scale(1); opacity: .55; }
            50% { transform: scale(1.08); opacity: .35; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 2.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
// ---------- End Toast component ----------

export default function PembeliPage() {
  const [cart, setCart] = useState(() => loadCart());
  const [showToast, setShowToast] = useState(false);

  /* Detect payment-success flag */
  useEffect(() => {
    const checkFlag = () => {
      if (localStorage.getItem("paymentSuccess") === "1") {
        setShowToast(true);
        localStorage.removeItem("paymentSuccess");
      }
    };
    checkFlag();
    window.addEventListener("storage", checkFlag);
    const fallback = setInterval(checkFlag, 1000);
    return () => {
      window.removeEventListener("storage", checkFlag);
      clearInterval(fallback);
    };
  }, []);

  /* Auto-dismiss toast after 3s */
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  /* Sync cart across tabs */
  useEffect(() => {
    const syncCart = () => setCart(loadCart());
    window.addEventListener("storage", syncCart);
    const interval = setInterval(syncCart, 1000);
    return () => {
      window.removeEventListener("storage", syncCart);
      clearInterval(interval);
    };
  }, []);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast notification */}
      <Toast
        message="Terima kasih telah berbelanja di Toko Cafe."
        visible={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8 space-y-6">
        {/* Heading */}
        <div className="text-center">
          <img
            src="https://i.pinimg.com/1200x/56/e9/00/56e9005a31d7d3f546d3c93f16ca8e22.jpg"
            alt="Logo"
            className="w-20 h-20 object-cover rounded-full shadow-md mx-auto mb-4"
          />
          <h1 className="text-3xl font-extrabold flex justify-center items-center gap-2">
            Toko Cafe
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Silakan cek kembali pesanan Anda sebelum membayar.
          </p>
        </div>

        {/* Order Summary */}
        {cart.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Belum ada pesanan.
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-lg font-semibold mb-3">Pesanan Anda:</h2>
              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 flex justify-between items-start text-sm font-medium"
                  >
                    <div className="flex flex-col">
                      <span className="text-slate-700 dark:text-slate-300">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="text-slate-900 dark:text-white font-semibold">
                      Rp{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-t pt-4 dark:border-slate-700">
              <span className="text-base font-medium">Total:</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                Rp{total.toLocaleString()}
              </span>
            </div>

            {/* Payment Info */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl flex items-center gap-3 mt-4 text-sm text-slate-700 dark:text-slate-200">
              <Receipt
                size={20}
                className="text-emerald-600 dark:text-emerald-400 flex-shrink-0"
              />
              <div>
                Pembayaran dapat dilakukan langsung ke kasir. Terima kasih atas
                pesanan Anda!
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
