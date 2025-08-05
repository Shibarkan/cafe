import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "123456") {
      navigate("/dashboard");
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
      px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img
            src="https://i.pinimg.com/1200x/2b/c5/77/2bc577b9cc67612d0bbc84647fca4e91.jpg"
            alt="Logo Toko Cafe"
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2
              focus:ring-indigo-400 outline-none text-gray-700"
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2
              focus:ring-indigo-400 outline-none text-gray-700"
            placeholder="Password"
          />
          <button
            type="submit"
            className="w-full h-12 text-white bg-indigo-600 rounded-full hover:bg-indigo-700
              font-semibold transition"
          >
            Masuk
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Hanya karyawan resmi Toko Cafe yang bisa masuk.
        </p>
      </div>
    </div>
  );
}
