<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wisatas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_wisata');
            $table->string('pengelola')->nullable(); // Penanggung jawab
            $table->text('deskripsi');
            $table->string('alamat');
            $table->text('link_maps'); // Link Google Maps
            $table->string('no_wa');   // Kontak Info
            $table->string('foto')->nullable();
            $table->string('kategori')->default('Alam'); // Alam, Buatan, Edukasi
            $table->string('harga_tiket')->nullable(); // Tambahan khusus wisata
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wisatas');
    }
};