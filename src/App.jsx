import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import HomePage from './pages/Dashboard/HomePage';
import RiwayatPage from './pages/Dashboard/RiwayatPage';
import TambahPesananPage from './pages/Dashboard/TambahMenu';
import { Toaster } from 'react-hot-toast';

import KasirPage from './karyawan/kasir';
import PembeliPage from './pembeli/pembeli';

function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-center" />
      <Routes>
        
        <Route path="/" element={<LoginPage />} />
        
        {/* Dashboard Admin */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="riwayat" element={<RiwayatPage />} />
          <Route path="pesanan" element={<TambahPesananPage />} />
        </Route>

        {/* Kasir POV */}
        <Route path="/kasir" element={<KasirPage />} />

        {/* Pembeli POV */}
        <Route path="/pembeli" element={<PembeliPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
