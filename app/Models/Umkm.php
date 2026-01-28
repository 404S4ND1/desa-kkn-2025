<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Umkm extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_umkm', 
        'pemilik', 
        'deskripsi', 
        'alamat', 
        'link_maps', // 🔥 Baru
        'no_wa',     // 🔥 Baru
        'foto', 
        'kategori'
    ];
}