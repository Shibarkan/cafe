import { useState } from 'react';
import { Plus, Minus, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const menuData = [
  { id: 1, name: 'Nasi Goreng', category: 'makanan', price: 15000, img: 'https://i.pinimg.com/1200x/a2/a5/27/a2a5270274776b41d8b15e7a6e72597b.jpg' },
  { id: 2, name: 'Es Teh', category: 'minuman', price: 5000, img: 'https://i.pinimg.com/1200x/a2/a5/27/a2a5270274776b41d8b15e7a6e72597b.jpg' },
  { id: 3, name: 'Pisang Goreng', category: 'cemilan', price: 8000, img: 'https://i.pinimg.com/1200x/a2/a5/27/a2a5270274776b41d8b15e7a6e72597b.jpg' },
];

export default function KasirPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  const addItem = (item) => {
    setCart((prev) => {
      const index = prev.findIndex((i) => i.id === item.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index].quantity += 1;
        return updated;
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const filteredMenu =
    selectedCategory === 'all'
      ? menuData
      : menuData.filter((item) => item.category === selectedCategory);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    toast.success('Checkout berhasil!');
    setCart([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Kasir - Tambah Pesanan</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'makanan', 'minuman', 'cemilan'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid 2 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kiri: Menu */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMenu.map((item) => {
            const inCart = cart.find((c) => c.id === item.id);
            return (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md border flex flex-col items-center text-center"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-full mb-2"
                />
                <h3 className="text-sm font-semibold">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-2">Rp{item.price.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={!inCart}
                    className="bg-red-100 hover:bg-red-200 p-1 rounded disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm w-5 text-center">{inCart?.quantity || 0}</span>
                  <button
                    onClick={() => addItem(item)}
                    className="bg-blue-100 hover:bg-blue-200 p-1 rounded"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kanan: Ringkasan */}
        {cart.length > 0 && (
          <div className="bg-white p-5 rounded-xl shadow-md border h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-800"> Ringkasan</h2>
            <div className="overflow-auto">
              <table className="w-full text-sm text-left mb-4">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th>Menu</th>
                    <th>Qty</th>
                    <th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} className="border-b last:border-none">
                      <td className="py-1">{item.name}</td>
                      <td>{item.quantity}</td>
                      <td className="text-right">Rp{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <td colSpan="2" className="text-right py-2">Total</td>
                    <td className="text-right text-green-600">Rp{total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} /> Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
