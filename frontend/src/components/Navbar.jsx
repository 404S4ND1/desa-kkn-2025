import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Cek login & Scroll listener
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  // Helper Class
  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    if (scrolled || location.pathname !== '/') {
      return isActive 
        ? "text-accent font-bold bg-neutral/20 px-3 py-2 rounded-lg transition-all" 
        : "text-primary hover:text-secondary hover:bg-slate-100 px-3 py-2 rounded-lg transition-all font-medium";
    } else {
      return isActive 
        ? "text-accent font-bold bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg transition-all" 
        : "text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-medium";
    }
  };

  const dropdownTriggerClass = () => {
    if (scrolled || location.pathname !== '/') {
      return "text-primary hover:text-secondary font-medium";
    } else {
      return "text-white/90 hover:text-white font-medium";
    }
  };

  const logoColor = (scrolled || location.pathname !== '/') ? "text-primary" : "text-white";
  const navBackground = (scrolled || location.pathname !== '/') ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBackground}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className={`text-2xl font-bold flex items-center gap-2 ${logoColor}`}>
            <span className="bg-gradient-to-br from-primary to-secondary text-white p-2 rounded-lg shadow-lg text-xl">🏛️</span> 
            <span className="drop-shadow-sm">Desa KKN</span>
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex space-x-2 items-center">
            <Link to="/" className={navLinkClass('/')}>Beranda</Link>
            <Link to="/berita" className={navLinkClass('/berita')}>Berita</Link>
            <Link to="/umkm" className={navLinkClass('/umkm')}>UMKM</Link>
            <Link to="/wisata" className={navLinkClass('/wisata')}>Wisata</Link>
            
            {/* DROPDOWN LAYANAN (DESKTOP) */}
            <div 
              className="relative group"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${dropdownTriggerClass()}`}>
                    Layanan <ChevronDown size={16} />
                </button>
                
                <div className={`absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-100 transform transition-all duration-200 origin-top-left overflow-hidden ${dropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                    <Link to="/layanan-surat" className="block px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition">
                        ✍️ Buat Surat Baru
                    </Link>
                    <div className="border-t border-slate-100"></div>
                    <Link to="/cek-surat" className="block px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition">
                        🔍 Cek Status Surat
                    </Link>
                    <div className="border-t border-slate-100"></div>
                    <Link to="/pengaduan" className="block px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition">
                        📢 Lapor Pengaduan
                    </Link>
                    {/* 🔥 MENU BARU PETA LOKASI 🔥 */}
                    <div className="border-t border-slate-100"></div>
                    <Link to="/peta-lokasi" className="block px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600 transition">
                        🗺️ Peta & Lokasi
                    </Link>
                </div>
            </div>
          </div>

          {/* TOMBOL LOGIN */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <Link to="/admin-dashboard" className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-secondary transition shadow-lg flex items-center gap-2">
                ⚙️ Dashboard
              </Link>
            ) : (
              <Link to="/login" className="bg-accent text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition shadow-lg">
                Login
              </Link>
            )}
          </div>

          {/* TOMBOL MOBILE MENU */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={`focus:outline-none p-2 rounded-md ${scrolled || location.pathname !== '/' ? 'text-primary' : 'text-white'}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* MENU MOBILE (DROPDOWN) */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-neutral shadow-xl flex flex-col p-4 gap-2 animate-fadeIn">
            <Link to="/" className="px-4 py-3 rounded-lg hover:bg-neutral/30 text-primary font-medium" onClick={() => setIsOpen(false)}>Beranda</Link>
            <Link to="/berita" className="px-4 py-3 rounded-lg hover:bg-neutral/30 text-primary font-medium" onClick={() => setIsOpen(false)}>Berita</Link>
            <Link to="/umkm" className="px-4 py-3 rounded-lg hover:bg-neutral/30 text-primary font-medium" onClick={() => setIsOpen(false)}>UMKM</Link>
            <Link to="/wisata" className="px-4 py-3 rounded-lg hover:bg-neutral/30 text-primary font-medium" onClick={() => setIsOpen(false)}>Wisata</Link>
            
            {/* Menu Layanan Mobile */}
            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                <p className="px-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Pusat Layanan</p>
                <Link to="/layanan-surat" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-primary font-medium mb-1" onClick={() => setIsOpen(false)}>
                   ✍️ Buat Surat Baru
                </Link>
                <Link to="/cek-surat" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-primary font-medium mb-1" onClick={() => setIsOpen(false)}>
                   🔍 Cek Status Surat
                </Link>
                <Link to="/pengaduan" className="block px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium mb-1" onClick={() => setIsOpen(false)}>
                   📢 Lapor Pengaduan
                </Link>
                {/* 🔥 MENU MOBILE PETA 🔥 */}
                <Link to="/peta-lokasi" className="block px-4 py-2 rounded-lg hover:bg-green-50 text-green-600 font-medium" onClick={() => setIsOpen(false)}>
                   🗺️ Peta & Lokasi
                </Link>
            </div>

            <div className="border-t border-neutral mt-2 pt-2">
              {isLoggedIn ? (
                <Link to="/admin-dashboard" className="block w-full text-center bg-primary text-white py-3 rounded-lg font-bold" onClick={() => setIsOpen(false)}>Dashboard Admin</Link>
              ) : (
                <Link to="/login" className="block w-full text-center bg-accent text-white py-3 rounded-lg font-bold" onClick={() => setIsOpen(false)}>Login Admin</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}