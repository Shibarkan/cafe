// src/pages/TambahPesananPage.jsx
import { useState } from "react";
import { FiCoffee, FiTag, FiDollarSign, FiPlusCircle, FiImage } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function TambahPesananPage() {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [harga, setHarga] = useState("");
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama || !kategori || !harga || !gambar) {
      toast.error("Semua field harus diisi!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success("Produk berhasil ditambahkan!");
      setNama("");
      setKategori("");
      setHarga("");
      setGambar(null);
      setPreview(null);
      setLoading(false);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6
        bg-gradient-to-br from-slate-100 to-slate-300
        dark:from-slate-900 dark:to-slate-800 transition-colors duration-500"
    >
      <div
        className="w-full max-w-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg
          rounded-3xl shadow-xl p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-100 text-center">
          Tambah Pesanan
        </h1>
        <p className="text-sm text-center text-slate-500 dark:text-slate-400">
          Silakan masukkan detail produk atau menu baru.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama Produk */}
          <div className="relative">
            <FiCoffee className="absolute top-3 left-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Produk"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-700/70
                border border-slate-300 dark:border-slate-600
                focus:ring-2 focus:ring-indigo-500 focus:outline-none
                text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          {/* Kategori */}
          <div className="relative">
            <FiTag className="absolute top-3 left-3 text-slate-400 dark:text-slate-500" />
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-700/70
                border border-slate-300 dark:border-slate-600
                focus:ring-2 focus:ring-indigo-500 focus:outline-none
                text-slate-800 dark:text-slate-100"
            >
              <option value="" disabled>Pilih Kategori</option>
              <option value="Minuman">Minuman</option>
              <option value="Makanan">Makanan</option>
              <option value="Snack">Snack</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Harga */}
          <div className="relative">
            <FiDollarSign className="absolute top-3 left-3 text-slate-400 dark:text-slate-500" />
            <input
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              placeholder="Harga (Rp)"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-700/70
                border border-slate-300 dark:border-slate-600
                focus:ring-2 focus:ring-indigo-500 focus:outline-none
                text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          {/* Upload Gambar */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Upload Gambar
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-600 file:text-white
                  hover:file:bg-indigo-700
                  dark:file:bg-indigo-500 dark:hover:file:bg-indigo-600"
              />
              <FiImage className="absolute top-3 right-3 text-slate-400 dark:text-slate-500" />
            </div>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-xl border border-slate-300 dark:border-slate-600 shadow-md"
              />
            )}
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700
              text-white font-semibold rounded-xl shadow-md flex items-center justify-center
              gap-2 transform transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <FiPlusCircle size={18} />
            {loading ? "Memproses..." : "Tambah Produk"}
          </button>
        </form>
      </div>
    </div>
  );
}