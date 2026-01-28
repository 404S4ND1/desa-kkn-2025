<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wisata extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_wisata', 
        'pengelola', 
        'deskripsi', 
        'alamat', 
        'link_maps', 
        'no_wa', 
        'foto', 
        'kategori',
        'harga_tiket'
    ];
}