<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Berita;
use App\Http\Controllers\SuratController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. API BERITA (GET) - Untuk ditampilkan di halaman depan warga
Route::get('/berita', function () {
    $data = Berita::latest()->get();
    return response()->json($data);
});

// 2. API DETAIL BERITA (GET) - Kalau diklik satu berita
Route::get('/berita/{id}', function ($id) {
    $data = Berita::find($id);
    if ($data) {
        return response()->json($data);
    } else {
        return response()->json(['message' => 'Berita tidak ditemukan'], 404);
    }
});

// 3. API AJUKAN SURAT (POST) - Untuk warga kirim form surat
Route::post('/surat', [SuratController::class, 'store']);
// --- TAMBAHKAN INI ---
Route::get('/surat', [SuratController::class, 'index']);      // Buat Admin lihat daftar
Route::put('/surat/{id}', [SuratController::class, 'update']); // Buat Admin ganti status

// 4. API TEST (Cek koneksi)
Route::get('/test', function() {
    return response()->json(['status' => 'Backend Aman Jaya!']);
});