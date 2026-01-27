<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengaduans', function (Blueprint $table) {
            $table->id();
            
            // Kolom Data Pelapor
            $table->string('nama_pelapor');
            $table->string('nik')->nullable(); // Opsional, biar warga tidak takut lapor
            $table->string('no_hp');
            
            // Kolom Isi Pengaduan
            $table->string('judul_laporan');
            $table->text('isi_laporan');
            $table->string('foto_bukti')->nullable(); // Bisa upload foto (path file)
            
            // Kolom Status & Respon Desa
            $table->string('status')->default('Menunggu'); // Pilihan: Menunggu, Diproses, Selesai
            $table->text('tanggapan_desa')->nullable(); // Balasan dari Admin/Kades
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaduans');
    }
};