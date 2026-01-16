import { useEffect, useState } from 'react';
import api from '../api';
import { CheckCircle, XCircle, Clock, Search, RefreshCw, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [surats, setSurats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  // 1. Ambil Data Surat dari Backend
  const fetchSurat = async () => {
    setLoading(true);
    try {
      const response = await api.get('/surat'); // Nembak ke route index
      setSurats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurat();
  }, []);

  // 2. Fungsi Update Status (Terima / Tolak)
  const updateStatus = async (id, statusBaru) => {
    if(!confirm(`Yakin ingin mengubah status jadi ${statusBaru}?`)) return;

    try {
      await api.put(`/surat/${id}`, { status: statusBaru });
      fetchSurat(); // Refresh data setelah update
      alert(`Status berhasil diubah jadi ${statusBaru}`);
    } catch (error) {
      console.error("Gagal update:", error);
      alert("Gagal update status.");
    }
  };

  // Filter pencarian sederhana
  const filteredSurat = surats.filter(item => 
    item.nama_pemohon.toLowerCase().includes(filter.toLowerCase()) ||
    item.nik.includes(filter)
  );

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Admin Desa</h1>
            <p className="text-slate-600">Kelola permohonan surat warga</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Cari Nama / NIK..." 
                className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary w-full"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <button onClick={fetchSurat} className="bg-white p-2 rounded-lg border hover:bg-slate-50 text-slate-600">
              <RefreshCw size={24} />
            </button>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-xs font-bold tracking-wider border-b">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Pemohon</th>
                  <th className="p-4">Jenis Surat</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">Sedang memuat data...</td></tr>
                ) : filteredSurat.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">Belum ada data surat masuk.</td></tr>
                ) : (
                  filteredSurat.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                        <div className="text-xs text-slate-400">
                          {new Date(item.created_at).toLocaleTimeString('id-ID')}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{item.nama_pemohon}</div>
                        <div className="text-xs text-slate-500">NIK: {item.nik}</div>
                        <div className="text-xs text-blue-600 font-medium">WA: {item.no_hp}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-slate-700">{item.jenis_surat}</span>
                        {item.keterangan && (
                          <div className="text-xs text-slate-500 mt-1 italic">"{item.keterangan}"</div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                          item.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          {/* Tombol Terima */}
                          <button 
                            onClick={() => updateStatus(item.id, 'Selesai')}
                            disabled={item.status === 'Selesai'}
                            title="Tandai Selesai"
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 disabled:opacity-50 transition-colors"
                          >
                            <CheckCircle size={18} />
                          </button>
                          
                          {/* Tombol Tolak */}
                          <button 
                            onClick={() => updateStatus(item.id, 'Ditolak')}
                            disabled={item.status === 'Ditolak' || item.status === 'Selesai'}
                            title="Tolak Permohonan"
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}