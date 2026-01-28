<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            $table->string('nama_umkm');
            $table->string('pemilik');
            $table->text('deskripsi');
            $table->string('alamat'); // Alamat tertulis
            $table->text('link_maps'); // 🔥 BARU: Link Google Maps
            $table->string('no_wa');   // 🔥 BARU: Nomor WhatsApp
            $table->string('foto')->nullable();
            $table->string('kategori')->default('Kuliner');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('umkms');
    }
};