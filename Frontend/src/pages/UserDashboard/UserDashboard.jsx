import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardData, getDoctors, bookAppointment, getDoctorAvailability } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, Pill, LogOut, User, Clock, CheckCircle, AlertCircle, Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

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
            <div className="flex items-center gap-3 text-primary-600 font-medium">
                <div className="animate-spin"><LayoutDashboard size={24} /></div>
                Loading dashboard...
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-red-500 font-medium flex items-center gap-2">
                <AlertCircle size={20} /> {error}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <header className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}</h2>
                            <p className="text-slate-500">Here's an overview of your health records</p>
                        </header>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-medium">Appointments</p>
                                    <p className="text-2xl font-bold text-slate-900">{dashboardData?.Appointments?.length || 0}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <Pill size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-medium">Prescriptions</p>
                                    <p className="text-2xl font-bold text-slate-900">{dashboardData?.medicines?.length || 0}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-medium">Lab Reports</p>
                                    <p className="text-2xl font-bold text-slate-900">{dashboardData?.Reports?.length || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity or Quick Actions could go here */}
                    </motion.div>
                );
            case 'appointments':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">My Appointments</h3>
                            <button onClick={() => setActiveTab('book')} className="btn btn-primary text-sm py-2">
                                <Plus size={16} /> Book New
                            </button>
                        </div>

                        {dashboardData?.Appointments?.length > 0 ? (
                            <div className="card overflow-hidden p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                            <tr>
                                                <th className="p-4">Doctor</th>
                                                <th className="p-4">Specialist</th>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Time</th>
                                                <th className="p-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dashboardData.Appointments.map((apt) => (
                                                <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 font-medium text-slate-900">{apt.doctor?.name}</td>
                                                    <td className="p-4 text-slate-600">{apt.doctor?.specialist}</td>
                                                    <td className="p-4 text-slate-600 flex items-center gap-2">
                                                        <Calendar size={14} className="text-slate-400" />
                                                        {new Date(apt.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4 text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={14} className="text-slate-400" />
                                                            {apt.time}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold border border-green-200">
                                                            Confirmed
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                                <Calendar className="mx-auto text-slate-300 mb-3" size={48} />
                                <p className="text-slate-500">No appointments scheduled.</p>
                                <button onClick={() => setActiveTab('book')} className="mt-4 btn btn-secondary text-sm">
                                    Book Now
                                </button>
                            </div>
                        )}
                    </motion.div>
                );
            case 'book':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Book an Appointment</h3>
                            
                            <div className="card">
                                <form onSubmit={handleBookingSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="input-group">
                                            <label className="input-label">Select Doctor</label>
                                            <select
                                                name="doctorId"
                                                value={bookingData.doctorId}
                                                onChange={handleBookingChange}
                                                required
                                                className="input-field"
                                            >
                                                <option value="">-- Select Doctor --</option>
                                                {doctors.map(doc => (
                                                    <option key={doc.doctorId} value={doc.doctorId}>
                                                        {doc.name} ({doc.specialist})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Date</label>
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
                                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                            <AlertCircle size={16} />
                                            Doctor is fully booked for this date.
                                        </div>
                                    )}

                                    <div className="input-group">
                                        <label className="input-label">Time Slot</label>
                                        <select
                                            name="time"
                                            value={bookingData.time}
                                            onChange={handleBookingChange}
                                            required
                                            disabled={!bookingData.date || availability.availableSlots.length === 0}
                                            className="input-field disabled:bg-slate-100 disabled:text-slate-400"
                                        >
                                            <option value="">-- Select Time Slot --</option>
                                            {availability.availableSlots.map(slot => (
                                                <option key={slot} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                        {bookingData.date && availability.availableSlots.length === 0 && !availability.isFull && (
                                            <p className="text-slate-500 text-xs mt-2 ml-1">No available slots for selected date.</p>
                                        )}
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
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full justify-center"
                                        disabled={availability.isFull || !bookingData.time || bookingStatus === 'Booking...'}
                                        style={availability.isFull ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                    >
                                        {bookingStatus === 'Booking...' ? 'Processing...' : 'Confirm Booking'}
                                    </button>

                                    {bookingStatus && bookingStatus !== 'Booking...' && (
                                        <div className={`p-4 rounded-xl flex items-center gap-2 ${bookingStatus.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {bookingStatus.includes('success') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                            <span className="font-medium">{bookingStatus}</span>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'prescriptions':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="text-xl font-bold text-slate-800 mb-6">My Prescriptions</h3>
                        {dashboardData?.medicines?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {dashboardData.medicines.map((med) => (
                                    <div key={med.medId} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                                <Pill size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{med.medName}</h4>
                                                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Active</span>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Dosage</label>
                                                    <p className="font-medium text-slate-700">{med.dose}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Frequency</label>
                                                    <p className="font-medium text-slate-700">{med.frequency}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Duration</label>
                                                <p className="font-medium text-slate-700 text-sm">
                                                    {new Date(med.startDate).toLocaleDateString()} - {new Date(med.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Instructions</label>
                                                <p className="text-slate-600 text-sm bg-slate-50 p-2 rounded-lg mt-1">{med.description}</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                                            Prescribed by Dr. {med.doctor?.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                                <Pill className="mx-auto text-slate-300 mb-3" size={48} />
                                <p className="text-slate-500">No prescriptions found.</p>
                            </div>
                        )}
                    </motion.div>
                );
            case 'reports':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Medical Reports</h3>
                        {dashboardData?.Reports?.length > 0 ? (
                            <div className="card overflow-hidden p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                            <tr>
                                                <th className="p-4">Report Name</th>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Doctor</th>
                                                <th className="p-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dashboardData.Reports.map((report) => (
                                                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 font-medium text-slate-900 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-orange-50 text-orange-600 flex items-center justify-center">
                                                            <FileText size={16} />
                                                        </div>
                                                        {report.reportName}
                                                    </td>
                                                    <td className="p-4 text-slate-600 max-w-xs">{new Date(report.date).toLocaleDateString()}</td>
                                                    <td className="p-4 text-slate-600">{report.doctor?.name}</td>
                                                    <td className="p-4 text-right">
                                                        <a href={report.reportUrl || '#'} className="text-primary-600 hover:text-primary-700 font-medium text-sm">View</a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                                <FileText className="mx-auto text-slate-300 mb-3" size={48} />
                                <p className="text-slate-500">No reports found.</p>
                            </div>
                        )}
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-slate-200 md:h-screen sticky top-0 md:fixed z-10 flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-primary-600 font-bold text-xl">
                        <LayoutDashboard size={24} />
                        <span>Patient Portal</span>
                    </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            activeTab === 'overview' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <LayoutDashboard size={20} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('book')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            activeTab === 'book' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Calendar size={20} /> Book Appointment
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            activeTab === 'appointments' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Clock size={20} /> My Appointments
                    </button>
                    <button
                        onClick={() => setActiveTab('prescriptions')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            activeTab === 'prescriptions' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Pill size={20} /> Prescriptions
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            activeTab === 'reports' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <FileText size={20} /> Medical Reports
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default UserDashboard;