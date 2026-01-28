import { motion } from 'framer-motion';
import { MapPin, Clock, Ticket, Star, ArrowRight, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wisata() {
  // DATA WISATA (Dummy Data)
  const destinations = [
    {
      id: 1,
      name: "Pantai Mutun",
      category: "Wisata Bahari",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop", 
      desc: "Nikmati hamparan pasir putih lembut dengan ombak yang tenang. Cocok untuk liburan keluarga, berenang aman, dan tersedia wahana watersport seru.",
      price: "Rp 25.000 / orang",
      open: "08.00 - 18.00 WIB",
      rating: "4.8",
      features: ["Gazebo", "Banana Boat", "Kano", "Warung Makan"],
      // Theme colors: Neutral Background, Primary Text
      color: "bg-neutral/30 text-primary border-neutral/50" 
    },
    {
      id: 2,
      name: "Curug (Air Terjun)",
      category: "Wisata Alam",
      image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=2070&auto=format&fit=crop", 
      desc: "Rasakan kesegaran air pegunungan yang jernih dan udara sejuk nan asri. Lokasi healing terbaik untuk melepas penat dari hiruk pikuk kota.",
      price: "Rp 10.000 / orang",
      open: "07.00 - 17.00 WIB",
      rating: "4.6",
      features: ["Spot Foto", "Camping Ground", "Parkir Luas"],
      // Theme colors: Soft Primary Background
      color: "bg-primary/10 text-primary border-primary/20"
    }
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      
      {/* 1. HEADER HALAMAN */}
      <div className="text-center max-w-3xl mx-auto px-4 mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block"
        >
          Destinasi Unggulan
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-primary mb-6"
        >
          Surga Tersembunyi di <br/><span className="text-secondary">Desa Sukajaya</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-primary/80 text-lg"
        >
          Kami memiliki destinasi wisata alam yang wajib Anda kunjungi. Siapkan kamera dan energi Anda!
        </motion.p>
      </div>

      {/* 2. DAFTAR WISATA (BIG CARDS) */}
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {destinations.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-neutral/20 hover:shadow-2xl transition-all duration-500"
          >
            <div className="grid md:grid-cols-2 gap-0">
              
              {/* GAMBAR (KIRI/KANAN) */}
              <div className={`h-64 md:h-auto overflow-hidden relative ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-sm font-bold text-primary shadow-sm flex items-center gap-1">
                  <Star size={14} className="text-accent fill-accent"/> {item.rating}
                </div>
              </div>

              {/* KONTEN (TEKS) */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${item.color}`}>
                    {item.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors">
                    {item.name}
                  </h2>
                  <p className="text-primary/70 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                {/* INFO PRAKTIS GRID */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-surface p-3 rounded-xl border border-neutral/20">
                    <p className="text-xs text-primary/60 mb-1 flex items-center gap-1"><Ticket size={12}/> Tiket Masuk</p>
                    <p className="font-bold text-primary">{item.price}</p>
                  </div>
                  <div className="bg-surface p-3 rounded-xl border border-neutral/20">
                    <p className="text-xs text-primary/60 mb-1 flex items-center gap-1"><Clock size={12}/> Jam Buka</p>
                    <p className="font-bold text-primary">{item.open}</p>
                  </div>
                </div>

                {/* FASILITAS */}
                <div className="mb-8">
                  <p className="text-sm font-bold text-primary mb-3">Fasilitas Tersedia:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, i) => (
                      <span key={i} className="text-xs font-medium bg-neutral/20 text-primary px-3 py-1 rounded-lg border border-neutral/30">
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transform">
                  <MapPin size={18} /> Lihat Lokasi di Maps
                </button>
              </div>

            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. CTA FOOTER WISATA */}
      <div className="max-w-4xl mx-auto px-4 mt-20 text-center bg-primary rounded-3xl p-12 text-white relative overflow-hidden shadow-xl border border-white/10">
         <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Bingung Mau Kemana Dulu?</h2>
            <p className="text-neutral/80 mb-8 text-lg">Hubungi pemandu wisata lokal kami untuk pengalaman terbaik.</p>
            <Link to="/kontak" className="inline-flex items-center bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-accent hover:text-white transition shadow-lg active:scale-95 transform">
                Hubungi Kami <ArrowRight className="ml-2 w-5 h-5"/>
            </Link>
         </div>
         {/* Hiasan Background */}
         <Waves className="absolute bottom-0 left-0 w-64 h-64 text-white/5 -mb-10 -ml-10" />
         <Waves className="absolute top-0 right-0 w-64 h-64 text-white/5 -mt-10 -mr-10 rotate-180" />
      </div>

    </div>
  );
}