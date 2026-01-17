<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Berita;
use App\Http\Controllers\SuratController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\BeritaController;

// --- PUBLIC ROUTES (Bisa diakses tanpa login) ---

// Login Admin
Route::post('/login', [AuthController::class, 'login']);

// Ambil List Berita (Untuk Halaman Depan)
Route::get('/berita', function () {
    return response()->json(Berita::latest()->get());
});

// Ambil Detail Berita
Route::get('/berita/{id}', function ($id) {
    $data = Berita::find($id);
    return $data ? response()->json($data) : response()->json(['message' => '404'], 404);
});

// Kirim Surat (Warga)
Route::post('/surat', [SuratController::class, 'store']);


// --- PROTECTED ROUTES (Hanya Admin yang Login) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Info User yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Statistik Dashboard
    Route::get('/dashboard-stats', [DashboardController::class, 'index']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- MANAJEMEN SURAT (ADMIN) ---
    Route::get('/surat', [SuratController::class, 'index']); // Lihat semua surat
    Route::put('/surat/{id}', [SuratController::class, 'update']); // Update status surat

    // --- MANAJEMEN BERITA (ADMIN) ---
    Route::post('/berita', [BeritaController::class, 'store']); // Tambah Berita
    Route::put('/berita/{id}', [BeritaController::class, 'update']); // Edit Berita
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy']); // Hapus Berita
});