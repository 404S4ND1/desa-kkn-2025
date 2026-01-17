<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Surat;

class SuratController extends Controller
{
    // Ambil semua surat (Admin)
    public function index()
    {
        // Urutkan dari yang terbaru
        $data = Surat::latest()->get();
        return response()->json($data);
    }

    // Simpan surat baru (Warga)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pemohon' => 'required|string|max:255',
            'nik' => 'required|string|max:20',
            'jenis_surat' => 'required|string',
            'keterangan' => 'nullable|string',
        ]);

        // Default status = pending
        $validated['status'] = 'pending'; 

        $surat = Surat::create($validated);

        return response()->json([
            'message' => 'Surat berhasil diajukan',
            'data' => $surat
        ], 201);
    }

    // Update Status Surat (Admin)
    public function update(Request $request, $id)
    {
        $surat = Surat::find($id);

        if (!$surat) {
            return response()->json(['message' => 'Surat tidak ditemukan'], 404);
        }

        // Validasi input status
        $request->validate([
            'status' => 'required|in:pending,proses,selesai,ditolak'
        ]);

        $surat->status = $request->status;
        $surat->save();

        return response()->json([
            'message' => 'Status surat berhasil diperbarui',
            'data' => $surat
        ]);
    }
}