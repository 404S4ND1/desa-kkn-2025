<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Berita;
use App\Http\Controllers\SuratController; 
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\BeritaController;

// --- PUBLIC ROUTES (Bebas Akses) ---

// Login & Berita
Route::post('/login', [AuthController::class, 'login']);
Route::get('/berita', function () { return response()->json(Berita::latest()->get()); });
Route::get('/berita/{id}', function ($id) { return response()->json(Berita::find($id)); });

// Kirim Surat (Warga)
Route::post('/surat', [SuratController::class, 'store']);

// 🔥 CEK STATUS SURAT (BARU)
Route::post('/cek-surat', [SuratController::class, 'cekStatus']);

// Cetak Word
Route::get('/surat/{id}/cetak', [SuratController::class, 'cetakWord']);

// Pengaduan Warga
Route::post('/pengaduan', [App\Http\Controllers\PengaduanController::class, 'store']);


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
});