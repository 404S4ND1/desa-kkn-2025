<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Surat; // <--- Jangan lupa panggil Model Surat

class SuratController extends Controller
{
    // -------------------------------------------------------------------------
    // FITUR UNTUK ADMIN
    // -------------------------------------------------------------------------

    // 1. Fungsi MELIHAT semua daftar surat (Dipakai di Dashboard Admin)
    public function index()
    {
        // Kita ambil data dari yang paling baru (latest)
        $surat = Surat::latest()->get();
        return response()->json($surat);
    }

    // 2. Fungsi UPDATE Status Surat (Dipakai saat Admin klik tombol "Selesai")
    public function update(Request $request, $id)
    {
        $surat = Surat::find($id);
        
        if (!$surat) {
            return response()->json(['message' => 'Surat tidak ditemukan'], 404);
        }

        // Update status sesuai kiriman admin (misal: "Selesai" atau "Ditolak")
        $surat->update([
            'status' => $request->status 
        ]);

        return response()->json([
            'message' => 'Status berhasil diperbarui!', 
            'data' => $surat
        ]);
    }

    // -------------------------------------------------------------------------
    // FITUR UNTUK WARGA (FRONTEND)
    // -------------------------------------------------------------------------

    // 3. Fungsi MENERIMA kiriman data dari Warga
    public function store(Request $request)
    {
        // Validasi
        $request->validate([
            'nama_pemohon' => 'required',
            'nik' => 'required|numeric',
            'no_hp' => 'required',
            'jenis_surat' => 'required',
        ]);

        // Simpan
        $surat = Surat::create([
            'nama_pemohon' => $request->nama_pemohon,
            'nik' => $request->nik,
            'no_hp' => $request->no_hp,
            'jenis_surat' => $request->jenis_surat,
            'keterangan' => $request->keterangan,
            'status' => 'Menunggu' // Default selalu Menunggu
        ]);

        return response()->json([
            'message' => 'Surat berhasil diajukan!',
            'data' => $surat
        ], 201);
    }
}