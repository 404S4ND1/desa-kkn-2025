<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UmkmController extends Controller
{
    public function index()
    {
        return response()->json(Umkm::latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_umkm' => 'required',
            'pemilik' => 'required',
            'deskripsi' => 'required',
            'no_wa' => 'required|numeric', // 🔥 Validasi Angka
            'link_maps' => 'required',     // 🔥 Validasi Link
            'foto' => 'required|image|max:5120'
        ]);

        $path = $request->file('foto')->store('umkm', 'public');

        Umkm::create([
            'nama_umkm' => $request->nama_umkm,
            'pemilik' => $request->pemilik,
            'deskripsi' => $request->deskripsi,
            'alamat' => $request->alamat ?? '-',
            'link_maps' => $request->link_maps, // 🔥 Simpan Maps
            'no_wa' => $request->no_wa,         // 🔥 Simpan WA
            'kategori' => $request->kategori ?? 'Umum',
            'foto' => $path
        ]);

        return response()->json(['message' => 'UMKM Berhasil Ditambahkan']);
    }

    public function destroy($id)
    {
        $umkm = Umkm::find($id);
        if ($umkm) {
            if ($umkm->foto) Storage::disk('public')->delete($umkm->foto);
            $umkm->delete();
        }
        return response()->json(['message' => 'UMKM Dihapus']);
    }
}