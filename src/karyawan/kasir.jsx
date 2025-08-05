import { useState } from 'react';
import { CookingPot, Coffee, Plus, CheckCircle, Trash } from 'lucide-react';

const menuData = [
  { id: 1, name: 'Nasi Goreng', category: 'makanan', price: 15000, img: 'https://i.pinimg.com/1200x/a2/a5/27/a2a5270274776b41d8b15e7a6e72597b.jpg' },
  { id: 2, name: 'Es Teh', category: 'minuman', price: 5000, img: 'https://i.pinimg.com/1200x/a2/a5/27/a2a5270274776b41d8b15e7a6e72597b.jpg' },
  { id: 3, name: 'Pisang Goreng', category: 'cemilan', price: 8000, img: 'https://i.pinimg.com/1200x/a2/a5/27/a2a5270274776b41d8b15e7a6e72597b.jpg' },
  // tambahkan item lainnya...
];

export default function KasirPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  const addItem = (item) => {
    setCart((prev) => [...prev, { ...item, note: '' }]);
  };

  const setNote = (index, note) => {
    const updated = [...cart];
    updated[index].note = note;
    setCart(updated);
  };

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const filteredMenu = selectedCategory === 'all'
    ? menuData
    : menuData.filter(item => item.category === selectedCategory);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Kasir - Tambah Pesanan</h1>

      {/* Filter Kategori */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['all', 'makanan', 'minuman', 'cemilan'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col items-center text-center"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
            <p className="font-semibold text-sm text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-500 mb-2">Rp{item.price.toLocaleString()}</p>
            <button
              onClick={() => addItem(item)}
              className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
            >
              <Plus size={14} /> Tambah
            </button>
          </div>
        ))}
      </div>

      {/* Keranjang */}
      {cart.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-xl border shadow space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">🛒 Keranjang Pesanan</h2>
            <p className="text-sm text-gray-500">Total: <span className="font-bold text-blue-600">Rp{total.toLocaleString()}</span></p>
          </div>
          <ul className="space-y-4">
            {cart.map((item, i) => (
              <li key={i} className="flex items-start justify-between border-b pb-3">
                <div className="flex items-start gap-3">
                  <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">Rp{item.price.toLocaleString()}</p>
                    <textarea
                      placeholder="Catatan (opsional)..."
                      value={item.note}
                      onChange={(e) => setNote(i, e.target.value)}
                      className="mt-1 w-full text-xs p-1 border rounded"
                    />
                  </div>
                </div>
                <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700">
                  <Trash size={18} />
                </button>
              </li>
            ))}
          </ul>

          {/* Tombol Checkout */}
          <button
            onClick={() => alert('Pesanan berhasil di-checkout!')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} /> Checkout Pesanan (Rp{total.toLocaleString()})
          </button>
        </div>
      )}
    </div>
  );
}
