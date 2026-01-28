<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengaduan extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_pelapor',
        'nik',
        'no_hp',
        'judul_laporan',
        'lokasi', // 🔥 TAMBAHKAN INI
        'isi_laporan',
        'foto_bukti',
        'status',
        'tanggapan_desa'
    ];
}