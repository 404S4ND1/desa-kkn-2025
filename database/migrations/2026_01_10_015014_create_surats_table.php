<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surats', function (Blueprint $table) {
            $table->id();
            // Data Pribadi Lengkap
            $table->string('nik');
            $table->string('nama_pemohon');
            $table->string('tempat_lahir'); // Baru
            $table->date('tanggal_lahir');  // Baru
            $table->string('jenis_kelamin'); // Baru
            $table->string('pekerjaan');    // Baru
            $table->string('agama');        // Baru
            $table->text('alamat');         // Baru
            $table->string('no_hp');
            
            // Data Surat
            $table->string('jenis_surat');
            $table->text('keterangan')->nullable();
            $table->string('status')->default('Menunggu');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surats');
    }
};