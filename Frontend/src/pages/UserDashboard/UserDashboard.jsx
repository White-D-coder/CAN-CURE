import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardData, getDoctors, bookAppointment, getDoctorAvailability } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, Pill, LogOut, User, Clock, CheckCircle, AlertCircle, Plus, Search, ChevronRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingData, setBookingData] = useState({
        doctorId: '',
        date: '',
        time: '',
        patientName: user?.name || ''
    });
    const [bookingStatus, setBookingStatus] = useState('');

    const [availability, setAvailability] = useState({ isFull: false, availableSlots: [] });
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDashboardData();
                setDashboardData(data);
                const docs = await getDoctors();
                setDoctors(docs);
            } catch (err) {
                setError("Failed to load dashboard data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const checkAvailability = async () => {
            if (bookingData.doctorId && bookingData.date) {
                setCheckingAvailability(true);
                try {
                    const data = await getDoctorAvailability(bookingData.doctorId, bookingData.date);
                    setAvailability(data);
                    if (bookingData.time && !data.availableSlots.includes(bookingData.time)) {
                        setBookingData(prev => ({ ...prev, time: '' }));
                    }
                } catch (err) {
                    console.error("Failed to check availability", err);
                    setAvailability({ isFull: false, availableSlots: [] });
                } finally {
                    setCheckingAvailability(false);
                }
            } else {
                setAvailability({ isFull: false, availableSlots: [] });
            }
        };

        checkAvailability();
    }, [bookingData.doctorId, bookingData.date]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleBookingChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingStatus('Booking...');
        try {
            await bookAppointment(bookingData);
            setBookingStatus('Appointment booked successfully!');
            const data = await getDashboardData();
            setDashboardData(data);
            setBookingData({ doctorId: '', date: '', time: '', patientName: user?.name || '' });
            if (bookingData.doctorId && bookingData.date) {
                const avail = await getDoctorAvailability(bookingData.doctorId, bookingData.date);
                setAvailability(avail);
            }
            setTimeout(() => setBookingStatus(''), 3000);
        } catch (err) {
            setBookingStatus(err.response?.data?.message || 'Failed to book appointment.');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Loading your health portal...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h3>
                <p className="text-slate-500 mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary w-full">Try Again</button>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <header className="flex justify-between items-end border-b border-slate-200 pb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.name}</h2>
                                
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Current Date</p>
                                <p className="text-lg font-medium text-slate-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </header>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Appointments', count: dashboardData?.Appointments?.length || 0, icon: Calendar, color: 'blue' },
                                { title: 'Prescriptions', count: dashboardData?.medicines?.length || 0, icon: Pill, color: 'emerald' },
                                { title: 'Lab Reports', count: dashboardData?.Reports?.length || 0, icon: FileText, color: 'purple' }
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all duration-300">
                                    <div>
                                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
                                        <p className="text-4xl font-bold text-slate-900">{stat.count}</p>
                                    </div>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-100`}>
                                        <stat.icon size={28} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 text-lg">Upcoming Appointments</h3>
                                    <button onClick={() => setActiveTab('appointments')} className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
                                        View All <ChevronRight size={16} />
                                    </button>
                                </div>
                                <div className="p-6">
                                    {dashboardData?.Appointments?.length > 0 ? (
                                        <div className="space-y-4">
                                            {dashboardData.Appointments.slice(0, 3).map((apt) => (
                                                <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary-600 shrink-0">
                                                        <Calendar size={20} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-slate-900 truncate">Dr. {apt.doctor?.name}</h4>
                                                        <p className="text-sm text-slate-500 truncate">{apt.doctor?.specialist}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="font-bold text-slate-800">{apt.time}</p>
                                                        <p className="text-xs text-slate-500">{new Date(apt.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-slate-400">
                                            <p>No upcoming appointments.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl shadow-lg shadow-primary-200 text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <LayoutDashboard size={120} />
                                </div>
                                <div className="p-8 relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Need a Checkup?</h3>
                                        <p className="text-primary-100 max-w-sm">Schedule an appointment with our specialists today. Quick and easy booking.</p>
                                    </div>
                                    <button onClick={() => setActiveTab('book')} className="mt-6 bg-white text-primary-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all self-start flex items-center gap-2">
                                        <Plus size={18} /> Book Appointment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'appointments':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">My Appointments</h3>
                                <p className="text-slate-500">Manage and view your scheduled visits.</p>
                            </div>
                            <button onClick={() => setActiveTab('book')} className="btn btn-primary shadow-lg shadow-primary-200">
                                <Plus size={18} /> Book New
                            </button>
                        </div>

                        {dashboardData?.Appointments?.length > 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor</th>
                                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dashboardData.Appointments.map((apt) => (
                                                <tr key={apt.id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                                                                {apt.doctor?.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900">Dr. {apt.doctor?.name}</p>
                                                                <p className="text-xs text-slate-500">{apt.doctor?.specialist}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-slate-900">{new Date(apt.date).toLocaleDateString()}</span>
                                                            <span className="text-xs text-slate-500">{apt.time}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                            Confirmed
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <button className="text-slate-400 hover:text-primary-600 transition-colors">
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="text-slate-400" size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">No appointments yet</h4>
                                <p className="text-slate-500 mb-6">Schedule your first visit with a specialist.</p>
                                <button onClick={() => setActiveTab('book')} className="btn btn-secondary">
                                    Book Now
                                </button>
                            </div>
                        )}
                    </motion.div>
                );
            case 'book':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Book an Appointment</h3>
                        <p className="text-slate-500 mb-8">Fill in the details below to schedule your visit.</p>
                        
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                            <div className="p-8 md:w-2/3">
                                <form onSubmit={handleBookingSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="input-group">
                                            <label className="input-label">Select Specialist</label>
                                            <div className="relative">
                                                <Search className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
                                                <select
                                                    name="doctorId"
                                                    value={bookingData.doctorId}
                                                    onChange={handleBookingChange}
                                                    required
                                                    className="input-field pl-11"
                                                >
                                                    <option value="">Choose a doctor...</option>
                                                    {doctors.map(doc => (
                                                        <option key={doc.doctorId} value={doc.doctorId}>
                                                            {doc.name} ({doc.specialist})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Preferred Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={bookingData.date}
                                                onChange={handleBookingChange}
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                    
                                    {availability.isFull && (
                                        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2 animate-pulse">
                                            <AlertCircle size={18} />
                                            Doctor is fully booked for this date. Please try another day.
                                        </div>
                                    )}

                                    <div className="input-group">
                                        <label className="input-label">Available Time Slots</label>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                                            {bookingData.date && availability.availableSlots.length > 0 ? (
                                                availability.availableSlots.map(slot => (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => setBookingData({...bookingData, time: slot})}
                                                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                                                            bookingData.time === slot 
                                                            ? 'bg-primary-600 text-white border-primary-600 shadow-md ring-2 ring-primary-100' 
                                                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                                                    {bookingData.date ? "No slots available for this date." : "Select a doctor and date first."}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Patient Name</label>
                                        <input
                                            type="text"
                                            name="patientName"
                                            value={bookingData.patientName}
                                            onChange={handleBookingChange}
                                            required
                                            className="input-field"
                                            placeholder="Enter patient's full name"
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-full py-4 text-base shadow-xl shadow-primary-200/50"
                                            disabled={availability.isFull || !bookingData.time || bookingStatus === 'Booking...'}
                                            style={availability.isFull ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                        >
                                            {bookingStatus === 'Booking...' ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Confirming...
                                                </span>
                                            ) : 'Confirm Appointment'}
                                        </button>
                                    </div>

                                    {bookingStatus && bookingStatus !== 'Booking...' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl flex items-center gap-3 ${bookingStatus.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                            {bookingStatus.includes('success') ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                                            <span className="font-medium text-sm">{bookingStatus}</span>
                                        </motion.div>
                                    )}
                                </form>
                            </div>
                            <div className="bg-slate-50 p-8 md:w-1/3 border-t md:border-t-0 md:border-l border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4">Summary</h4>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider mb-1">Doctor</span>
                                        <p className="font-medium text-slate-900">{doctors.find(d => d.doctorId === bookingData.doctorId)?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider mb-1">Date</span>
                                        <p className="font-medium text-slate-900">{bookingData.date ? new Date(bookingData.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider mb-1">Time</span>
                                        <p className="font-medium text-slate-900">{bookingData.time || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider mb-1">Patient</span>
                                        <p className="font-medium text-slate-900">{bookingData.patientName || '-'}</p>
                                    </div>
                                </div>
                                <div className="mt-8 bg-blue-50 p-4 rounded-xl text-blue-700 text-xs leading-relaxed">
                                    <p className="flex gap-2">
                                        <Clock size={14} className="shrink-0 mt-0.5" />
                                        Please arrive 15 minutes before your scheduled appointment time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'prescriptions':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">My Prescriptions</h3>
                        {dashboardData?.medicines?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {dashboardData.medicines.map((med) => (
                                    <div key={med.medId} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                                        <div className="bg-gradient-to-r from-slate-50 to-white p-5 border-b border-slate-100 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm text-primary-500">
                                                <Pill size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg group-hover:text-primary-600 transition-colors">{med.medName}</h4>
                                                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mt-1">Active</span>
                                            </div>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-50 p-3 rounded-lg">
                                                    <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1">Dosage</label>
                                                    <p className="font-semibold text-slate-700">{med.dose}</p>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-lg">
                                                    <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1">Frequency</label>
                                                    <p className="font-semibold text-slate-700">{med.frequency}</p>
                                                </div>
                                            </div>
                                            <div className="px-1">
                                                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1">Duration</label>
                                                <p className="font-medium text-slate-700 text-sm">
                                                    {new Date(med.startDate).toLocaleDateString()} - {new Date(med.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="px-1">
                                                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1">Instructions</label>
                                                <p className="text-slate-600 text-sm leading-relaxed">{med.description}</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-3 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center gap-2">
                                            <User size={12} />
                                            Prescribed by Dr. {med.doctor?.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Pill className="text-slate-400" size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">No prescriptions found</h4>
                                <p className="text-slate-500">Your prescribed medications will appear here.</p>
                            </div>
                        )}
                    </motion.div>
                );
            case 'reports':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Medical Reports</h3>
                        {dashboardData?.Reports?.length > 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Report Name</th>
                                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor</th>
                                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dashboardData.Reports.map((report) => (
                                                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                                                                <FileText size={20} />
                                                            </div>
                                                            <span className="font-bold text-slate-900">{report.reportName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-slate-600 font-medium">{new Date(report.date).toLocaleDateString()}</td>
                                                    <td className="p-5 text-slate-600">Dr. {report.doctor?.name}</td>
                                                    <td className="p-5 text-right">
                                                        <a 
                                                            href={report.reportUrl || '#'} 
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                                                        >
                                                            View Report
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="text-slate-400" size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">No reports found</h4>
                                <p className="text-slate-500">Lab examinations and reports will be listed here.</p>
                            </div>
                        )}
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans relative">
            
            {/* Mobile Sidebar Overlay */}
             {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
             )}

            <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <span className="text-white text-lg font-black">C</span>
                        </div>
                        CanCure
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'book', icon: Plus, label: 'Book Appointment' },
                        { id: 'appointments', icon: Calendar, label: 'My Appointments' },
                        { id: 'prescriptions', icon: Pill, label: 'Prescriptions' },
                        { id: 'reports', icon: FileText, label: 'Medical Reports' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group ${
                                activeTab === item.id 
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>


            <main className="flex-1 lg:ml-64 p-4 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                            <span className="text-white text-lg font-black">C</span>
                        </div>
                        CanCure
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Menu size={24} />
                    </button>
                </div>
                {renderContent()}
            </main>
        </div>
    );
};

export default UserDashboard;