<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('surats', function (Blueprint $table) {
            $table->id();
            
            // 1. Data Pemohon (Wajib)
            $table->string('nik');
            $table->string('nama_pemohon');
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->string('jenis_kelamin');
            $table->string('pekerjaan');
            $table->string('agama');
            $table->text('alamat');
            $table->string('no_hp');

            // 2. Data Pasangan (Opsional - Bisa Kosong)
            // Pakai ->nullable() supaya tidak error kalau suratnya bukan surat nikah
            $table->string('nik_pasangan')->nullable();
            $table->string('nama_pasangan')->nullable();
            $table->string('tempat_lahir_pasangan')->nullable();
            $table->date('tanggal_lahir_pasangan')->nullable();
            $table->string('jenis_kelamin_pasangan')->nullable();
            $table->string('pekerjaan_pasangan')->nullable();
            $table->string('agama_pasangan')->nullable();
            $table->text('alamat_pasangan')->nullable();

            // 3. Data Surat & Detail (Isi paket "|||" masuk sini)
            $table->string('jenis_surat');
            $table->text('keterangan')->nullable(); 
            $table->string('status')->default('Menunggu');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('surats');
    }
};