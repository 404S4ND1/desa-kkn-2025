import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Anchor } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  
  const navClass = `fixed w-full z-50 transition-all duration-300 ${
    scrolled || !isHome ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
  }`;

  const linkClass = (path) => `transition-colors duration-300 font-medium ${
    location.pathname === path 
      ? "text-primary font-bold" 
      : (scrolled || !isHome ? "text-gray-600 hover:text-primary" : "text-white/90 hover:text-white")
  }`;

  const logoClass = scrolled || !isHome ? "text-primary" : "text-white";
  const textLogoClass = scrolled || !isHome ? "text-slate-800" : "text-white";

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <div className={`p-2 rounded-full ${scrolled || !isHome ? 'bg-blue-50' : 'bg-white/20 backdrop-blur-sm'}`}>
                <Anchor className={`w-6 h-6 ${logoClass}`} />
              </div>
              <span className={textLogoClass}>Sukajaya Lempasing</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass('/')}>Beranda</Link>
            <Link to="/wisata" className={linkClass('/wisata')}>Wisata</Link>
            <Link to="/umkm" className={linkClass('/umkm')}>UMKM</Link>
            <Link to="/berita" className={linkClass('/berita')}>Berita</Link>
            
            {/* TAMBAHAN BARU: Menu Layanan Surat */}
            <Link to="/layanan-surat" className={`px-4 py-2 rounded-full font-bold transition-all ${
              scrolled || !isHome 
                ? 'bg-primary text-white hover:bg-blue-700' 
                : 'bg-white text-primary hover:bg-gray-100'
            }`}>
              Layanan Surat
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className={`${scrolled || !isHome ? 'text-gray-800' : 'text-white'} focus:outline-none`}>
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t absolute w-full shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">Beranda</Link>
            <Link to="/wisata" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">Wisata</Link>
            <Link to="/umkm" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">UMKM</Link>
            <Link to="/berita" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">Berita</Link>
            <Link to="/layanan-surat" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg bg-primary/10 text-primary font-bold">Layanan Surat</Link>
          </div>
        </div>
      )}
    </nav>
  );
}