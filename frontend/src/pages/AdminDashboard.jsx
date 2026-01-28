import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { 
  FileText, Newspaper, Users, MessageSquare, ChevronRight, 
  Store, Mountain 
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout'; // 🔥 Menggunakan Layout

export default function AdminDashboard() {
  
  // State Data
  const [stats, setStats] = useState({
    total_surat: 0,
    total_berita: 0,
    total_user: 0,
    total_pengaduan: 0,
    total_umkm: 0, 
    total_wisata: 0,
    surat_terbaru: []
  });
  
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statRes = await api.get('/dashboard-stats');
        setStats(statRes.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 🔥 Bungkus konten dengan AdminLayout
  return (
    <AdminLayout title="Dashboard Overview">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Surat Masuk" count={stats.total_surat} icon={<FileText size={24}/>} color="bg-primary" />
        
        <Link to="/pengaduan-admin" className="block transform transition hover:-translate-y-1">
            <StatCard title="Pengaduan" count={stats.total_pengaduan || 0} icon={<MessageSquare size={24}/>} color="bg-accent" />
        </Link>
        
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
    </AdminLayout>
  );
}

// --- KOMPONEN HELPER ---
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