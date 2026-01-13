<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function getLandingData()
    {
        // Data Village Info
        $villageInfo = [
            'name' => "Desa Sukajaya Lempasing",
            'district' => "Teluk Pandan",
            'regency' => "Pesawaran",
            'province' => "Lampung",
            'description' => "Selamat datang di website resmi Desa Sukajaya Lempasing. Desa pesisir yang asri dengan potensi wisata bahari yang memukau dan kreativitas UMKM warganya yang mendunia.",
            'heroImage' => "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
        ];

        // Data Statistik
        $statsData = [
            ['id' => 1, 'value' => "2.500+", 'label' => "Penduduk"],
            ['id' => 2, 'value' => "450", 'label' => "Kepala Keluarga"],
            ['id' => 3, 'value' => "10+", 'label' => "Destinasi Wisata"],
            ['id' => 4, 'value' => "25+", 'label' => "UMKM Aktif"],
        ];

        // Data Fitur/Keunggulan
        $featuresData = [
            [
                'title' => "Pelayanan Terpadu",
                'desc' => "Akses pelayanan administrasi desa yang cepat, transparan, dan ramah bagi seluruh warga.",
                'icon' => "FileText"
            ],
            [
                'title' => "Potensi Bahari",
                'desc' => "Garis pantai yang indah menjadi pusat ekonomi dan pariwisata unggulan desa.",
                'icon' => "Anchor"
            ],
            [
                'title' => "Ekonomi Kreatif",
                'desc' => "Pusat oleh-oleh dan kerajinan tangan hasil karya warga lokal yang berkualitas.",
                'icon' => "ShoppingBag"
            ]
        ];

        // Return JSON response
        return response()->json([
            'villageInfo' => $villageInfo,
            'statsData' => $statsData,
            'featuresData' => $featuresData
        ]);
    }

    public function getWisata()
    {
        $wisataData = [
            [
                'id' => 1,
                'title' => "Pantai Wisata",
                'description' => "Nikmati keindahan pantai dengan pasir putih dan ombak yang tenang, cocok untuk liburan keluarga.",
                'longDescription' => "Pantai ini merupakan primadona desa kami...",
                'image' => "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1932&auto=format&fit=crop",
                'location' => "Dusun 1, Sukajaya Lempasing",
                'price' => "Rp 10.000 / orang"
            ],
            [
                'id' => 2,
                'title' => "Ekowisata Mangrove",
                'description' => "Kawasan konservasi bakau yang menawarkan pemandangan hijau nan sejuk serta edukasi lingkungan.",
                'longDescription' => "Kawasan konservasi ini tidak hanya menawarkan pemandangan indah...",
                'image' => "https://images.unsplash.com/photo-1621849405022-7772719bd941?q=80&w=1974&auto=format&fit=crop",
                'location' => "Dusun 3, Sukajaya Lempasing",
                'price' => "Gratis (Donasi sukarela)"
            ]
        ];

        return response()->json($wisataData);
    }

    public function getUmkm()
    {
        $umkmData = [
            [
                'id' => 1,
                'name' => "Keripik Pisang Khas",
                'owner' => "Ibu Siti",
                'description' => "Oleh-oleh wajib berupa keripik pisang dengan berbagai varian rasa.",
                'longDescription' => "Keripik pisang Ibu Siti dibuat dari pisang kepok pilihan...",
                'image' => "https://images.unsplash.com/photo-1604543166870-07e174780521?q=80&w=2070&auto=format&fit=crop",
                'contact' => "0812-3456-7890",
                'priceRange' => "Rp 15.000 - Rp 25.000"
            ],
            [
                'id' => 2,
                'name' => "Kerajinan Tangan",
                'owner' => "Kelompok Pemuda",
                'description' => "Produk kerajinan unik yang terbuat dari bahan daur ulang dan hasil laut.",
                'longDescription' => "Kelompok pemuda desa mengolah limbah kerang...",
                'image' => "https://images.unsplash.com/photo-1513682976269-65a882d56a73?q=80&w=2070&auto=format&fit=crop",
                'contact' => "0898-7654-3210",
                'priceRange' => "Mulai dari Rp 5.000"
            ]
        ];

        return response()->json($umkmData);
    }
}