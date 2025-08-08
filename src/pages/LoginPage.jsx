// src/pages/LoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiSun, FiMoon, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Loader = () => (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
    </div>
  </div>
);

const Toast = ({ show, message, type }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-6 right-6 px-4 py-2 rounded-lg shadow-lg z-50
          ${type === "success" ? "bg-green-500" : "bg-red-500"}
          text-white font-medium flex items-center space-x-2`}
      >
        {type === "success" ? <FiCheckCircle size={18} /> : <FiXCircle size={18} />}
        <span>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

const ThemeToggle = ({ dark, toggle }) => (
  <button
    onClick={toggle}
    className="absolute top-5 right-5 p-2 rounded-full bg-white/30 dark:bg-slate-700/30
      hover:bg-white/50 dark:hover:bg-slate-700/50 transition"
    aria-label="Toggle dark mode"
  >
    {dark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-slate-600" />}
  </button>
);

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [dark, setDark] = useState(
    () =>
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const navigate = useNavigate();

  // 🔹 Cek jika sudah login → langsung redirect ke dashboard
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "123456") {
        // 🔹 Simpan status login
        localStorage.setItem("isLoggedIn", "true");

        setToast({ show: true, message: "Login berhasil! Mengarahkan ke dashboard...", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setToast({ show: true, message: "Username atau password salah!", type: "error" });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4
        bg-gradient-to-br from-slate-50 to-slate-200
        dark:from-slate-900 dark:to-slate-800 transition-colors duration-500 relative"
    >
      <ThemeToggle dark={dark} toggle={() => setDark((d) => !d)} />
      {loading && <Loader />}

      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-sm rounded-3xl shadow-xl
            bg-white/10 dark:bg-slate-800/30 backdrop-blur-xl
            border border-white/20 dark:border-slate-600
            p-8 space-y-6"
        >
          <div className="flex justify-center">
            <img
              src="https://i.pinimg.com/1200x/56/e9/00/56e9005a31d7d3f546d3c93f16ca8e22.jpg"
              alt="Logo"
              className="w-28 h-28 rounded-full object-cover border-4 border-transparent
                dark:border-indigo-500/50 shadow-lg"
            />
          </div>

          <h1 className="text-center text-2xl font-bold text-slate-700 dark:text-slate-100">
            Masuk ke Toko Cafe
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full h-11 px-4 rounded-xl bg-white/70 dark:bg-slate-700/70
                  border border-slate-200 dark:border-slate-600
                  focus:ring-2 focus:ring-indigo-500 focus:outline-none
                  text-slate-800 dark:text-slate-100 placeholder-slate-400"
                placeholder="admin"
              />
            </label>

            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Password
              <div className="relative mt-1">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                  className="block w-full h-11 px-4 pr-12 rounded-xl bg-white/70 dark:bg-slate-700/70
                    border border-slate-200 dark:border-slate-600
                    focus:ring-2 focus:ring-indigo-500 focus:outline-none
                    text-slate-800 dark:text-slate-100 placeholder-slate-400"
                  placeholder="123456"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center px-3
                    text-slate-500 dark:text-slate-400 hover:text-indigo-500"
                >
                  {showPwd ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-11 bg-indigo-600 hover:bg-indigo-700
                text-white font-semibold rounded-xl shadow-md
                transform transition hover:scale-[1.02] active:scale-[0.98]
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              Masuk
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Hanya karyawan resmi Toko Cafe yang dapat mengakses.
          </p>
        </motion.div>
      )}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
}
