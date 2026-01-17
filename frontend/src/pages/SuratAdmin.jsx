import { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar'; // Opsional, jika ingin navbar tetap ada

export default function SuratAdmin() {
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil Data Surat
  const fetchSurat = async () => {
    try {
      const response = await api.get('/surat');
      setSuratList(response.data);
    } catch (error) {
      console.error("Gagal ambil surat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurat();
  }, []);

  // Fungsi Ubah Status
  const handleStatusChange = async (id, newStatus) => {
    if(!confirm(`Ubah status menjadi ${newStatus}?`)) return;

    try {
      await api.put(`/surat/${id}`, { status: newStatus });
      fetchSurat(); // Refresh data setelah update
      alert('Status berhasil diperbarui!');
    } catch (error) {
      console.error("Gagal update status:", error);
      alert('Gagal update status.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">📩 Kelola Pengajuan Surat</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600">Tanggal</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Pemohon</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Jenis Surat</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Keterangan</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center">Memuat data...</td></tr>
              ) : suratList.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center">Belum ada surat masuk.</td></tr>
              ) : (
                suratList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      {item.nama_pemohon}<br/>
                      <span className="text-xs text-slate-400">NIK: {item.nik}</span>
                    </td>
                    <td className="p-4 text-slate-600">{item.jenis_surat}</td>
                    <td className="p-4 text-slate-500 text-sm italic">{item.keterangan || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold capitalize
                        ${item.status === 'selesai' ? 'bg-green-100 text-green-700' : 
                          item.status === 'ditolak' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 space-x-2">
                      {/* Tombol Aksi */}
                      {item.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(item.id, 'selesai')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition"
                          >
                            Setujui
                          </button>
                          <button 
                            onClick={() => handleStatusChange(item.id, 'ditolak')}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      {item.status !== 'pending' && (
                         <button 
                         onClick={() => handleStatusChange(item.id, 'pending')}
                         className="text-slate-400 text-xs underline hover:text-slate-600"
                       >
                         Reset
                       </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}