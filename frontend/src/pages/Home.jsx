import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Anchor, ShoppingBag, FileText, ChevronDown, Newspaper, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../api';
import { villageInfo as staticVillageInfo, featuresData as staticFeatures, beritaData as staticBerita } from '../data';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  const [info, setInfo] = useState(staticVillageInfo);
  const [features, setFeatures] = useState(staticFeatures);
  const [latestNews, setLatestNews] = useState(staticBerita.slice(0, 3));
  const [isLoading, setIsLoading] = useState(true);

  // 1. UPDATE DATA STATISTIK DI SINI 📊
  const [stats, setStats] = useState([
    { id: 1, value: "7.658", label: "Jumlah Penduduk" },
    { id: 2, value: "2.079", label: "Jumlah Kepala Keluarga" },
    { id: 3, value: "2", label: "Destinasi Wisata" }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const landingRes = await api.get('/landing');
        if(landingRes.data) {
           setInfo(landingRes.data.villageInfo);
           // Jika backend mengirim data stats, gunakan ini. 
           // Jika tidak, dia akan pakai default yang kita set di atas.
           if (landingRes.data.statsData) setStats(landingRes.data.statsData);
           setFeatures(landingRes.data.featuresData);
        }
      } catch (error) {
        console.warn("Gagal connect ke Backend, menggunakan data statis.", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const iconMap = {
    "FileText": FileText,
    "Anchor": Anchor,
    "ShoppingBag": ShoppingBag,
    "Leaf": Leaf
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
          style={{ backgroundImage: `url('${info.heroImage}')` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-surface"></div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto mt-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-neutral font-bold tracking-widest uppercase mb-4 bg-primary/40 backdrop-blur-md px-6 py-2 rounded-full border border-neutral/30 shadow-lg"
          >
            {isLoading ? "Memuat..." : "Website Resmi Desa"}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl"
          >
            Menjelajahi Keindahan <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral to-accent">
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
            <Link to="/wisata" className="group bg-accent hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-[0_0_20px_rgba(230,126,34,0.4)] hover:shadow-[0_0_30px_rgba(230,126,34,0.6)] hover:-translate-y-1 flex items-center gap-2">
              Jelajahi Wisata <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/profil" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold transition duration-300 border border-white/30 hover:-translate-y-1">
              Profil Desa
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-primary"
        >
          <ChevronDown className="w-10 h-10 opacity-80" />
        </motion.div>
      </div>

      {/* 2. STATISTIK (Updated Grid & Data) */}
      <div className="relative z-20 -mt-24 px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          // PERUBAHAN: Menggunakan grid-cols-3 agar 3 item pas di tengah
          className="max-w-6xl mx-auto bg-white/95 backdrop-blur border border-neutral rounded-3xl shadow-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.id} className="text-center md:border-r last:border-0 border-neutral/50 pb-6 md:pb-0 border-b md:border-b-0 last:pb-0 last:border-b-0">
              <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</h3>
              <p className="text-secondary font-bold uppercase tracking-wider text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 3. TENTANG & SAMBUTAN */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeInUp}
          >
            <div className="inline-block px-4 py-2 bg-neutral/30 text-primary rounded-full font-bold text-sm mb-6 border border-neutral">
              Tentang Desa Kami
            </div>
            <h2 className="text-4xl font-bold text-primary mb-6 leading-snug">
              Membangun Desa, <br/> <span className="text-secondary">Mensejahterakan Warga</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              {info.description}
            </p>
            <div className="flex items-center gap-4 text-slate-500 font-medium bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                   <MapPin className="text-secondary w-6 h-6" />
                </div>
                <div>
                    <span className="block text-xs text-gray-400">Kecamatan</span>
                    <span className="text-primary font-bold">{info.district}</span>
                </div>
              </div>
              <div className="h-10 w-[1px] bg-slate-200"></div>
              <div>
                <span className="block text-xs text-gray-400">Kabupaten</span>
                <span className="text-primary font-bold">{info.regency}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-neutral rounded-2xl opacity-20 blur-2xl"></div>
            <div className="relative bg-white p-3 rounded-2xl shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white">
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
      <section className="py-24 bg-neutral/20 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">Potensi & Keunggulan</h2>
            <div className="w-24 h-1.5 bg-accent mx-auto rounded-full"></div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || FileText;
              return (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group border-b-4 border-transparent hover:border-accent hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-neutral/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-primary group-hover:bg-primary group-hover:text-white">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 5. BERITA TERBARU */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <Newspaper className="text-accent w-8 h-8" /> Kabar Desa Terkini
                    </h2>
                    <p className="text-slate-600 mt-2">Ikuti perkembangan terbaru dari desa kami</p>
                </div>
                <Link to="/berita" className="px-6 py-2 rounded-full border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition flex items-center">
                    Lihat Semua <ArrowRight className="ml-2 w-4 h-4" />
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
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-slate-100 group-hover:border-neutral">
                                <div className="h-52 overflow-hidden relative">
                                    <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{news.category}</div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow relative">
                                    <div className="text-xs text-secondary font-semibold mb-2 flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                      {news.date}
                                    </div>
                                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2">{news.title}</h3>
                                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">{news.snippet}</p>
                                    <span className="text-accent text-sm font-bold mt-auto inline-flex items-center group-hover:translate-x-2 transition-transform">Baca Selengkapnya &rarr;</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>
      
      {/* 6. CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#E5D9B6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Siap Menjelajahi Desa Kami?</h2>
          <p className="text-neutral/80 text-lg mb-10 max-w-2xl mx-auto">Temukan pengalaman wisata alam yang menenangkan dan produk UMKM lokal yang unik hanya di {info.name}.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/wisata" className="bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition shadow-[0_4px_14px_0_rgba(230,126,34,0.39)] hover:shadow-[0_6px_20px_rgba(230,126,34,0.23)] hover:-translate-y-1">
                Lihat Destinasi
             </Link>
             <Link to="/umkm" className="bg-transparent border-2 border-neutral text-neutral px-8 py-4 rounded-full font-bold hover:bg-neutral hover:text-primary transition hover:-translate-y-1">
                Belanja UMKM
             </Link>
          </div>
        </div>
      </section>

    </div>
  );
}