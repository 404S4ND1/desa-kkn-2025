import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Berita from './pages/Berita';
import BeritaDetail from './pages/BeritaDetail';
import Profil from './pages/Profil';
import Umkm from './pages/Umkm';
import UmkmDetail from './pages/UmkmDetail';
import Wisata from './pages/Wisata';
import WisataDetail from './pages/WisataDetail';
import LayananSurat from './pages/LayananSurat';
import AdminDashboard from './pages/AdminDashboard'; // <--- INI PENTING

function App() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/berita/:id" element={<BeritaDetail />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/umkm" element={<Umkm />} />
        <Route path="/umkm/:id" element={<UmkmDetail />} />
        <Route path="/wisata" element={<Wisata />} />
        <Route path="/wisata/:id" element={<WisataDetail />} />
        <Route path="/layanan-surat" element={<LayananSurat />} />
        {/* Halaman Rahasia Admin */}
        <Route path="/admin-desa-rahasia" element={<AdminDashboard />} />   
      </Routes>
    </div>
  );
}

export default App;