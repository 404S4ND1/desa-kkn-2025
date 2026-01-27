<?php

namespace App\Http\Controllers;

use App\Models\Surat;
use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor; 

class SuratController extends Controller
{
    // Ambil semua surat (untuk Admin Dashboard)
    public function index()
    {
        return response()->json(Surat::latest()->get());
    }

    // Simpan surat baru (dari Warga)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|string',
            'nama_pemohon' => 'required|string',
            'tempat_lahir' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string',
            'pekerjaan' => 'required|string',
            'agama' => 'required|string',
            'alamat' => 'required|string',
            'no_hp' => 'required|string',
            'nik_pasangan' => 'nullable|string',
            'nama_pasangan' => 'nullable|string',
            'tempat_lahir_pasangan' => 'nullable|string',
            'tanggal_lahir_pasangan' => 'nullable|date',
            'jenis_kelamin_pasangan' => 'nullable|string',
            'pekerjaan_pasangan' => 'nullable|string',
            'agama_pasangan' => 'nullable|string',
            'alamat_pasangan' => 'nullable|string',
            'jenis_surat' => 'required|string',
            'keterangan' => 'nullable|string',
        ]);

        $validated['status'] = 'Menunggu';
        $surat = Surat::create($validated);
        return response()->json(['message' => 'Berhasil', 'data' => $surat], 201);
    }

    // Update status surat (Admin klik Selesai)
    public function update(Request $request, $id)
    {
        $surat = Surat::find($id);
        if (!$surat) return response()->json(['message' => '404'], 404);
        $surat->update(['status' => 'Selesai']);
        return response()->json(['message' => 'Status Updated', 'data' => $surat]);
    }

    // 🔥 FITUR CETAK WORD (Lengkap dengan Tabel Otomatis)
    public function cetakWord($id)
    {
        $surat = Surat::find($id);
        if (!$surat) return response()->json(['message' => 'Not Found'], 404);

        $templateName = '';
        switch ($surat->jenis_surat) {
            case 'Surat Keterangan Tidak Mampu (SKTM)': $templateName = 'SKTM.docx'; break;
            case 'Surat Keterangan Usaha (SKU)': $templateName = 'SKU.docx'; break;
            case 'Surat Keterangan Domisili': $templateName = 'Domisili.docx'; break;
            case 'Surat Keterangan Kematian': $templateName = 'Kematian.docx'; break;
            case 'Surat Keterangan Belum Menikah': $templateName = 'Belum_Menikah.docx'; break;
            case 'Surat Keterangan Telah Menikah': $templateName = 'Telah_Menikah.docx'; break;
            case 'Surat Keterangan Pindah': $templateName = 'Pindah.docx'; break;
            case 'Izin Keramaian': $templateName = 'Izin_Keramaian.docx'; break;
            case 'Surat Pengantar Capil': $templateName = 'Pengantar_Capil.docx'; break;
            default: return response()->json(['message' => 'Template belum ada'], 400);
        }

        $path = storage_path("app/templates/{$templateName}");
        if (!file_exists($path)) {
            return response()->json(['message' => "File template {$templateName} tidak ditemukan!"], 500);
        }

        $templateProcessor = new TemplateProcessor($path);

        // Isi Data Umum
        $templateProcessor->setValue('nomor_surat', str_pad($surat->id, 3, '0', STR_PAD_LEFT));
        $templateProcessor->setValue('nama_pemohon', strtoupper($surat->nama_pemohon));
        $templateProcessor->setValue('nik', $surat->nik);
        $templateProcessor->setValue('ttl', $surat->tempat_lahir . ', ' . \Carbon\Carbon::parse($surat->tanggal_lahir)->locale('id')->translatedFormat('d F Y'));
        $templateProcessor->setValue('jenis_kelamin', $surat->jenis_kelamin);
        $templateProcessor->setValue('agama', $surat->agama);
        $templateProcessor->setValue('pekerjaan', $surat->pekerjaan);
        $templateProcessor->setValue('alamat', $surat->alamat);
        $templateProcessor->setValue('tanggal_surat', \Carbon\Carbon::now()->locale('id')->translatedFormat('d F Y'));

        // LOGIKA KHUSUS (UNPACKING)
        if ($surat->jenis_surat == 'Surat Keterangan Kematian') {
            // Unpack Kematian
            $data = explode('|||', $surat->keterangan);
            $templateProcessor->setValue('bin_binti', strtoupper($data[0] ?? '-')); 
            $templateProcessor->setValue('hari', $data[1] ?? '-');
            $tglRaw = $data[2] ?? null;
            $templateProcessor->setValue('tanggal_meninggal', $tglRaw ? \Carbon\Carbon::parse($tglRaw)->locale('id')->translatedFormat('d F Y') : '-');
            $templateProcessor->setValue('sebab', $data[3] ?? '-');
            $templateProcessor->setValue('makam', $data[4] ?? '-');
            $templateProcessor->setValue('keterangan', ''); 

        } elseif ($surat->jenis_surat == 'Surat Keterangan Pindah') {
            // Unpack Pindah: NIK KK ||| Nama KK ||| Alamat Tujuan ||| Alasan ||| Jumlah ||| JSON_TABEL
            $data = explode('|||', $surat->keterangan);
            
            $templateProcessor->setValue('nik_kk', $data[0] ?? '-');
            $templateProcessor->setValue('nama_kk', strtoupper($data[1] ?? '-'));
            $templateProcessor->setValue('alamat_pindah', $data[2] ?? '-');
            $templateProcessor->setValue('alasan_pindah', $data[3] ?? '-');
            $templateProcessor->setValue('jumlah_pindah', $data[4] ?? '-');
            
            // --- LOGIKA TABEL OTOMATIS (JSON) ---
            $jsonAnggota = $data[5] ?? '[]'; // Ambil data ke-6 (JSON)
            $listAnggota = json_decode($jsonAnggota, true); // Ubah jadi Array PHP

            // Siapkan data untuk tabel Word
            $values = [];
            if (!empty($listAnggota)) {
                $nomor = 1;
                foreach($listAnggota as $anggota) {
                    $values[] = [
                        'tabel_no'   => $nomor++,
                        'tabel_nama' => strtoupper($anggota['nama']),
                        'tabel_ttl'  => $anggota['ttl'],
                        'tabel_shdk' => $anggota['shdk'],
                    ];
                }
                // Cloning baris tabel berdasarkan variabel 'tabel_nama'
                $templateProcessor->cloneRowAndSetValues('tabel_nama', $values);
            } else {
                // Kalau kosong, hapus baris tabelnya
                $templateProcessor->cloneRowAndSetValues('tabel_nama', [
                    ['tabel_no' => '-', 'tabel_nama' => '-', 'tabel_ttl' => '-', 'tabel_shdk' => '-']
                ]);
            }

            $templateProcessor->setValue('keterangan', '');

        } elseif ($surat->jenis_surat == 'Surat Keterangan Telah Menikah') {
            // Data Pasangan
            $templateProcessor->setValue('nama_pasangan', strtoupper($surat->nama_pasangan));
            $templateProcessor->setValue('nik_pasangan', $surat->nik_pasangan);
            $templateProcessor->setValue('ttl_pasangan', $surat->tempat_lahir_pasangan . ', ' . \Carbon\Carbon::parse($surat->tanggal_lahir_pasangan)->locale('id')->translatedFormat('d F Y'));
            $templateProcessor->setValue('agama_pasangan', $surat->agama_pasangan);
            $templateProcessor->setValue('pekerjaan_pasangan', $surat->pekerjaan_pasangan);
            $templateProcessor->setValue('alamat_pasangan', $surat->alamat_pasangan);
            $templateProcessor->setValue('keterangan', strtoupper($surat->keterangan));
        
        } else {
            // Surat Biasa
            $templateProcessor->setValue('keterangan', strtoupper($surat->keterangan));
        }

        $fileName = str_replace(' ', '_', $surat->jenis_surat) . '_' . str_replace(' ', '_', $surat->nama_pemohon) . '.docx';
        $savePath = storage_path('app/public/' . $fileName);
        $templateProcessor->saveAs($savePath);

        return response()->download($savePath)->deleteFileAfterSend(true);
    }

    // 🔥 FITUR BARU: CEK STATUS SURAT (Untuk Warga)
    public function cekStatus(Request $request)
    {
        // 1. Validasi Input (Wajib NIK)
        $request->validate([
            'nik' => 'required|string|min:16', // Minimal 16 angka
        ]);

        // 2. Cari di Database
        $surat = Surat::where('nik', $request->nik)
                      ->orderBy('created_at', 'desc') // Yang terbaru di atas
                      ->get();

        // 3. Respon
        if ($surat->isEmpty()) {
            return response()->json(['message' => 'Belum ada pengajuan surat untuk NIK ini.', 'data' => []], 404);
        }

        return response()->json(['message' => 'Data ditemukan', 'data' => $surat]);
    }
}