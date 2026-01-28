import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  LayoutDashboard, FileText, Newspaper, Home, LogOut, Menu, X, 
  Mountain, Plus, Trash2, MapPin, MessageCircle, Ticket, Store, MessageSquare,
  PanelLeft, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WisataAdmin() {
  const navigate = useNavigate();
  
  // --- STATE UTAMA (Sesuai Tema Dashboard) ---
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [user, setUser] = useState(null); // Untuk profil di header

  // State Data Wisata
  const [wisataList, setWisataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    nama_wisata: '', pengelola: '', deskripsi: '', alamat: '', no_wa: '', link_maps: '', kategori: 'Alam', harga_tiket: ''
  });
  const [foto, setFoto] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

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
  const fetchData = async () => {
    try {
      // Ambil User untuk Header
      const userRes = await api.get('/user');
      setUser(userRes.data);

      // Ambil Data Wisata
      const res = await api.get('/wisata');
      setWisataList(res.data);
    } catch (error) {
      console.error("Gagal load data", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [navigate]);

  // --- HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (foto) data.append('foto', foto);

    try {
      await api.post('/wisata', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Wisata Berhasil Ditambahkan!");
      setIsModalOpen(false);
      fetchData();
      setFormData({ nama_wisata: '', pengelola: '', deskripsi: '', alamat: '', no_wa: '', link_maps: '', kategori: 'Alam', harga_tiket: '' });
      setFoto(null);
    } catch (error) {
      alert("Gagal menambah Wisata. Pastikan data lengkap.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Yakin hapus data wisata ini?")) return;
    try {
        await api.delete(`/wisata/${id}`);
        setWisataList(prev => prev.filter(item => item.id !== id));
    } catch (error) { alert("Gagal menghapus"); }
  }

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch (e) { console.warn(e); }
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getImageUrl = (path) => `http://localhost:8000/storage/${path}`;

  const formatWaLink = (number) => {
    if(!number || number === '-') return '#';
    let formatted = number.toString().replace(/\D/g, '');
    if (formatted.startsWith('0')) formatted = '62' + formatted.slice(1);
    return `https://wa.me/${formatted}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- LOGIKA CSS SIDEBAR (SAMA PERSIS DASHBOARD) ---
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
              <NavItem to="/admin-dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" />
              
              <p className="px-4 text-xs font-bold text-neutral/50 uppercase tracking-wider mt-6 mb-2 whitespace-nowrap">Layanan Desa</p>
              <NavItem to="/surat-admin" icon={<FileText size={20}/>} label="Verifikasi Surat" />
              <NavItem to="/pengaduan-admin" icon={<MessageSquare size={20}/>} label="Pengaduan Warga" badgeColor="bg-accent" />
              
              <p className="px-4 text-xs font-bold text-neutral/50 uppercase tracking-wider mt-6 mb-2 whitespace-nowrap">Potensi Desa</p>
              <NavItem to="/umkm-admin" icon={<Store size={20}/>} label="Kelola UMKM" />
              
              {/* Menu Aktif */}
              <NavItem to="/wisata-admin" icon={<Mountain size={20}/>} label="Kelola Wisata" active />
              
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
        
        {/* HEADER UTAMA (Sticky Top) */}
        <header className="h-16 flex-shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm border-b border-neutral/20">
          <div>
            <h1 className="text-xl font-bold text-primary truncate">Kelola Wisata</h1>
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

        {/* ISI HALAMAN (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
            
            {/* Toolbar: Toggle Sidebar & Judul */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className="flex items-center gap-2 bg-white text-primary px-4 py-2.5 rounded-xl shadow-sm border border-neutral/20 hover:bg-neutral/10 hover:shadow-md transition-all active:scale-95 group"
                    >
                        {sidebarOpen ? <PanelLeft size={20} className="text-secondary"/> : <Menu size={20} className="text-accent"/>}
                        <span className="font-bold text-sm hidden sm:inline">{sidebarOpen ? 'Tutup' : 'Menu'}</span>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Destinasi Wisata</h2>
                        <p className="text-secondary text-sm">Kelola informasi objek wisata desa.</p>
                    </div>
                </div>

                <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition transform hover:-translate-y-0.5">
                    <Plus size={20}/> Tambah Wisata
                </button>
            </div>

            {/* Grid Kartu Wisata */}
            {wisataList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wisataList.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-neutral/20 overflow-hidden group hover:shadow-xl transition-all flex flex-col">
                            <div className="h-48 overflow-hidden bg-neutral/10 relative">
                                <img src={getImageUrl(item.foto)} alt={item.nama_wisata} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm text-primary">
                                    {item.kategori}
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-bold backdrop-blur flex items-center gap-1">
                                    <Ticket size={12}/> {item.harga_tiket}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg text-primary mb-1">{item.nama_wisata}</h3>
                                <p className="text-secondary text-sm mb-4 line-clamp-2 flex-1">{item.deskripsi}</p>
                                
                                <div className="space-y-3 text-sm text-secondary mb-6 bg-surface p-3 rounded-xl border border-neutral/10">
                                    <div className="flex items-center gap-2"><MapPin size={16} className="text-red-500"/> <span className="truncate">{item.alamat}</span></div>
                                    {item.pengelola && <div className="flex items-center gap-2"><User size={16} className="text-blue-500"/> {item.pengelola}</div>}
                                </div>

                                {/* Tombol Aksi */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <a href={item.link_maps} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 bg-white border border-neutral/20 text-primary py-2 rounded-lg text-sm font-bold hover:bg-surface transition">
                                        <MapPin size={16}/> Maps
                                    </a>
                                    <a href={formatWaLink(item.no_wa)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 bg-green-100 text-green-700 py-2 rounded-lg text-sm font-bold hover:bg-green-200 transition">
                                        <MessageCircle size={16}/> Info
                                    </a>
                                </div>

                                <button onClick={() => handleDelete(item.id)} className="w-full py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 flex items-center justify-center gap-2 transition text-sm">
                                    <Trash2 size={16}/> Hapus Data
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral/30">
                    <div className="inline-block p-4 bg-surface rounded-full mb-4 text-secondary"><Mountain size={32}/></div>
                    <h3 className="font-bold text-primary text-lg">Belum ada data wisata</h3>
                    <p className="text-secondary">Silakan tambahkan destinasi wisata baru.</p>
                </div>
            )}
        </div>

        {/* MODAL TAMBAH (Style Dashboard) */}
        <AnimatePresence>
        {isModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6 border-b border-neutral/10 pb-4">
                        <h2 className="text-xl font-bold text-primary">Tambah Wisata Baru</h2>
                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface rounded-full text-secondary"><X size={24}/></button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-primary mb-1">Nama Wisata</label>
                            <input type="text" required className="w-full p-3 border border-neutral/20 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none bg-surface" onChange={e => setFormData({...formData, nama_wisata: e.target.value})} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-primary mb-1">Harga Tiket</label>
                                <input type="text" placeholder="Gratis / Rp 5.000" required className="w-full p-3 border border-neutral/20 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none bg-surface" onChange={e => setFormData({...formData, harga_tiket: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-primary mb-1">No. Kontak</label>
                                <input type="number" placeholder="08xxx" className="w-full p-3 border border-neutral/20 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none bg-surface" onChange={e => setFormData({...formData, no_wa: e.target.value})} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-primary mb-1">Lokasi / Alamat</label>
                            <input type="text" required className="w-full p-3 border border-neutral/20 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none bg-surface" onChange={e => setFormData({...formData, alamat: e.target.value})} />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-primary mb-1 flex items-center gap-1"><MapPin size={14} className="text-accent"/> Link Google Maps</label>
                            <input type="url" placeholder="Link dari Google Maps..." required className="w-full p-3 border border-neutral/20 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none bg-surface text-blue-600" onChange={e => setFormData({...formData, link_maps: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-primary mb-1">Kategori</label>
                                <select className="w-full p-3 border border-neutral/20 rounded-xl bg-surface focus:ring-2 focus:ring-primary/50 outline-none" onChange={e => setFormData({...formData, kategori: e.target.value})}>
                                    <option value="Alam">Wisata Alam</option>
                                    <option value="Buatan">Wisata Buatan</option>
                                    <option value="Religi">Wisata Religi</option>
                                    <option value="Edukasi">Wisata Edukasi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-primary mb-1">Pengelola</label>
                                <input type="text" placeholder="BUMDes / Pokdarwis" className="w-full p-3 border border-neutral/20 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none bg-surface" onChange={e => setFormData({...formData, pengelola: e.target.value})} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-primary mb-1">Deskripsi & Fasilitas</label>
                            <textarea required className="w-full p-3 border border-neutral/20 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none bg-surface" rows="3" onChange={e => setFormData({...formData, deskripsi: e.target.value})}></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-primary mb-1">Foto Lokasi</label>
                            <input type="file" required accept="image/*" className="w-full p-2 border border-neutral/20 rounded-xl bg-surface" onChange={e => setFoto(e.target.files[0])} />
                        </div>

                        <button disabled={submitLoading} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 transition shadow-lg mt-6 flex justify-center items-center gap-2">
                            {submitLoading ? 'Menyimpan...' : <><Plus size={20}/> Simpan Data Wisata</>}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- KOMPONEN HELPER (Sama persis AdminDashboard) ---
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