import { useState, useEffect } from 'react';
import api from '../api';
import { 
  Plus, Trash2, MapPin, MessageCircle, Ticket, User, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../components/AdminLayout'; // 🔥 Import Layout

export default function WisataAdmin() {
  const [wisataList, setWisataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    nama_wisata: '', pengelola: '', deskripsi: '', alamat: '', no_wa: '', link_maps: '', kategori: 'Alam', harga_tiket: ''
  });
  const [foto, setFoto] = useState(null);

  // Fetch Data
  const fetchData = async () => {
    try {
      const res = await api.get('/wisata');
      setWisataList(res.data);
    } catch (error) {
      console.error("Gagal load data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Handlers
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
      alert("Gagal menambah Wisata.");
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

  const getImageUrl = (path) => `http://localhost:8000/storage/${path}`;

  const formatWaLink = (number) => {
    if(!number || number === '-') return '#';
    let formatted = number.toString().replace(/\D/g, '');
    if (formatted.startsWith('0')) formatted = '62' + formatted.slice(1);
    return `https://wa.me/${formatted}`;
  };

  return (
    <AdminLayout title="Kelola Wisata">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h2 className="text-2xl font-bold text-primary">Destinasi Wisata</h2>
                <p className="text-secondary text-sm">Kelola informasi objek wisata desa.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition transform hover:-translate-y-0.5">
                <Plus size={20}/> Tambah Wisata
            </button>
        </div>

        {/* Grid Content */}
        {loading ? <div className="text-center py-20 animate-pulse text-secondary">Memuat data...</div> : (
            wisataList.length > 0 ? (
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
                    <h3 className="font-bold text-primary text-lg">Belum ada data wisata</h3>
                    <p className="text-secondary">Silakan tambahkan destinasi wisata baru.</p>
                </div>
            )
        )}

        {/* MODAL TAMBAH */}
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
    </AdminLayout>
  );
}