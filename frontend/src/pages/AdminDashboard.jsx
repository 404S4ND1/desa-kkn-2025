import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
// Menggunakan ikon Lucide biar lebih profesional (ganti emoji)
import { 
  LayoutDashboard, FileText, Newspaper, Users, LogOut, 
  Home, MessageSquare, Menu, X 
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Toggle sidebar mobile
  
  // State data dashboard
  const [stats, setStats] = useState({
    total_surat: 0,
    total_berita: 0,
    total_user: 0,
    total_pengaduan: 0, // Tambahan baru
    surat_terbaru: []
  });
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil data saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/user');
        setUser(userRes.data);

        const statRes = await api.get('/dashboard-stats');
        setStats(statRes.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
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
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- SIDEBAR KIRI --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-xl`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 font-bold text-xl tracking-wide">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">A</div>
               <span>Admin Desa</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white"><X size={24}/></button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          <NavItem to="/admin-dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2">Menu Utama</p>
          <NavItem to="/surat-admin" icon={<FileText size={20}/>} label="Kelola Surat" />
          
          {/* 🔥 MENU BARU PENGADUAN DENGAN BADGE ANGKA */}
          <NavItem 
            to="/pengaduan-admin" 
            icon={<MessageSquare size={20}/>} 
            label="Pengaduan Warga" 
            badge={stats.total_pengaduan} 
            badgeColor="bg-red-500"
          />
          
          <NavItem to="/berita-admin" icon={<Newspaper size={20}/>} label="Kelola Berita" />
          
          <div className="pt-8 mt-4 border-t border-slate-800">
             <NavItem to="/" icon={<Home size={20}/>} label="Lihat Website" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-xl transition font-medium">
            <LogOut size={20}/> Logout
          </button>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Overlay Background Mobile */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-600 hover:text-blue-600 p-1"><Menu size={24}/></button>
            <h1 className="text-xl font-bold text-slate-800">Dashboard Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-800">{user?.name || 'Admin'}</p>
               <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
               {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50">
          
          {/* STATISTIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Surat Masuk" count={stats.total_surat} icon={<FileText size={24}/>} color="bg-blue-500" />
            
            {/* 🔥 KARTU PENGADUAN BARU */}
            <Link to="/pengaduan-admin" className="block transform transition hover:-translate-y-1">
                <StatCard title="Pengaduan Warga" count={stats.total_pengaduan || 0} icon={<MessageSquare size={24}/>} color="bg-red-500" />
            </Link>

            <StatCard title="Berita Desa" count={stats.total_berita} icon={<Newspaper size={24}/>} color="bg-emerald-500" />
            <StatCard title="Admin User" count={stats.total_user} icon={<Users size={24}/>} color="bg-indigo-500" />
          </div>

          {/* TABLE RECENT ACTIVITY */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-800 text-lg">Permohonan Surat Terbaru</h2>
              <Link to="/surat-admin" className="text-sm font-bold text-blue-600 hover:underline">Lihat Semua</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                  <tr>
                    <th className="px-6 py-4">Pemohon</th>
                    <th className="px-6 py-4">Jenis Surat</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.surat_terbaru && stats.surat_terbaru.length > 0 ? (
                    stats.surat_terbaru.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-semibold text-slate-900">{item.nama_pemohon}</td>
                        <td className="px-6 py-4">{item.jenis_surat}</td>
                        <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            item.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                            item.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
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
                    <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">Belum ada permohonan surat.</td></tr>
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

// Komponen Helper untuk Sidebar Item
function NavItem({ to, icon, label, active, badge, badgeColor }) {
    return (
        <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition font-medium mb-1 group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <div className="flex items-center gap-3">
                <span className={`${active ? 'text-white' : 'group-hover:text-blue-400'}`}>{icon}</span>
                <span>{label}</span>
            </div>
            {badge > 0 && <span className={`${badgeColor || 'bg-blue-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>{badge}</span>}
        </Link>
    );
}

// Komponen Helper untuk Stat Card
function StatCard({ title, count, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition cursor-default group">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition duration-300 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{count}</h3>
      </div>
    </div>
  );
}