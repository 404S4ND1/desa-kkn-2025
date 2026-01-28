<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Berita;
use App\Http\Controllers\SuratController; 
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\BeritaController;
// 🔥 PENTING: Import Controller Baru
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\WisataController;

// --- PUBLIC ROUTES (Bebas Akses) ---

// Login & Berita
Route::post('/login', [AuthController::class, 'login']);
Route::get('/berita', function () { return response()->json(Berita::latest()->get()); });
Route::get('/berita/{id}', function ($id) { return response()->json(Berita::find($id)); });

// Kirim Surat (Warga)
Route::post('/surat', [SuratController::class, 'store']);

// Cek Status Surat
Route::post('/cek-surat', [SuratController::class, 'cekStatus']);

// Cetak Word
Route::get('/surat/{id}/cetak', [SuratController::class, 'cetakWord']);

// Pengaduan Warga
Route::post('/pengaduan', [App\Http\Controllers\PengaduanController::class, 'store']);

// 🔥 PUBLIC ROUTES UNTUK UMKM & WISATA (Agar bisa dilihat warga)
Route::get('/umkm', [UmkmController::class, 'index']);
Route::get('/wisata', [WisataController::class, 'index']);


// --- PROTECTED ROUTES (Harus Login Admin) ---
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::get('/dashboard-stats', [DashboardController::class, 'index']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Manajemen Surat
    Route::get('/surat', [SuratController::class, 'index']); 
    Route::put('/surat/{id}', [SuratController::class, 'update']);

    // Manajemen Berita
    Route::post('/berita', [BeritaController::class, 'store']);
    Route::put('/berita/{id}', [BeritaController::class, 'update']);
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy']);

    // Manajemen Pengaduan (Admin)
    Route::get('/pengaduan', [App\Http\Controllers\PengaduanController::class, 'index']);
    Route::put('/pengaduan/{id}', [App\Http\Controllers\PengaduanController::class, 'update']);
    Route::delete('/pengaduan/{id}', [App\Http\Controllers\PengaduanController::class, 'destroy']);

    // 🔥 MANAJEMEN UMKM (Admin)
    Route::post('/umkm', [UmkmController::class, 'store']);
    Route::delete('/umkm/{id}', [UmkmController::class, 'destroy']);

    // 🔥 MANAJEMEN WISATA (Admin)
    Route::post('/wisata', [WisataController::class, 'store']);
    Route::delete('/wisata/{id}', [WisataController::class, 'destroy']);
});