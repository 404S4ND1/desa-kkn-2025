import { useState, useEffect } from 'react';
import api from '../api'; 
import { FileText, Printer, CheckCircle, Clock } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

export default function SuratAdmin() {
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil Data Surat
  const fetchSurat = async () => {
    try {
      setLoading(true);
      const response = await api.get('/surat'); 
      setSuratList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurat();
  }, []);

  // Update Status
  const handleStatus = async (id) => {
    if (!confirm("Tandai surat ini sebagai Selesai?")) return;
    try {
      await api.put(`/surat/${id}`, { status: 'Selesai' });
      fetchSurat();
    } catch (error) {
      alert("Gagal update status");
    }
  };

  return (
    <AdminLayout title="Verifikasi Surat">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          Daftar Permohonan Warga
        </h2>
        <button onClick={fetchSurat} className="px-4 py-2 text-sm text-primary border border-primary/20 rounded-xl bg-white hover:bg-neutral/30 transition font-medium">
          Refresh Data
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral/20 text-primary/80 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Pemohon</th>
              <th className="p-4">Jenis Surat</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral/10">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-secondary">Memuat data...</td></tr>
            ) : suratList.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-secondary/70">Belum ada surat masuk.</td></tr>
            ) : (
              suratList.map((surat) => (
                <tr key={surat.id} className="hover:bg-surface transition-colors">
                  <td className="p-4 text-sm text-secondary">
                    {new Date(surat.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-primary">{surat.nama_pemohon}</div>
                    <div className="text-xs text-secondary">NIK: {surat.nik || surat.nik_pemohon}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-neutral text-primary text-xs px-2 py-1 rounded-full font-bold border border-primary/10">
                      {surat.jenis_surat}
                    </span>
                  </td>
                  <td className="p-4">
                    {surat.status === 'Selesai' ? (
                      <span className="flex items-center gap-1 text-primary text-sm font-bold">
                        <CheckCircle size={16} className="text-secondary" /> Selesai
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-accent text-sm font-bold">
                        <Clock size={16} /> Menunggu
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <a 
                        href={`http://127.0.0.1:8000/api/surat/${surat.id}/cetak`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-accent hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition shadow-sm"
                        title="Cetak PDF"
                      >
                        <Printer size={16} /> Print
                      </a>

                      {surat.status !== 'Selesai' && (
                        <button 
                          onClick={() => handleStatus(surat.id)}
                          className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition shadow-sm"
                        >
                          <CheckCircle size={16} /> Acc
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}