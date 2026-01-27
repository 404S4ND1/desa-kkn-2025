<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Surat;
use App\Models\Berita;
use App\Models\User;
use App\Models\Pengaduan; // <-- Jangan lupa import ini

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_surat' => Surat::count(),
            'total_berita' => Berita::count(),
            'total_user' => User::count(),
            'total_pengaduan' => Pengaduan::count(), // <-- Tambahkan ini
            'surat_terbaru' => Surat::latest()->take(5)->get()
        ]);
    }
}