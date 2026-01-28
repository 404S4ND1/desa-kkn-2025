import { useState, useEffect } from 'react';
import api from '../api';
import { 
  Trash2, CheckCircle, AlertCircle, Clock, 
  Search, Filter, X, Image as ImageIcon, MapPin 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../components/AdminLayout'; // Pastikan path ini benar

export default function PengaduanAdmin() {
  const [laporan, setLaporan] = useState([]);
  const [filteredLaporan, setFilteredLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter & Search
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Modal Detail
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch Data
  const fetchData = async () => {
    try {
      const res = await api.get('/pengaduan');
      setLaporan(res.data);
      setFilteredLaporan(res.data);
    } catch (error) {
      console.error("Gagal ambil data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Logika Filter & Search
  useEffect(() => {
    let result = laporan;
    if (filterStatus !== 'Semua') {
      result = result.filter(item => item.status === filterStatus);
    }
    if (searchTerm) {
      result = result.filter(item => 
        item.nama_pelapor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.judul_laporan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredLaporan(result);
  }, [laporan, filterStatus, searchTerm]);

  // Update Status
  const handleStatus = async (id, newStatus) => {
    try {
      await api.put(`/pengaduan/${id}`, { status: newStatus });
      const updated = laporan.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      );
      setLaporan(updated);
      if (selectedItem) setSelectedItem({ ...selectedItem, status: newStatus });
    } catch (error) {
      alert("Gagal update status");
    }
  };

  // Hapus Laporan
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus laporan ini permanen?")) return;
    try {
      await api.delete(`/pengaduan/${id}`);
      setLaporan(prev => prev.filter(item => item.id !== id));
      setSelectedItem(null);
    } catch (error) {
      alert("Gagal menghapus");
    }
  };

  const getImageUrl = (path) => `http://localhost:8000/storage/${path}`;

  return (
    <AdminLayout title="Pusat Pengaduan">
        {/* HEADER CUSTOM HALAMAN INI */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <p className="text-slate-500 text-sm">Pantau dan tindak lanjuti aspirasi warga desa.</p>
            </div>
            
            {/* SEARCH BAR */}
            <div className="relative w-full md:w-72">
                <input 
                    type="text" 
                    placeholder="Cari nama atau judul..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
        </div>

        {/* TAB FILTER */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-fit">
            {['Semua', 'Menunggu', 'Diproses', 'Selesai'].map((status) => (
                <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                        filterStatus === status 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>

        {/* LIST KARTU (MASONRY GRID) */}
        {loading ? (
             <div className="text-center py-20 text-slate-400 animate-pulse">Memuat data pengaduan...</div>
        ) : filteredLaporan.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                {filteredLaporan.map((item) => (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group"
                    >
                        <div className="relative h-40 overflow-hidden bg-slate-100">
                            {item.foto_bukti ? (
                                <img src={getImageUrl(item.foto_bukti)} alt="Bukti" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <ImageIcon size={40} className="mb-2 opacity-50"/>
                                    <span className="text-xs font-semibold">Tidak ada foto</span>
                                </div>
                            )}
                            <div className="absolute top-3 right-3">
                                <StatusBadge status={item.status} />
                            </div>

                            {/* 🔥 TAMBAHAN: Overlay Lokasi di Thumbnail */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                                <p className="text-white text-xs flex items-center gap-1 font-medium">
                                    <MapPin size={12} className="text-red-400"/> {item.lokasi || 'Lokasi tidak ada'}
                                </p>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                {item.judul_laporan}
                            </h3>
                            <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                                <Clock size={12}/> {new Date(item.created_at).toLocaleDateString('id-ID')}
                            </p>
                            <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                                {item.isi_laporan}
                            </p>
                            
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                    {item.nama_pelapor.charAt(0)}
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-slate-700">{item.nama_pelapor}</p>
                                    <p className="text-slate-400">{item.no_hp}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>
            </motion.div>
        ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="inline-block p-4 bg-slate-50 rounded-full mb-4 text-slate-400"><Filter size={32}/></div>
                <h3 className="font-bold text-slate-700 text-lg">Tidak ada laporan</h3>
                <p className="text-slate-500">Coba ubah filter status atau kata kunci pencarian.</p>
            </div>
        )}

        {/* MODAL DETAIL POPUP */}
        <AnimatePresence>
        {selectedItem && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedItem(null)}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Modal */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{selectedItem.judul_laporan}</h2>
                            <p className="text-slate-500 text-sm mt-1">Dilaporkan oleh <span className="font-bold text-slate-700">{selectedItem.nama_pelapor}</span> • {selectedItem.no_hp}</p>
                        </div>
                        <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={24}/></button>
                    </div>

                    {/* Content Scrollable */}
                    <div className="p-6 overflow-y-auto">
                        {/* Foto Bukti */}
                        {selectedItem.foto_bukti && (
                            <div className="mb-6 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                <img src={getImageUrl(selectedItem.foto_bukti)} alt="Bukti" className="w-full h-auto max-h-80 object-contain mx-auto" />
                            </div>
                        )}
                        
                        {/* 🔥 TAMBAHAN: Detail Lokasi di Modal */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex items-start gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                                <MapPin size={24}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-800 text-sm uppercase tracking-wide mb-1">Lokasi Kejadian</h4>
                                <p className="text-blue-700 font-medium text-lg">{selectedItem.lokasi || '-'}</p>
                            </div>
                        </div>

                        {/* Isi Laporan */}
                        <div className="prose prose-slate max-w-none">
                            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-2">Detail Kejadian</h4>
                            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedItem.isi_laporan}</p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <StatusBadge status={selectedItem.status} />
                            <span className="text-xs text-slate-400">ID: #{selectedItem.id}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {/* Tombol Aksi */}
                            {selectedItem.status === 'Menunggu' && (
                                <button onClick={() => handleStatus(selectedItem.id, 'Diproses')} className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                    <Clock size={16}/> Proses
                                </button>
                            )}
                            {selectedItem.status !== 'Selesai' && (
                                <button onClick={() => handleStatus(selectedItem.id, 'Selesai')} className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
                                    <CheckCircle size={16}/> Selesai
                                </button>
                            )}
                            <button onClick={() => handleDelete(selectedItem.id)} className="flex-1 sm:flex-none bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-lg font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition flex items-center justify-center gap-2">
                                <Trash2 size={16}/> Hapus
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    </AdminLayout>
  );
}

// Komponen Kecil: Badge Status
function StatusBadge({ status }) {
    const styles = {
        'Menunggu': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Diproses': 'bg-blue-100 text-blue-700 border-blue-200',
        'Selesai': 'bg-green-100 text-green-700 border-green-200'
    };
    
    const icons = {
        'Menunggu': <AlertCircle size={12}/>,
        'Diproses': <Clock size={12}/>,
        'Selesai': <CheckCircle size={12}/>
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-sm ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
            {icons[status]} {status}
        </span>
    );
}