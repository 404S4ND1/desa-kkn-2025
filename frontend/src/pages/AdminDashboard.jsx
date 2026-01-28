import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  LayoutDashboard, FileText, Newspaper, Users, LogOut, 
  Home, MessageSquare, Menu, X, ChevronRight, PanelLeft,
  Store, Mountain // 🔥 Import Ikon Wisata (Mountain) & UMKM (Store)
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // --- STATE UTAMA ---
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // State Data (Update: Tambah total_umkm & total_wisata)
  const [stats, setStats] = useState({
    total_surat: 0,
    total_berita: 0,
    total_user: 0,
    total_pengaduan: 0,
    total_umkm: 0, 
    total_wisata: 0,
    surat_terbaru: []
  });
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- EVENT LISTENER RESIZE ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) setSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/user');
        setUser(userRes.data);
        const statRes = await api.get('/dashboard-stats');
        setStats(statRes.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch (e) { console.warn(e); }
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- LOGIKA CSS SIDEBAR (TEMA ASLI DIPERTAHANKAN) ---
  const sidebarClass = isMobile
    ? `fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
    : `relative bg-primary text-white h-full transition-all duration-300 ease-in-out overflow-hidden ${sidebarOpen ? 'w-64' : 'w-0'}`;

  return (
    <div className="flex h-screen bg-surface font-sans text-primary overflow-hidden">
      
      {/* --- BACKDROP (Mobile) --- */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR PANEL --- */}
      <aside className={sidebarClass}>
        <div className="w-64 h-full flex flex-col">
            
            {/* Header Sidebar */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-primary shadow-sm flex-shrink-0">
                <div className="flex items-center gap-3 font-bold text-xl tracking-wide whitespace-nowrap">
                   <div className="w-8 h-8 bg-white text-primary rounded-lg flex items-center justify-center text-sm shadow-md">
                     🏛️
                   </div>
                   <span className="drop-shadow-sm">Admin Desa</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/70 hover:text-white transition p-1"><X size={24}/></button>
            </div>
            
            {/* Menu Navigasi */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
              <NavItem to="/admin-dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
              
              <p className="px-4 text-xs font-bold text-white/50 uppercase tracking-wider mt-6 mb-2 whitespace-nowrap">Layanan Desa</p>
              <NavItem to="/surat-admin" icon={<FileText size={20}/>} label="Verifikasi Surat" badge={stats.surat_terbaru?.filter(s => s.status === 'Pending').length} />
              <NavItem to="/pengaduan-admin" icon={<MessageSquare size={20}/>} label="Pengaduan Warga" badge={stats.total_pengaduan} badgeColor="bg-accent" />
              
              <p className="px-4 text-xs font-bold text-white/50 uppercase tracking-wider mt-6 mb-2 whitespace-nowrap">Potensi Desa</p>
              
              {/* 🔥 MENU BARU UMKM & WISATA */}
              <NavItem to="/umkm-admin" icon={<Store size={20}/>} label="Kelola UMKM" />
              <NavItem to="/wisata-admin" icon={<Mountain size={20}/>} label="Kelola Wisata" />
              
              <p className="px-4 text-xs font-bold text-white/50 uppercase tracking-wider mt-6 mb-2 whitespace-nowrap">Konten</p>
              <NavItem to="/berita-admin" icon={<Newspaper size={20}/>} label="Kelola Berita" />
              
              <div className="pt-6 mt-4 border-t border-white/10">
                 <NavItem to="/" icon={<Home size={20}/>} label="Website Utama" />
              </div>
            </nav>

            <div className="p-4 border-t border-white/10 bg-primary flex-shrink-0">
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-white/10 hover:text-red-200 rounded-xl transition font-medium group whitespace-nowrap">
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform"/> 
                Logout
              </button>
            </div>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 flex flex-col h-screen min-w-0 bg-surface relative">
        
        {/* HEADER UTAMA */}
        <header className="h-16 flex-shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm border-b border-neutral/20">
          <div>
            <h1 className="text-xl font-bold text-primary truncate">Dashboard Overview</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-primary">{user?.name || 'Admin'}</p>
               <p className="text-xs text-secondary">Administrator</p>
            </div>
            <div className="w-9 h-9 bg-neutral/30 rounded-full flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm ring-2 ring-neutral/20">
               {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* ISI DASHBOARD */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
          
          {/* Tombol Toggle Sidebar */}
          <div className="flex items-center">
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="flex items-center gap-2 bg-white text-primary px-4 py-2.5 rounded-xl shadow-sm border border-neutral/20 hover:bg-neutral/10 hover:shadow-md transition-all active:scale-95 group"
            >
                {sidebarOpen ? <PanelLeft size={20} className="text-secondary"/> : <Menu size={20} className="text-accent"/>}
                <span className="font-bold text-sm">
                    {sidebarOpen ? 'Tutup Menu' : 'Buka Menu'}
                </span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard title="Surat Masuk" count={stats.total_surat} icon={<FileText size={24}/>} color="bg-primary" />
            
            <Link to="/pengaduan-admin" className="block transform transition hover:-translate-y-1">
                <StatCard title="Pengaduan" count={stats.total_pengaduan || 0} icon={<MessageSquare size={24}/>} color="bg-accent" />
            </Link>
            
            {/* 🔥 KARTU UMKM & WISATA */}
            <Link to="/umkm-admin" className="block transform transition hover:-translate-y-1">
                <StatCard title="UMKM Desa" count={stats.total_umkm || 0} icon={<Store size={24}/>} color="bg-purple-600" />
            </Link>

            <Link to="/wisata-admin" className="block transform transition hover:-translate-y-1">
                <StatCard title="Wisata Desa" count={stats.total_wisata || 0} icon={<Mountain size={24}/>} color="bg-green-600" />
            </Link>

            <StatCard title="Berita Desa" count={stats.total_berita} icon={<Newspaper size={24}/>} color="bg-secondary" />
            <StatCard title="Total User" count={stats.total_user} icon={<Users size={24}/>} color="bg-yellow-600" />
          </div>

          {/* Tabel Terbaru */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral/20 overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral/10 flex justify-between items-center bg-surface">
              <h2 className="font-bold text-primary text-lg flex items-center gap-2">
                <FileText size={18} className="text-secondary"/> Permohonan Terkini
              </h2>
              <Link to="/surat-admin" className="text-xs md:text-sm font-bold text-accent hover:text-orange-700 flex items-center gap-1">
                Lihat Semua <ChevronRight size={16}/>
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-primary/80 whitespace-nowrap">
                <thead className="bg-neutral/10 text-primary/60 uppercase font-bold text-xs">
                  <tr>
                    <th className="px-6 py-4">Pemohon</th>
                    <th className="px-6 py-4">Jenis Surat</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral/10">
                  {stats.surat_terbaru && stats.surat_terbaru.length > 0 ? (
                    stats.surat_terbaru.map((item) => (
                      <tr key={item.id} className="hover:bg-surface transition">
                        <td className="px-6 py-4 font-semibold text-primary">{item.nama_pemohon}</td>
                        <td className="px-6 py-4">{item.jenis_surat}</td>
                        <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-2 border ${
                            item.status === 'Selesai' ? 'bg-green-100 text-green-700 border-green-200' :
                            item.status === 'Ditolak' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                                item.status === 'Selesai' ? 'bg-green-500' :
                                item.status === 'Ditolak' ? 'bg-red-500' :
                                'bg-yellow-500'
                            }`}></span>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-primary/40 italic">
                        Belum ada data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- KOMPONEN HELPER ---
function NavItem({ to, icon, label, active, badge, badgeColor }) {
    return (
        <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium mb-1 group relative overflow-hidden whitespace-nowrap ${
            active 
            ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}>
            <div className="flex items-center gap-3 relative z-10">
                <span className={`${active ? 'text-accent' : 'group-hover:text-accent transition-colors'}`}>{icon}</span>
                <span>{label}</span>
            </div>
            {badge > 0 && (
                <span className={`${badgeColor || 'bg-red-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm`}>
                    {badge}
                </span>
            )}
        </Link>
    );
}

function StatCard({ title, count, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral/20 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default group">
      <div className={`w-12 h-12 min-w-[3rem] rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-all duration-300 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-primary/60 text-sm font-medium mb-1 truncate">{title}</p>
        <h3 className="text-2xl font-bold text-primary truncate">{count}</h3>
      </div>
    </div>
  );
}