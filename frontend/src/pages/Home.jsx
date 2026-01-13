import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Anchor, ShoppingBag, FileText, ChevronDown, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../api'; // Import axios instance
// Import data statis sebagai fallback/initial state
import { villageInfo as staticVillageInfo, statsData as staticStats, featuresData as staticFeatures, beritaData as staticBerita } from '../data';

// Variabel animasi
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  // State untuk data, inisialisasi dengan DATA STATIS Frontend
  const [info, setInfo] = useState(staticVillageInfo);
  const [stats, setStats] = useState(staticStats);
  const [features, setFeatures] = useState(staticFeatures);
  const [latestNews, setLatestNews] = useState(staticBerita.slice(0, 3));
  
  // State loading (opsional, karena kita sudah punya data awal)
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data dari Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ambil Data Landing Page (Village Info, Stats, Features)
        const landingRes = await api.get('/landing');
        if(landingRes.data) {
           setInfo(landingRes.data.villageInfo);
           setStats(landingRes.data.statsData);
           setFeatures(landingRes.data.featuresData);
        }

        // 2. Ambil Berita (Jika Anda sudah buat endpoint berita, uncomment ini)
        // const beritaRes = await api.get('/berita');
        // setLatestNews(beritaRes.data.slice(0, 3));
        
        console.log("Data berhasil diambil dari Backend");
      } catch (error) {
        console.warn("Gagal connect ke Backend, menggunakan data statis Frontend.", error);
        // Tidak perlu set fallback manual karena state awal sudah data statis
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const iconMap = {
    "FileText": FileText,
    "Anchor": Anchor,
    "ShoppingBag": ShoppingBag
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-screen w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${info.heroImage}')` }} // Menggunakan state 'info'
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50"></div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto mt-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-primary font-bold tracking-widest uppercase mb-4 bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full border border-white/20"
          >
            {isLoading ? "Memuat..." : "Website Resmi"}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg"
          >
            Menjelajahi Keindahan <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-200">
              {info.name}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl font-light"
          >
            {info.regency}, {info.province}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/wisata" className="group bg-primary hover:bg-sky-500 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:shadow-[0_0_30px_rgba(14,165,233,0.7)] flex items-center gap-2">
              Jelajahi Wisata <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/profil" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold transition duration-300 border border-white/30">
              Profil Desa
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white"
        >
          <ChevronDown className="w-10 h-10 opacity-70" />
        </motion.div>
      </div>

      {/* 2. STATISTIK */}
      <div className="relative z-20 -mt-20 px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.id} className="text-center border-r last:border-0 border-slate-100">
              <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</h3>
              <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 3. TENTANG & SAMBUTAN */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeInUp}
          >
            <div className="inline-block px-4 py-2 bg-blue-100 text-primary rounded-full font-semibold text-sm mb-6">
              Tentang Desa Kami
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-6 leading-snug">
              Membangun Desa, <br/> Mensejahterakan Warga
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              {info.description}
            </p>
            <div className="flex items-center gap-4 text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                   <MapPin className="text-slate-600 w-5 h-5" />
                </div>
                <span>Kec. {info.district}</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-300"></div>
              <span>Kab. {info.regency}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-purple-400 rounded-2xl opacity-20 blur-2xl"></div>
            <div className="relative bg-white p-2 rounded-2xl shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
               <img 
                 src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1932&auto=format&fit=crop" 
                 alt="Desa View" 
                 className="rounded-xl w-full h-[400px] object-cover"
               />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. KEUNGGULAN */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Potensi & Keunggulan</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || FileText; // Fallback icon
              return (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-slate-50 p-8 rounded-2xl hover:bg-blue-50 transition-colors duration-300 group border border-slate-100 hover:border-blue-200"
                >
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-primary">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 5. BERITA TERBARU */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                        <Newspaper className="text-primary w-8 h-8" /> Kabar Desa Terkini
                    </h2>
                    <p className="text-slate-600 mt-2">Ikuti perkembangan terbaru dari desa kami</p>
                </div>
                <Link to="/berita" className="hidden md:flex items-center text-primary font-semibold hover:text-sky-700 transition">
                    Lihat Semua Berita <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
            </div>

            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid md:grid-cols-3 gap-8"
            >
                {latestNews.map((news) => (
                    <motion.div variants={fadeInUp} key={news.id}>
                        <Link to={`/berita/${news.id}`} className="group block h-full">
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-slate-100">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-700 shadow-sm">{news.category}</div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="text-xs text-gray-500 mb-2">{news.date}</div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors line-clamp-2">{news.title}</h3>
                                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">{news.snippet}</p>
                                    <span className="text-primary text-sm font-medium mt-auto inline-flex items-center group-hover:underline">Baca Selengkapnya &rarr;</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>
      
      {/* 6. CTA Section tetap sama... */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Menjelajahi Desa Kami?</h2>
          <p className="text-blue-100 text-lg mb-10">Temukan pengalaman wisata tak terlupakan dan produk UMKM unik hanya di {info.name}.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/wisata" className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
                Lihat Destinasi
             </Link>
             <Link to="/umkm" className="bg-blue-600 text-white border border-blue-400 px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
                Belanja UMKM
             </Link>
          </div>
        </div>
      </section>

    </div>
  );
}