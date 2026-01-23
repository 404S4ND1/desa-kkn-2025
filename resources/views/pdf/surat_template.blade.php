<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Surat Desa</title>
    <style>
        @page { size: A4; margin: 2cm 2.5cm; }
        body { 
            font-family: 'Times New Roman', Times, serif; 
            font-size: 12pt; 
            line-height: 1.5; 
        }
        
        /* KOP SURAT (Sesuai Docx) */
        .kop-surat { text-align: center; margin-bottom: 20px; }
        .kop-surat h4 { margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase; }
        .kop-surat h3 { margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase; }
        .kop-surat h2 { margin: 0; font-size: 16pt; font-weight: bold; text-transform: uppercase; }
        .kop-surat p { margin: 0; font-size: 11pt; font-style: italic; border-bottom: 3px double #000; padding-bottom: 10px;}

        /* JUDUL SURAT */
        .judul-container { text-align: center; margin-bottom: 20px; margin-top: 20px;}
        .judul-surat { text-decoration: underline; font-weight: bold; text-transform: uppercase; font-size: 12pt; }
        
        /* ISI */
        .paragraf { text-align: justify; text-indent: 40px; margin-bottom: 10px; }
        .tabel-data { width: 100%; margin-left: 20px; margin-bottom: 10px; }
        .tabel-data td { padding: 2px; vertical-align: top; }
        .label { width: 160px; }
        .titik-dua { width: 10px; }

        /* TANDA TANGAN */
        .ttd-container { float: right; width: 280px; text-align: center; margin-top: 30px; }
        .ttd-nama { font-weight: bold; text-decoration: underline; margin-top: 70px; text-transform: uppercase; }
    </style>
</head>
<body>

    <div class="kop-surat">
        <h4>PEMERINTAH KABUPATEN PESAWARAN</h4>
        <h3>KECAMATAN TELUK PANDAN</h3>
        <h2>DESA SUKAJAYA LEMPASING</h2>
        <p>Sekretariat: Jl. Raya Teluk Ratai Km 8 Desa Sukajaya Lempasing Kec. Teluk Pandan, Pesawaran</p>
    </div>

    <div class="judul-container">
        <div class="judul-surat">
            {{ strtoupper($surat->jenis_surat) }}
        </div>
        <div class="nomor-surat">
            Nomor: 470 / {{ str_pad($surat->id, 3, '0', STR_PAD_LEFT) }} / VII.10.08 / {{ date('m') }} / {{ date('Y') }}
        </div>
    </div>

    <div class="isi-surat">
        
        <p class="paragraf">
            Yang bertanda tangan di bawah ini Kepala Desa Sukajaya Lempasing Kecamatan Teluk Pandan Kabupaten Pesawaran, dengan ini menerangkan bahwa:
        </p>

        <table class="tabel-data">
            <tr>
                <td class="label">Nama</td>
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
                <td class="label">Agama</td>
                <td class="titik-dua">:</td>
                <td>{{ $surat->agama }}</td>
            </tr>
            <tr>
                <td class="label">Pekerjaan</td>
                <td class="titik-dua">:</td>
                <td>{{ $surat->pekerjaan }}</td>
            </tr>
            <tr>
                <td class="label">Alamat</td>
                <td class="titik-dua">:</td>
                <td>{{ $surat->alamat }}</td>
            </tr>
        </table>

        @if($surat->jenis_surat == 'Surat Keterangan Tidak Mampu (SKTM)')
            <p class="paragraf">
                Nama di atas adalah benar penduduk Desa Sukajaya Lempasing Kecamatan Teluk Pandan Kabupaten Pesawaran, sepengetahuan kami orang tersebut <b>benar-benar orang tidak mampu dan tergolong berekonomi lemah (miskin)</b>. Surat Keterangan ini diberikan kepada yang bersangkutan guna keperluan:
            </p>
            <div style="text-align: center; font-weight: bold; margin: 10px 0;">
                - {{ strtoupper($surat->keterangan) }} -
            </div>

        @elseif($surat->jenis_surat == 'Surat Keterangan Usaha (SKU)')
            <p class="paragraf">
                Nama di atas adalah benar Beralamatkan Pada Alamat Tersebut Diatas, Dan Sepengetahuan kami orang tersebut di atas mempunyai usaha di Desa Sukajaya Lempasing, Kecamatan Teluk Pandan Kabupaten Pesawaran.
            </p>
            <p style="text-align: center;">Dengan Jenis Usaha:</p>
            <div style="text-align: center; font-weight: bold; margin: 10px 0; text-decoration: underline;">
                - {{ strtoupper($surat->keterangan) }} -
            </div>

        @elseif($surat->jenis_surat == 'Surat Keterangan Domisili')
            <p class="paragraf">
                Nama tersebut diatas adalah benar warga Desa Sukajaya Lempasing, Kecamatan Teluk Pandan, Kabupaten Pesawaran, dan benar yang bersangkutan berdomisili/bertempat tinggal pada alamat diatas.
            </p>
            <p class="paragraf">
                Surat Keterangan Domisili ini diberikan kepada yang bersangkutan guna keperluan:
            </p>
            <div style="text-align: center; font-weight: bold; margin: 10px 0;">
                - {{ strtoupper($surat->keterangan) }} -
            </div>

        @elseif($surat->jenis_surat == 'Surat Pengantar Capil')
            <p class="paragraf">
                Nama diatas adalah benar berdomisili dan beralamat di Desa Sukajaya Lempasing, Kecamatan Teluk Pandan, Kabupaten Pesawaran.
            </p>
            <p class="paragraf">
                Dan orang tersebut akan mengurus Administrasi Kependudukan (KK/KTP), untuk itu kami mohon kepada Disduk Capil Kabupaten Pesawaran untuk dapat membantu proses tersebut.
            </p>

        @elseif($surat->jenis_surat == 'Surat Keterangan Belum Menikah')
            <p class="paragraf">
                Nama diatas adalah benar Penduduk Desa Sukajaya Lempasing Kecamatan Teluk Pandan Kabupaten Pesawaran. Dan Sepengetahuan kami nama diatas <b>belum pernah menikah (Jejaka/Perawan)</b> dan tidak sedang dalam terikat perkawinan/pernikahan dengan pihak manapun.
            </p>
            <p class="paragraf">
                Surat ini dibuat untuk keperluan: <b>{{ $surat->keterangan }}</b>
            </p>

        @elseif($surat->jenis_surat == 'Surat Keterangan Kematian')
            <p class="paragraf">
                Menerangkan dengan sebenarnya bahwa nama tersebut diatas telah meninggal dunia pada:
            </p>
            <table class="tabel-data" style="margin-left: 40px;">
                <tr><td width="100">Hari/Tanggal</td><td>: ...........................................</td></tr>
                <tr><td>Pukul</td><td>: ........................................... WIB</td></tr>
                <tr><td>Di</td><td>: ...........................................</td></tr>
                <tr><td>Disebabkan</td><td>: Sakit / Usia Tua</td></tr>
                <tr><td>Dimakamkan</td><td>: TPU Desa Sukajaya Lempasing</td></tr>
            </table>
            <p class="paragraf">
                Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.
            </p>
        
        @else
            <p class="paragraf">
                Orang tersebut di atas adalah benar-benar warga Desa Sukajaya Lempasing. Surat ini dibuat untuk keperluan:
            </p>
            <div style="text-align: center; font-weight: bold; margin: 10px 0;">
                " {{ strtoupper($surat->keterangan) }} "
            </div>
        @endif

        <p class="paragraf" style="margin-top: 20px;">
            Demikianlah surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>
    </div>

    <div class="ttd-container">
        <p>Sukajaya Lempasing, {{ date('d F Y') }}</p>
        <p>Kepala Desa Sukajaya Lempasing</p>
        <br><br><br> <div class="ttd-nama">EDY SUSANTO</div>
    </div>

    <div style="font-size: 9pt; margin-top: 50px; font-style: italic;">
        Catatan:<br>
        1. Lembaran Pertama Untuk Yang Bersangkutan<br>
        2. Lembaran Kedua Untuk Arsip
    </div>

</body>
</html>