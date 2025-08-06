import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiSun, FiMoon } from "react-icons/fi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [dark, setDark] = useState(
    () =>
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const navigate = useNavigate();

  /* --- theme switcher --- */
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [dark]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "123456") {
      navigate("/dashboard");
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4
        bg-gradient-to-br from-slate-50 to-slate-200
        dark:from-slate-900 dark:to-slate-800 transition-colors duration-500`}
    >
      {/* theme toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="absolute top-5 right-5 p-2 rounded-full bg-white/30 dark:bg-slate-700/30
          hover:bg-white/50 dark:hover:bg-slate-700/50 transition"
        aria-label="Toggle dark mode"
      >
        {dark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-slate-600" />}
      </button>

      {/* card */}
      <div
        className="w-full max-w-sm rounded-3xl shadow-xl
          bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg
          p-8 space-y-6"
      >
        {/* logo */}
        <div className="flex justify-center">
          <img
            src="https://i.pinimg.com/1200x/56/e9/00/56e9005a31d7d3f546d3c93f16ca8e22.jpg" /* replace with your logo */
            alt="Logo"
            className="w-28 h-28 rounded-full object-cover border-4 border-transparent
              dark:border-indigo-500/50 shadow-lg"
          />
        </div>

        <h1 className="text-center text-2xl font-bold text-slate-700 dark:text-slate-100">
          Masuk ke Toko Cafe
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
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

          {/* Password */}
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Password
            <div className="relative mt-1">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full h-11 px-4 pr-12 rounded-xl bg-white/70 dark:bg-slate-700/70
                  border border-slate-200 dark:border-slate-600
                  focus:ring-2 focus:ring-indigo-500 focus:outline-none
                  text-slate-800 dark:text-slate-100 placeholder-slate-400"
                placeholder="123456"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute inset-y-0 right-0 flex items-center px-3
                  text-slate-500 dark:text-slate-400 hover:text-indigo-500"
              >
                {showPwd ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700
              text-white font-semibold rounded-xl shadow-md
              transform transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Masuk
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Hanya karyawan resmi Toko Cafe yang dapat mengakses.
        </p>
      </div>
    </div>
  );
}