import { useState } from 'react';
import api from '../api';
import { Send, AlertTriangle, Camera, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pengaduan() {
  const [formData, setFormData] = useState({
    nama_pelapor: '', nik: '', no_hp: '', judul_laporan: '', isi_laporan: ''
  });
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (foto) data.append('foto_bukti', foto);

    try {
      await api.post('/pengaduan', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim laporan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 px-4 flex justify-center items-start bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <CheckCircle size={50} className="text-green-500 mx-auto mb-4"/>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Laporan Diterima!</h2>
          <p className="text-slate-600 mb-6">Terima kasih sudah peduli dengan desa kita. Laporan Anda akan segera kami tindak lanjuti.</p>
          <Link to="/" className="text-blue-600 font-bold hover:underline">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 font-medium"><ArrowLeft size={20} className="mr-2"/> Kembali</Link>
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-red-600 p-8 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-3"><AlertTriangle size={32}/> Layanan Pengaduan</h1>
            <p className="opacity-90 mt-2">Sampaikan aspirasi, keluhan, atau saran Anda untuk kemajuan desa.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div><label className="block font-bold text-slate-700 mb-2">Nama Pelapor</label><input type="text" required className="w-full p-3 rounded-xl border border-slate-300 focus:border-red-500 outline-none" onChange={e => setFormData({...formData, nama_pelapor: e.target.value})} /></div>
                <div><label className="block font-bold text-slate-700 mb-2">No. HP / WA</label><input type="text" required className="w-full p-3 rounded-xl border border-slate-300 focus:border-red-500 outline-none" onChange={e => setFormData({...formData, no_hp: e.target.value})} /></div>
            </div>
            
            <div><label className="block font-bold text-slate-700 mb-2">Judul Laporan</label><input type="text" placeholder="Contoh: Lampu jalan mati di Dusun 2" required className="w-full p-3 rounded-xl border border-slate-300 focus:border-red-500 outline-none" onChange={e => setFormData({...formData, judul_laporan: e.target.value})} /></div>
            
            <div><label className="block font-bold text-slate-700 mb-2">Detail Kejadian</label><textarea rows="4" required className="w-full p-3 rounded-xl border border-slate-300 focus:border-red-500 outline-none" placeholder="Jelaskan lokasi dan kronologi secara rinci..." onChange={e => setFormData({...formData, isi_laporan: e.target.value})}></textarea></div>

            <div>
                <label className="block font-bold text-slate-700 mb-2">Foto Bukti (Opsional)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
                    <input type="file" accept="image/*" onChange={e => setFoto(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="flex flex-col items-center text-slate-500">
                        <Camera size={32} className="mb-2 text-slate-400" />
                        <span className="font-medium">{foto ? foto.name : "Klik untuk upload foto kejadian"}</span>
                    </div>
                </div>
            </div>

            <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/20 flex justify-center items-center gap-2 transition-all">
                {loading ? 'Mengirim...' : <><Send size={20}/> Kirim Laporan</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}