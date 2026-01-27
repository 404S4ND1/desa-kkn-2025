import { useState } from 'react';
import api from '../api';
import { Search, Clock, CheckCircle, FileText, AlertCircle, ArrowLeft, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function CekSurat() {
  const [nik, setNik] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState(null); // null = belum cari, [] = kosong
  const [errorMsg, setErrorMsg] = useState('');

  const handleCek = async (e) => {
    e.preventDefault();
    if (nik.length < 16) {
      setErrorMsg("NIK harus 16 digit angka.");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setHasil(null);

    try {
      const response = await api.post('/cek-surat', { nik });
      setHasil(response.data.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHasil([]); // Data kosong (bukan error server)
      } else {
        setErrorMsg("Terjadi kesalahan sistem. Pastikan server menyala.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Komponen Label Status
  const StatusBadge = ({ status }) => {
    if (status === 'Selesai') {
      return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={14}/> Selesai</span>;
    } else if (status === 'Ditolak') {
      return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold"><XCircle size={14}/> Ditolak</span>;
    } else {
      return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold"><Clock size={14}/> Menunggu</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-xl mx-auto">
        
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Kembali ke Beranda
        </Link>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Search size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Lacak Status Surat</h1>
          <p className="text-slate-500 mb-6">Masukkan NIK Pemohon untuk melihat progres surat Anda.</p>

          <form onSubmit={handleCek} className="relative">
            <input 
              type="number" 
              placeholder="Masukan NIK (16 Digit)..." 
              className="w-full pl-5 pr-14 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none text-lg font-bold text-slate-700 transition-all placeholder:font-normal"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg font-bold transition-all disabled:opacity-70"
            >
              {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div> : <Search size={20}/>}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center justify-center gap-2 animate-pulse">
              <AlertCircle size={16}/> {errorMsg}
            </div>
          )}
        </div>

        {/* Hasil Pencarian */}
        <div className="space-y-4">
          <AnimatePresence>
            {hasil && hasil.length > 0 ? (
              hasil.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex justify-between items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600 hidden sm:block">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{item.jenis_surat}</h3>
                      <p className="text-slate-500 text-sm mb-1">Diajukan: {new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                      <p className="text-xs text-slate-400">a.n. {item.nama_pemohon}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={item.status} />
                  </div>
                </motion.div>
              ))
            ) : hasil && hasil.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 bg-white rounded-3xl border border-slate-100">
                <div className="inline-block p-4 bg-slate-50 rounded-full mb-3 text-slate-400"><FileText size={30}/></div>
                <h3 className="font-bold text-slate-700">Tidak Ada Data</h3>
                <p className="text-slate-500 text-sm">Belum ada surat yang diajukan dengan NIK tersebut.</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}