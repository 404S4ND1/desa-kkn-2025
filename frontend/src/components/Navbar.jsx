import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  // Helper untuk class active/inactive
  const navLinkClass = (path) => {
    const isActive = location.pathname === path;

    if (scrolled || location.pathname !== '/') {
      // Mode Gelap/Scrolled (Background Putih)
      return isActive 
        ? "text-accent font-bold bg-neutral/20 px-3 py-2 rounded-lg transition-all" 
        : "text-primary hover:text-secondary hover:bg-slate-100 px-3 py-2 rounded-lg transition-all font-medium";
    } else {
      // Mode Transparent (di atas Hero Image)
      return isActive 
        ? "text-accent font-bold bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg transition-all" 
        : "text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-medium";
    }
  };

  // Warna Logo & Background Navbar
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
            <Link to="/layanan-surat" className={navLinkClass('/layanan-surat')}>Layanan Surat</Link>
          </div>

          {/* TOMBOL LOGIN / DASHBOARD */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <Link 
                to="/admin-dashboard" 
                className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-secondary transition shadow-lg hover:shadow-primary/30 flex items-center gap-2"
              >
                ⚙️ Dashboard
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="bg-accent text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition shadow-lg hover:shadow-accent/40 hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
          </div>

          {/* TOMBOL BURGER (Mobile) */}
          <div className="md:hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`focus:outline-none p-2 rounded-md ${scrolled || location.pathname !== '/' ? 'text-primary' : 'text-white'}`}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MENU MOBILE (Dropdown) */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-neutral shadow-xl flex flex-col p-4 gap-2 animate-fadeIn">
            <Link to="/" className="px-4 py-3 rounded-lg hover:bg-neutral/30 text-primary font-medium" onClick={() => setIsOpen(false)}>Beranda</Link>
            <Link to="/berita" className="px-4 py-3 rounded-lg hover:bg-neutral/30 text-primary font-medium" onClick={() => setIsOpen(false)}>Berita</Link>
            <Link to="/umkm" className="px-4 py-3 rounded-lg hover:bg-neutral/30 text-primary font-medium" onClick={() => setIsOpen(false)}>UMKM</Link>
            <Link to="/wisata" className="px-4 py-3 rounded-lg hover:bg-neutral/30 text-primary font-medium" onClick={() => setIsOpen(false)}>Wisata</Link>
            <Link to="/layanan-surat" className="px-4 py-3 rounded-lg hover:bg-neutral/30 text-primary font-medium" onClick={() => setIsOpen(false)}>Layanan Surat</Link>
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