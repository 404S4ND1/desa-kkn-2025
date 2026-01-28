<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wisata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WisataController extends Controller
{
    public function index()
    {
        return response()->json(Wisata::latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_wisata' => 'required',
            'deskripsi' => 'required',
            'alamat' => 'required',
            'link_maps' => 'required',
            'foto' => 'required|image|max:5120'
        ]);

        $path = $request->file('foto')->store('wisata', 'public');

        Wisata::create([
            'nama_wisata' => $request->nama_wisata,
            'pengelola' => $request->pengelola ?? '-',
            'deskripsi' => $request->deskripsi,
            'alamat' => $request->alamat,
            'link_maps' => $request->link_maps,
            'no_wa' => $request->no_wa ?? '-',
            'kategori' => $request->kategori ?? 'Alam',
            'harga_tiket' => $request->harga_tiket ?? 'Gratis',
            'foto' => $path
        ]);

        return response()->json(['message' => 'Wisata Berhasil Ditambahkan']);
    }

    public function destroy($id)
    {
        $wisata = Wisata::find($id);
        if ($wisata) {
            if ($wisata->foto) Storage::disk('public')->delete($wisata->foto);
            $wisata->delete();
        }
        return response()->json(['message' => 'Wisata Dihapus']);
    }
}