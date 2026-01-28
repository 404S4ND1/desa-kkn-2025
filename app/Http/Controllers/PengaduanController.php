<?php

namespace App\Http\Controllers;

use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PengaduanController extends Controller
{
    // Warga Kirim Laporan
    public function store(Request $request)
    {
        $request->validate([
            'nama_pelapor' => 'required',
            'no_hp' => 'required',
            'judul_laporan' => 'required',
            'lokasi' => 'required', // 🔥 Lokasi Wajib
            'isi_laporan' => 'required',
            'foto_bukti' => 'required|image|max:5120' // 🔥 Foto Wajib (required)
        ]);

        // Karena foto wajib, kita langsung simpan tanpa 'if'
        $path = $request->file('foto_bukti')->store('pengaduan', 'public');

        Pengaduan::create([
            'nama_pelapor' => $request->nama_pelapor,
            'nik' => $request->nik,
            'no_hp' => $request->no_hp,
            'judul_laporan' => $request->judul_laporan,
            'lokasi' => $request->lokasi, // 🔥 Simpan Lokasi
            'isi_laporan' => $request->isi_laporan,
            'foto_bukti' => $path,
            'status' => 'Menunggu'
        ]);

        return response()->json(['message' => 'Laporan berhasil dikirim!']);
    }

    // Admin: Lihat Semua Laporan
    public function index()
    {
        return response()->json(Pengaduan::latest()->get());
    }

    // Admin: Update Status / Balas
    public function update(Request $request, $id)
    {
        $pengaduan = Pengaduan::find($id);
        if (!$pengaduan) return response()->json(['message' => 'Not Found'], 404);

        $pengaduan->update([
            'status' => $request->status,
            'tanggapan_desa' => $request->tanggapan_desa
        ]);

        return response()->json(['message' => 'Status diperbarui', 'data' => $pengaduan]);
    }

    // Admin: Hapus Laporan
    public function destroy($id)
    {
        $pengaduan = Pengaduan::find($id);
        if ($pengaduan) {
            if ($pengaduan->foto_bukti) {
                Storage::disk('public')->delete($pengaduan->foto_bukti);
            }
            $pengaduan->delete();
        }
        return response()->json(['message' => 'Laporan dihapus']);
    }
}