import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { 
  LayoutDashboard, FileText, Newspaper, LogOut, 
  Home, MessageSquare, Menu, X, PanelLeft
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- STATE ---
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [user, setUser] = useState(null);
  
  // Stats untuk badge notifikasi di sidebar
  const [stats, setStats] = useState({ 
    total_pengaduan: 0, 
    surat_terbaru: [] 
  });

  // --- RESIZE LISTENER ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // --- FETCH USER & BADGE DATA ---
  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        const userRes = await api.get('/user');
        setUser(userRes.data);
        
        // Ambil data stats untuk badge sidebar (opsional, biar realtime)
        const statRes = await api.get('/dashboard-stats');
        setStats(statRes.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchLayoutData();
  }, [navigate]);

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch (e) { console.warn(e); }
    localStorage.removeItem('token');
    navigate('/login');
  };

  // --- CSS CLASS LOGIC ---
  const sidebarClass = isMobile
    ? `fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
    : `relative bg-primary text-white h-full transition-all duration-300 ease-in-out overflow-hidden ${sidebarOpen ? 'w-64' : 'w-0'}`;

  return (
    <div className="flex h-screen bg-surface font-sans text-primary overflow-hidden">
      
      {/* BACKDROP (Mobile Only) */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={sidebarClass}>
        <div className="w-64 h-full flex flex-col">
            {/* Header Sidebar */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-primary shadow-sm flex-shrink-0">
                <div className="flex items-center gap-3 font-bold text-xl tracking-wide whitespace-nowrap">
                   <div className="w-8 h-8 bg-white text-primary rounded-lg flex items-center justify-center text-sm shadow-md">🏛️</div>
                   <span className="drop-shadow-sm">Admin Desa</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/70 hover:text-white transition p-1"><X size={24}/></button>
            </div>
            
            {/* Menu Navigasi */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
              <NavItem to="/admin-dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" active={location.pathname === '/admin-dashboard'} />
              
              <p className="px-4 text-xs font-bold text-neutral/50 uppercase tracking-wider mt-6 mb-2 whitespace-nowrap">Layanan Desa</p>
              <NavItem to="/surat-admin" icon={<FileText size={20}/>} label="Verifikasi Surat" active={location.pathname === '/surat-admin'} badge={stats.surat_terbaru?.filter(s => s.status === 'Pending').length} />
              <NavItem to="/pengaduan-admin" icon={<MessageSquare size={20}/>} label="Pengaduan Warga" active={location.pathname === '/pengaduan-admin'} badge={stats.total_pengaduan} badgeColor="bg-accent" />
              
              <p className="px-4 text-xs font-bold text-neutral/50 uppercase tracking-wider mt-6 mb-2 whitespace-nowrap">Konten Website</p>
              <NavItem to="/berita-admin" icon={<Newspaper size={20}/>} label="Kelola Berita" active={location.pathname === '/berita-admin'} />
              
              <div className="pt-6 mt-4 border-t border-white/10">
                 <NavItem to="/" icon={<Home size={20}/>} label="Website Utama" />
              </div>
            </nav>

            {/* Footer Sidebar */}
            <div className="p-4 border-t border-white/10 bg-primary flex-shrink-0">
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-white/10 hover:text-red-200 rounded-xl transition font-medium group whitespace-nowrap">
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform"/> Logout
              </button>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen min-w-0 bg-surface relative">
        {/* Top Header */}
        <header className="h-16 flex-shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm border-b border-neutral/20">
          <div><h1 className="text-xl font-bold text-primary truncate">{title}</h1></div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-primary">{user?.name || 'Admin'}</p>
               <p className="text-xs text-secondary">Administrator</p>
            </div>
            <div className="w-9 h-9 bg-neutral/30 rounded-full flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm">
               {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
          
          {/* TOMBOL TOGGLE GLOBAL DI SINI */}
          <div className="flex items-center">
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="flex items-center gap-2 bg-white text-primary px-4 py-2.5 rounded-xl shadow-sm border border-neutral/20 hover:bg-neutral/10 hover:shadow-md transition-all active:scale-95 group"
            >
                {sidebarOpen ? <PanelLeft size={20} className="text-secondary"/> : <Menu size={20} className="text-accent"/>}
                <span className="font-bold text-sm">{sidebarOpen ? 'Tutup Menu' : 'Buka Menu'}</span>
            </button>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

// Komponen Helper NavItem
function NavItem({ to, icon, label, active, badge, badgeColor }) {
    return (
        <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium mb-1 group relative overflow-hidden whitespace-nowrap ${
            active ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}>
            <div className="flex items-center gap-3 relative z-10">
                <span className={`${active ? 'text-accent' : 'group-hover:text-accent transition-colors'}`}>{icon}</span>
                <span>{label}</span>
            </div>
            {badge > 0 && <span className={`${badgeColor || 'bg-red-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm`}>{badge}</span>}
        </Link>
    );
}