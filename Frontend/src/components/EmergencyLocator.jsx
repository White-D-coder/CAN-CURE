import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AlertTriangle, MapPin, Navigation, Phone, CheckCircle, Clock, Bed } from 'lucide-react';
import api from '../api/axios';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const EmergencyLocator = ({ user }) => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestingId, setRequestingId] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [isCritical, setIsCritical] = useState(false); // Mock critical state evaluation

    // Mock patient location
    const patientLoc = [22.5726, 88.3639]; // Kolkata

    useEffect(() => {
        fetchHospitals();
        // Mock checking if patient's latest report was critical
        setIsCritical(true); // For demonstration
    }, []);

    const fetchHospitals = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/user/hospitals', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Add mock locations if DB doesn't have them
            const processedHospitals = res.data.map((h, i) => ({
                ...h,
                lat: h.lat || (22.5726 + (Math.random() - 0.5) * 0.1),
                lng: h.lng || (88.3639 + (Math.random() - 0.5) * 0.1),
                distance: (Math.random() * 10 + 1).toFixed(1) // Mock distance in km
            })).sort((a, b) => a.distance - b.distance);
            
            setHospitals(processedHospitals);
        } catch (error) {
            console.error("Error fetching hospitals:", error);
        } finally {
            setLoading(false);
        }
    };

    const requestEmergency = async (hospitalId) => {
        setRequestingId(hospitalId);
        try {
            const token = localStorage.getItem('token');
            await api.post('/user/emergency', { hospitalId, isCritical }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMsg('Emergency request broadcasted! Awaiting hospital confirmation.');
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error) {
            console.error("Emergency request failed", error);
            alert("Failed to send emergency request.");
        } finally {
            setRequestingId(null);
        }
    };

    if (loading) return <div className="text-center py-20">Loading map data...</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl flex items-start gap-4 shadow-sm mb-6">
                <div className="bg-red-100 p-3 rounded-full text-red-600 shrink-0">
                    <AlertTriangle size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-red-900 mb-1">Emergency Hospital Locator</h2>
                    <p className="text-red-700 font-medium leading-relaxed">
                        Find the nearest oncology-equipped hospitals. Since your last scan flagged as <strong className="text-red-900">CRITICAL</strong>, any hospital you choose will be immediately notified of an incoming priority emergency.
                    </p>
                </div>
            </div>

            {successMsg && (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl font-bold flex items-center gap-3 border border-emerald-200 shadow-sm animate-pulse">
                    <CheckCircle size={24} className="text-emerald-500" />
                    {successMsg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-[500px]">
                    <MapContainer center={patientLoc} zoom={12} style={{ height: '100%', width: '100%', borderRadius: '1.2rem' }}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
                        />
                        <Marker position={patientLoc}>
                            <Popup>
                                <div className="font-bold text-slate-800">Your Current Location</div>
                            </Popup>
                        </Marker>

                        {hospitals.map(h => (
                            <Marker key={h.id} position={[h.lat, h.lng]} icon={redIcon}>
                                <Popup>
                                    <div className="p-1">
                                        <h3 className="font-bold text-slate-900">{h.name}</h3>
                                        <p className="text-xs text-slate-500 mb-2">{h.bedsAvailable} Beds Available</p>
                                        <button 
                                            onClick={() => requestEmergency(h.id)}
                                            className="bg-red-600 text-white w-full py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                                        >
                                            Route Emergency
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Nearby Hospitals List */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
                    <div className="p-6 border-b border-slate-50 bg-slate-50">
                        <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                            <MapPin className="text-primary-600" size={20} /> Nearby Facilities
                        </h3>
                    </div>
                    <div className="p-4 overflow-y-auto flex-1 space-y-3">
                        {hospitals.length === 0 && <p className="text-center text-slate-400 py-10 font-medium">No connected hospitals found.</p>}
                        
                        {hospitals.map(h => (
                            <div key={h.id} className="p-4 rounded-2xl border border-slate-100 hover:border-red-200 hover:bg-red-50 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-900 group-hover:text-red-900 transition-colors">{h.name}</h4>
                                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-lg shrink-0">{h.distance} km</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-4">
                                    <span className="flex items-center gap-1"><Bed size={14} /> {h.bedsAvailable || 0} Beds</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> 24/7 ER</span>
                                </div>
                                <button 
                                    onClick={() => requestEmergency(h.id)}
                                    disabled={requestingId === h.id}
                                    className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:bg-slate-300"
                                >
                                    {requestingId === h.id ? 'Sending...' : <><Navigation size={16} /> Route Emergency</>}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default EmergencyLocator;
