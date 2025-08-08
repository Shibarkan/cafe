// src/pages/Delete.jsx
import React, { useEffect, useState } from "react";
import { Trash2, RefreshCw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../lib/supabaseClient"; // sesuaikan path jika perlu

export default function DeletePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Gagal memuat produk. Cek console.");
    } finally {
      setLoading(false);
    }
  }

  // parse URL public Supabase storage -> { bucket, path } or null
  function parseSupabasePublicUrl(url) {
    if (!url || typeof url !== "string") return null;
    try {
      const marker = "/object/public/";
      const idx = url.indexOf(marker);
      if (idx === -1) return null;
      const rest = url.slice(idx + marker.length); // product-images/dir/file.jpg
      const parts = rest.split("/");
      const bucket = parts.shift();
      const path = parts.join("/");
      if (!bucket || !path) return null;
      return { bucket, path };
    } catch (e) {
      return null;
    }
  }

  async function handleDelete(product) {
    const ok = window.confirm(
      `Hapus produk "${product.name}" (ID: ${product.id})?\nAksi ini tidak bisa dibatalkan.`
    );
    if (!ok) return;

    setDeletingId(product.id);
    const loadingToastId = toast.loading("Menghapus...");

    try {
      // 1) Hapus file di storage (jika parseable)
      if (product.img) {
        const parsed = parseSupabasePublicUrl(product.img);
        if (parsed) {
          try {
            const { data: rmData, error: rmError } = await supabase.storage
              .from(parsed.bucket)
              .remove([parsed.path]);
            if (rmError) {
              console.warn("Storage remove error:", rmError);
              // jangan throw langsung — beri peringatan, lalu lanjut hapus record DB
              toast.error("Gagal menghapus file gambar di storage (cek console).");
            } else {
              console.log("Storage remove success:", rmData);
            }
          } catch (e) {
            console.error("Exception removing storage file:", e);
            toast.error("Error saat menghapus file gambar (cek console).");
          }
        } else {
          console.log("Image URL bukan public Supabase URL — skip storage delete.");
        }
      }

      // 2) Hapus row dari tabel products
      // gunakan .delete().eq(...).select() agar kita mendapatkan hasil dan error detail
      const { data: delData, error: delError } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id)
        .select();

      if (delError) {
        console.error("Delete row error:", delError);
        // RLS/permission error biasanya muncul di sini
        if (delError?.status === 403 || delError?.message?.toLowerCase().includes("permission") ) {
          toast.error("Gagal menghapus produk: izin ditolak (periksa RLS policy).");
        } else {
          toast.error(delError.message || "Gagal menghapus produk.");
        }
        setDeletingId(null);
        toast.dismiss(loadingToastId);
        return;
      }

      // 3) Update UI
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.dismiss(loadingToastId);
      toast.success("Produk berhasil dihapus.");
    } catch (err) {
      console.error("Unhandled delete error:", err);
      toast.error("Terjadi kesalahan saat menghapus (cek console).");
      toast.dismiss(loadingToastId);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Hapus Produk</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchProducts}
              className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 transition flex items-center gap-2"
            >
              <RefreshCw size={16} /> Segarkan
            </button>
          </div>
        </header>

        {loading ? (
          <p className="text-gray-500">Memuat produk...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">Tidak ada produk.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 flex flex-col items-center">
                <div className="w-full h-36 rounded-md overflow-hidden mb-3 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {p.img ? (
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xs text-gray-500">No image</div>
                  )}
                </div>

                <div className="w-full text-center">
                  <h3 className="text-sm font-semibold truncate">{p.name}</h3>
                  <p className="text-xs text-gray-500">Rp{(p.price || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">{p.category}</p>
                </div>

                <div className="w-full mt-3 flex gap-2">
                  <button
                    onClick={() => handleDelete(p)}
                    disabled={deletingId === p.id}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    {deletingId === p.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
