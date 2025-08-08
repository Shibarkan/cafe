// src/pages/TambahMenu.jsx
import { useState } from "react";
import {
  FiCoffee,
  FiTag,
  FiDollarSign,
  FiPlusCircle,
  FiImage,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";
import { Trash } from "lucide-react";
import { Link } from "react-router-dom";

export default function TambahMenuPage() {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [harga, setHarga] = useState("");
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setGambar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama || !kategori || !harga || !gambar) {
      toast.error("Semua field harus diisi!");
      return;
    }

    setLoading(true);
    try {
      // 1) Upload ke storage
      const fileExt = gambar.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, gambar, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("Image uploaded:", uploadData);

      // 2) Ambil public URL
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      if (publicUrlError) {
        console.error("GetPublicUrl error:", publicUrlError);
        throw publicUrlError;
      }
      const imageUrl = publicUrlData.publicUrl;
      console.log("Public URL:", imageUrl);

      // 3) Insert ke tabel products (JANGAN sertakan id)
      const payload = {
        name: nama,
        category: kategori.toLowerCase(),
        price: Number(harga),
        img: imageUrl,
      };

      // gunakan .select() supaya response berisi data yang dimasukkan
      const { data: insertData, error: insertError } = await supabase
        .from("products")
        .insert([payload])
        .select();

      if (insertError) {
        console.error("Insert error detail:", insertError);
        // jika error duplicate key (23505) kemungkinan sequence belum sinkron
        if (insertError?.code === "23505") {
          toast.error(
            "Gagal menambahkan produk: duplicate key. Jalankan SQL untuk sinkronisasi sequence."
          );
        } else {
          toast.error(insertError.message || "Gagal menambahkan produk!");
        }
        throw insertError;
      }

      console.log("Insert result:", insertData);
      toast.success("Produk berhasil ditambahkan!");
      // reset form
      setNama("");
      setKategori("");
      setHarga("");
      setGambar(null);
      setPreview(null);
    } catch (err) {
      console.error("Error (final):", err);
      if (!err?.message) {
        toast.error("Gagal menambahkan produk (cek console untuk detail).");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl shadow-xl p-8 space-y-6 ">
        <img
          src="https://i.pinimg.com/1200x/56/e9/00/56e9005a31d7d3f546d3c93f16ca8e22.jpg"
          alt="Logo"
          className="w-28 h-28 rounded-full object-cover border-4 border-transparent dark:border-indigo-500/50 shadow-lg mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-100 text-center">
          Tambah Menu
        </h1>
        <p className="text-sm text-center text-slate-500 dark:text-slate-400">
          Silakan masukkan detail menu baru.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiCoffee className="absolute top-3 left-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Produk"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-700/70 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <FiTag className="absolute top-3 left-3 text-slate-400 dark:text-slate-500" />
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-700/70 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Pilih Kategori
              </option>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
              <option value="cemilan">Cemilan</option>
            </select>
          </div>

          <div className="relative">
            <FiDollarSign className="absolute top-3 left-3 text-slate-400 dark:text-slate-500" />
            <input
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              placeholder="Harga (Rp)"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-700/70 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Upload Gambar
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
              <FiImage className="absolute top-3 right-3 text-slate-400 dark:text-slate-500" />
            </div>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-contain "
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <FiPlusCircle size={18} />
            {loading ? "Memproses..." : "Tambah Produk"}
          </button>
          <Link to="/delete" className="w-full">
            <button className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2">
              <Trash size={18} /> Hapus Menu
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
