<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Desa Digital - KKN ITERA</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans">

    <nav class="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold">Desa Suka Maju 🇮🇩</h1>
            <div>
                <a href="/berita/tambah" class="bg-yellow-500 text-blue-900 px-4 py-2 rounded font-bold hover:bg-yellow-400 transition shadow">
                    + Tambah Berita
                </a>
            </div>
        </div>
    </nav>

    <div class="bg-blue-600 text-white text-center py-16 px-4">
        <h2 class="text-4xl font-bold mb-2">Selamat Datang di Website Desa</h2>
        <p class="text-xl opacity-80">Pusat Informasi & Pelayanan Warga</p>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-10">
        <h3 class="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-3">
            📰 Kabar Desa Terkini
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            @forelse($berita as $item)
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border border-gray-200">
                <div class="h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                    📷 Foto Belum Ada
                </div>
                
                <div class="p-5">
                    <p class="text-xs text-blue-600 font-bold mb-1">
                        {{ $item->created_at->format('d M Y') }} • Oleh {{ $item->penulis }}
                    </p>
                    <h4 class="text-xl font-bold mb-2 text-gray-900 leading-tight">
                        {{ $item->judul }}
                    </h4>
                    <p class="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {{Str::limit($item->isi, 100)}}
                    </p>
                    <span class="text-blue-600 font-semibold text-sm">Baca Selengkapnya →</span>
                </div>
            </div>
            @empty
            <div class="col-span-3 text-center py-12 bg-white rounded-lg border border-dashed border-gray-400">
                <p class="text-gray-500 text-lg">Belum ada berita yang diterbitkan.</p>
                <p class="text-sm text-gray-400">Silakan klik tombol tambah berita di atas.</p>
            </div>
            @endforelse

        </div>
    </div>

</body>
</html>