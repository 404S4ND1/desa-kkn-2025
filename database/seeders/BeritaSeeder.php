<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Berita; // <--- Panggil Model Berita

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        // Kita buat 3 Berita Contoh
        Berita::create([
            'judul' => 'Kerja Bakti Minggu Ini',
            'penulis' => 'Pak RT 01',
            'isi' => 'Diharapkan seluruh warga membawa cangkul dan sabit untuk pembersihan selokan.',
        ]);

        Berita::create([
            'judul' => 'Jadwal Posyandu Balita',
            'penulis' => 'Bidan Desa',
            'isi' => 'Posyandu bulan ini diadakan di Balai Desa jam 08.00 pagi.',
        ]);
        
        Berita::create([
            'judul' => 'Pembagian BLT Tahap 1',
            'penulis' => 'Sekdes',
            'isi' => 'Bagi warga penerima manfaat harap membawa KTP dan KK asli.',
        ]);
    }
}