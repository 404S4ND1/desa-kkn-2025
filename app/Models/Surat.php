<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Surat extends Model
{
    use HasFactory;

    // Masukkan SEMUA nama kolom di sini agar bisa disimpan
    protected $fillable = [
        'nik', 
        'nama_pemohon', 
        'tempat_lahir', 
        'tanggal_lahir', 
        'jenis_kelamin', 
        'pekerjaan', 
        'agama', 
        'alamat', 
        'no_hp',
        'jenis_surat', 
        'keterangan', 
        'status',
        
        // Data Pasangan (PENTING: Jangan lupa ini)
        'nik_pasangan',
        'nama_pasangan',
        'tempat_lahir_pasangan',
        'tanggal_lahir_pasangan',
        'jenis_kelamin_pasangan',
        'pekerjaan_pasangan',
        'agama_pasangan',
        'alamat_pasangan',
    ];
}