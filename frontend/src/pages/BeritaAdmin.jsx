import { useState, useEffect } from 'react';
import api from '../api';
import AdminLayout from '../components/AdminLayout';

export default function BeritaAdmin() {
  const [beritaList, setBeritaList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // State Form
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [fileGambar, setFileGambar] = useState(null);

  // Ambil data berita
  const fetchBerita = async () => {
    try {
      const res = await api.get('/berita');
      setBeritaList(res.data);
    } catch (error) {
      console.error("Gagal load berita", error);
    }
  };

  useEffect(() => { fetchBerita(); }, []);

  // Submit Form (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('isi', isi);
    if (fileGambar) {
      formData.append('gambar', fileGambar);
    }

    const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
    };

    try {
      if (isEditing) {
        formData.append('_method', 'PUT'); 
        await api.post(`/berita/${currentId}`, formData, config);
        alert("Berita diperbarui!");
      } else {
        await api.post('/berita', formData, config);
        alert("Berita ditambahkan!");
      }
      resetForm();
      fetchBerita();
    } catch (error) {
      console.error("Gagal simpan", error);
      alert("Gagal menyimpan berita. Periksa koneksi atau ukuran gambar.");
    }
  };

  const resetForm = () => {
      setJudul('');
      setIsi('');
      setFileGambar(null);
      setIsEditing(false);
      setCurrentId(null);
      const fileInput = document.getElementById('fileInput');
      if(fileInput) fileInput.value = ""; 
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setJudul(item.judul);
    setIsi(item.isi);
    setFileGambar(null);
    window.scrollTo(0,0);
  };

  const handleDelete = async (id) => {
    if(!confirm("Yakin hapus berita ini?")) return;
    try {
      await api.delete(`/berita/${id}`);
      fetchBerita();
    } catch (error) {
      console.error("Gagal hapus", error);
    }
  };

  return (
    <AdminLayout title="Kelola Berita">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* --- FORM SECTION --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral/20">
          <h2 className="text-xl font-bold mb-4 text-primary">
            {isEditing ? '✏️ Edit Berita' : '📝 Tambah Berita Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-primary mb-1">Judul Berita</label>
              <input 
                type="text" required
                className="w-full border border-neutral/20 p-3 rounded-xl focus:ring-2 focus:ring-accent outline-none bg-surface"
                value={judul} onChange={(e) => setJudul(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-primary mb-1">Upload Gambar (Opsional)</label>
              <input 
                id="fileInput"
                type="file" 
                accept="image/*"
                className="w-full border border-neutral/20 p-2 rounded-xl bg-surface file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                onChange={(e) => setFileGambar(e.target.files[0])}
              />
              <p className="text-xs text-secondary mt-1">Format: JPG, PNG, GIF. Max: 5MB.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-1">Isi Berita</label>
              <textarea 
                rows="6" required
                className="w-full border border-neutral/20 p-3 rounded-xl focus:ring-2 focus:ring-accent outline-none bg-surface"
                value={isi} onChange={(e) => setIsi(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-2">
              <button className="bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 transition font-bold shadow-sm shadow-primary/30">
                {isEditing ? 'Simpan Perubahan' : 'Terbitkan Berita'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="bg-neutral text-primary px-5 py-2.5 rounded-xl hover:bg-neutral/80 font-bold transition">
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- LIST SECTION --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral/20">
          <h2 className="text-xl font-bold mb-4 text-primary">Daftar Berita</h2>
          <div className="space-y-4">
            {beritaList.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4 items-start last:border-0 border-neutral/20">
                {/* Thumbnail */}
                <div className="w-24 h-16 flex-shrink-0 bg-neutral/20 rounded-xl overflow-hidden border border-neutral/20">
                    <img 
                        src={item.gambar_url} 
                        alt="thumb" 
                        className="w-full h-full object-cover"
                        onError={(e) => {e.target.src="https://via.placeholder.com/150?text=No+Img"}}
                    />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-primary line-clamp-1">{item.judul}</h3>
                  <p className="text-secondary text-xs mt-1">
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                  <p className="text-primary/70 text-sm line-clamp-1 mt-1">{item.isi}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="text-accent hover:text-orange-700 font-bold text-sm transition">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-bold text-sm transition">Hapus</button>
                </div>
              </div>
            ))}
            {beritaList.length === 0 && (
                <p className="text-center text-secondary py-4">Belum ada berita.</p>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}