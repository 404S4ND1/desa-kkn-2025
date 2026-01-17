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
import AdminDashboard from './pages/AdminDashboard'; // Cukup satu kali import
import Login from './pages/Login'; 
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      <Navbar />
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        
        {/* ... Rute publik lain (berita, wisata, dll) ... */}
        <Route path="/layanan-surat" element={<LayananSurat />} />

        {/* Rute RAHASIA (Diproteksi) */}
        <Route element={<ProtectedRoute />}>
           <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;