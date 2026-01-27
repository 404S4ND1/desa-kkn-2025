<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Surat Desa</title>
    <style>
        @page { size: A4; margin: 2.5cm; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; }
        .kop-surat { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 30px; }
        .kop-surat h3 { margin: 0; font-size: 14pt; font-weight: normal; text-transform: uppercase; }
        .kop-surat h2 { margin: 0; font-size: 16pt; font-weight: bold; text-transform: uppercase; }
        .kop-surat p { margin: 0; font-size: 11pt; font-style: italic; }
        .judul-container { text-align: center; margin-bottom: 30px; }
        .judul-surat { text-decoration: underline; font-weight: bold; text-transform: uppercase; font-size: 14pt; }
        .nomor-surat { margin-top: 5px; }
        .paragraf { text-align: justify; text-indent: 40px; margin-bottom: 10px; }
        .tabel-data { width: 100%; margin-left: 20px; margin-bottom: 20px; }
        .tabel-data td { padding: 3px 5px; vertical-align: top; }
        .label { width: 160px; } 
        .titik-dua { width: 10px; }
        .ttd-container { float: right; width: 250px; text-align: center; margin-top: 50px; }
        .ttd-nama { font-weight: bold; text-decoration: underline; margin-top: 80px; }
    </style>
</head>
<body>

    <div class="kop-surat">
        <h3>PEMERINTAH KABUPATEN LAMPUNG SELATAN</h3>
        <h3>KECAMATAN JATI AGUNG</h3>
        <h2>DESA SABAH BALAU</h2>
        <p>Alamat: Jl. Raya Sabah Balau No. 1, Kec. Jati Agung, Kode Pos: 35365</p>
    </div>

    <div class="judul-container">
        <div class="judul-surat">{{ strtoupper($surat->jenis_surat) }}</div>
        <div class="nomor-surat">Nomor: 470 / {{ str_pad($surat->id, 3, '0', STR_PAD_LEFT) }} / XII / {{ date('Y') }}</div>
    </div>

    <div class="isi-surat">
        <p class="paragraf">
            Yang bertanda tangan di bawah ini Kepala Desa Sabah Balau, Kecamatan Jati Agung, Kabupaten Lampung Selatan, dengan ini menerangkan bahwa:
        </p>

        <table class="tabel-data">
            <tr>
                <td class="label">Nama Lengkap</td>
                <td class="titik-dua">:</td>
                <td><b>{{ strtoupper($surat->nama_pemohon) }}</b></td>
            </tr>
            <tr>
                <td class="label">NIK</td>
                <td class="titik-dua">:</td>
                <td>{{ $surat->nik }}</td>
            </tr>
            <tr>
                <td class="label">Tempat/Tgl Lahir</td>
                <td class="titik-dua">:</td>
                <td>{{ $surat->tempat_lahir }}, {{ \Carbon\Carbon::parse($surat->tanggal_lahir)->locale('id')->translatedFormat('d F Y') }}</td>
            </tr>
            <tr>
                <td class="label">Jenis Kelamin</td>
                <td class="titik-dua">:</td>
                <td>{{ $surat->jenis_kelamin }}</td>
            </tr>
            <tr>
                <td class="label">Pekerjaan</td>
                <td class="titik-dua">:</td>
                <td>{{ $surat->pekerjaan }}</td>
            </tr>
            <tr>
                <td class="label">Agama</td>
                <td class="titik-dua">:</td>
                <td>{{ $surat->agama }}</td>
            </tr>
            <tr>
                <td class="label">Alamat</td>
                <td class="titik-dua">:</td>
                <td>{{ $surat->alamat }}</td>
            </tr>
            <tr>
                <td class="label">No. HP / WA</td>
                <td class="titik-dua">:</td>
                <td>{{ $surat->no_hp }}</td>
            </tr>
            <tr>
                <td class="label">Keperluan</td>
                <td class="titik-dua">:</td>
                <td><b>{{ $surat->keterangan }}</b></td>
            </tr>
        </table>

        <p class="paragraf">
            Demikian surat keterangan ini dibuat dengan sebenarnya, untuk dapat dipergunakan sebagaimana mestinya.
        </p>
    </div>

    <div class="ttd-container">
        <p>Sabah Balau, {{ date('d F Y') }}</p>
        <p>Kepala Desa</p>
        <div class="ttd-nama">( NAMA KADES )</div>
    </div>

</body>
</html>