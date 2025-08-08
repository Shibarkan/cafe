import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import HomePage from './pages/Dashboard/HomePage';
import RiwayatPage from './pages/Dashboard/RiwayatPage';
import TambahPesananPage from './pages/Dashboard/TambahMenu';
import DeletePage from './pages/Delete';
import { Toaster } from 'react-hot-toast';

import KasirPage from './karyawan/kasir';
import PembeliPage from './pembeli/pembeli';

import ProtectedRoute from './pages/ProtectedRoute'; // ← Tambahkan

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Halaman Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard & Halaman Terproteksi */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="riwayat" element={<RiwayatPage />} />
          <Route path="pesanan" element={<TambahPesananPage />} />
        </Route>

        <Route
          path="/delete"
          element={
            <ProtectedRoute>
              <DeletePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kasir"
          element={
            <ProtectedRoute>
              <KasirPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pembeli"
          element={
            <ProtectedRoute>
              <PembeliPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
