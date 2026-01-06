use App\Models\Berita; // <-- PASTIKAN BARIS INI ADA DI PALING ATAS FILE

Route::get('/', function () {
    // Ambil semua berita, urutkan dari yang paling baru
    $semuaBerita = Berita::latest()->get();
    
    // Tampilkan halaman welcome sambil bawa datanya
    return view('welcome', ['berita' => $semuaBerita]);
});