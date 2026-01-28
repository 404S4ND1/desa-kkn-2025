import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Info, Loader2, StopCircle, Layers } from 'lucide-react';
import L from 'leaflet';

// --- FIX ICON LEAFLET ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- KOMPONEN ANIMASI (FLY TO) ---
function LocationMarker({ position, isTracking }) {
    const map = useMap();
    useEffect(() => {
        if (position && isTracking) {
            map.flyTo(position, 18, { animate: true, duration: 1.5 });
        }
    }, [position, isTracking, map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>
                <div className="text-center">
                    <b className="text-primary">Lokasi Anda</b> <br/>
                    <span className="text-xs text-secondary">Akurat (GPS)</span>
                </div>
            </Popup>
        </Marker>
    );
}

export default function PetaLokasi() {
    // State
    const [position, setPosition] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const watchIdRef = useRef(null);

    // Default Center (Ganti dengan koordinat Desa Anda)
    const defaultCenter = [-5.397140, 105.266789]; 

    // --- TRACKING LOGIC ---
    const startTracking = () => {
        setIsTracking(true);
        setErrorMsg('');

        if (!navigator.geolocation) {
            setErrorMsg("Browser tidak support GPS.");
            setIsTracking(false);
            return;
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
            (err) => {
                setErrorMsg("Gagal deteksi lokasi. Pastikan GPS aktif.");
                setIsTracking(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsTracking(false);
    };

    useEffect(() => { return () => stopTracking(); }, []);

    return (
        <div className="min-h-screen bg-surface pt-24 pb-12">
            
            <div className="text-center max-w-3xl mx-auto px-4 mb-10">
                <span className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block">Geografis Desa</span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">Peta Wilayah & Lokasi</h1>
                <p className="text-primary/70 text-lg">Tampilan default menggunakan mode <b>Satelit</b>.</p>
            </div>

            <div className="max-w-6xl mx-auto px-4 space-y-12">
                
                {/* --- LIVE LOCATION MAP --- */}
                <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border border-neutral/20 relative overflow-hidden">
                    
                    {/* Toolbar Atas */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 pb-4 border-b border-neutral/10">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="bg-green-100 p-2 rounded-lg text-green-700"><Navigation size={24} /></div>
                            <div>
                                <h2 className="text-xl font-bold text-primary">Peta Interaktif</h2>
                                <p className="text-xs text-secondary">{isTracking ? 'Melacak posisi...' : 'Klik tombol untuk mulai.'}</p>
                            </div>
                        </div>
                        
                        {!isTracking ? (
                            <button onClick={startTracking} className="w-full md:w-auto bg-accent text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition flex justify-center items-center gap-2 shadow-lg shadow-orange-200">
                                <Navigation size={18} /> Mulai Live Location
                            </button>
                        ) : (
                            <button onClick={stopTracking} className="w-full md:w-auto bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition flex justify-center items-center gap-2">
                                <StopCircle size={18} /> Stop Tracking
                            </button>
                        )}
                    </div>

                    {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100 flex items-center gap-2"><Info size={16}/> {errorMsg}</div>}

                    {/* WADAH PETA */}
                    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-inner border border-neutral/20 z-0 relative">
                        {isTracking && !position && (
                            <div className="absolute inset-0 z-[1000] bg-white/60 backdrop-blur-sm flex items-center justify-center flex-col text-primary">
                                <Loader2 size={40} className="animate-spin mb-2 text-accent"/>
                                <span className="font-bold">Mencari Sinyal GPS...</span>
                            </div>
                        )}

                        <MapContainer center={defaultCenter} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                            
                            {/* 🔥 KONTROL LAYER (DEFAULT: SATELIT) 🔥 */}
                            <LayersControl position="topright">
                                
                                <LayersControl.BaseLayer name="Peta Jalan (OSM)">
                                    <TileLayer
                                        attribution='&copy; OpenStreetMap'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                </LayersControl.BaseLayer>

                                {/* Property 'checked' dipindahkan ke sini agar jadi default */}
                                <LayersControl.BaseLayer checked name="Google Satelit (Hybrid)">
                                    <TileLayer
                                        attribution='&copy; Google Maps'
                                        url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
                                    />
                                </LayersControl.BaseLayer>

                                <LayersControl.BaseLayer name="Esri World Imagery">
                                    <TileLayer
                                        attribution='Tiles &copy; Esri'
                                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                    />
                                </LayersControl.BaseLayer>

                            </LayersControl>
                            
                            {/* Marker Kantor Desa */}
                            <Marker position={defaultCenter}>
                                <Popup><b>Kantor Desa</b><br/>Pusat Pemerintahan</Popup>
                            </Marker>

                            {/* Marker User */}
                            <LocationMarker position={position} isTracking={isTracking} />

                        </MapContainer>
                        
                        {/* Petunjuk Layer */}
                        <div className="absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs font-bold shadow-md text-primary flex items-center gap-2 border border-white/20">
                            <Layers size={14}/> Klik ikon layer di pojok kanan atas untuk ganti tampilan.
                        </div>
                    </div>
                </div>

                {/* --- PETA GAMBAR STATIS --- */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-neutral/20">
                    <div className="flex items-center gap-3 mb-6 border-b border-neutral/10 pb-4">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary"><MapPin size={24} /></div>
                        <h2 className="text-xl font-bold text-primary">Peta Administrasi Resmi</h2>
                    </div>
                    <div className="w-full h-[500px] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-dashed border-slate-300 relative group">
                        <img 
                            src="/images/peta_desa.jpg" 
                            alt="Peta Administrasi Desa" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "https://via.placeholder.com/800x600?text=Upload+File+peta_desa.jpg+di+folder+public/images";
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}