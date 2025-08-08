import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LineChart,
  Clock,
  UtensilsCrossed,
  LogOut,
  ShoppingBag,
  User,
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Statistik", to: "/dashboard", icon: <LineChart size={18} /> },
    { name: "Riwayat Transaksi", to: "/dashboard/riwayat", icon: <Clock size={18} /> },
    { name: "Tambah Menu", to: "/dashboard/pesanan", icon: <UtensilsCrossed size={18} /> },
    { name: "Kasir", to: "/kasir", icon: <ShoppingBag size={18} /> },
    { name: "Pembeli", to: "/pembeli", icon: <User size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 w-72 h-screen overflow-y-auto bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header Mobile */}
        <div className="flex justify-between items-center px-6 py-4 border-b md:hidden">
          <img
            src="https://i.pinimg.com/1200x/56/e9/00/56e9005a31d7d3f546d3c93f16ca8e22.jpg"
            alt="Logo"
            className="h-15 w-15 rounded-full shadow-lg object-cover border-4 border-white"
          />
          <h1 className="text-xl font-bold text-gray-800 drop-shadow-md">Toko Cafe</h1>
          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Header Desktop */}
        <div className="hidden md:flex p-4 items-center gap-2 py-5 border-b bg-white">
          <img
            src="https://i.pinimg.com/1200x/56/e9/00/56e9005a31d7d3f546d3c93f16ca8e22.jpg"
            alt="Logo"
            className="h-8 w-8 rounded-full shadow-lg object-cover border-4 border-white"
          />
          <h1 className="text-xl font-bold text-gray-800 drop-shadow-md">Toko Cafe</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 mt-6 px-4">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 mt-8 rounded-md text-sm font-medium text-red-500 hover:bg-red-100 transition-colors w-full text-left"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto max-h-screen">
        {/* Mobile Toggle */}
        <button
          className="md:hidden mb-4 bg-white px-4 py-2 rounded-md shadow flex items-center gap-2"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
          <span className="text-sm font-medium">Menu</span>
        </button>

        <Outlet />
      </main>
    </div>
  );
}
