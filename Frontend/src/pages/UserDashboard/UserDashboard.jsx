import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardData, getDoctors, bookAppointment, getDoctorAvailability } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Calendar, 
    FileText, 
    Pill, 
    LogOut, 
    User, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    Plus, 
    Search, 
    ChevronRight, 
    Menu, 
    X, 
    Scan, 
    ShieldAlert, 
    Database, 
    Activity,
    UploadCloud,
    TrendingUp,
    Users,
    Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import SOSButton from '../../components/SOSButton';
import MedicinalRecord from '../../components/MedicinalRecord';
import RiskAssessment from '../RiskAssessment/RiskAssessment';
import ReportHistory from '../ReportHistory/ReportHistory';
import UploadReport from '../../components/UploadReport';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
    }, [activeTab]);

    const handleUploadSuccess = () => {
        setActiveTab('vault');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <header className="flex justify-between items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Hello, {user?.name} 👋</h2>
                                <p className="text-slate-500 mt-2 text-lg">Your health ecosystem is live and monitored.</p>
                            </div>
                            <div className="hidden md:flex gap-4">
                                <button onClick={() => setActiveTab('upload')} className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center gap-2">
                                    <UploadCloud size={20} /> Quick Upload
                                </button>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { title: 'Active Meds', count: dashboardData?.medicines?.length || 0, icon: Pill, color: 'blue' },
                                { title: 'Reports', count: dashboardData?.Reports?.length || 0, icon: FileText, color: 'emerald' },
                                { title: 'Upcoming', count: dashboardData?.Appointments?.length || 0, icon: Calendar, color: 'purple' },
                                { title: 'Risk Score', count: 'Stable', icon: TrendingUp, color: 'amber' }
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:border-primary-200 transition-all duration-300 flex flex-col justify-between">
                                    <div>
                                        <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
                                            <stat.icon size={24} />
                                        </div>
                                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.title}</p>
                                        <p className="text-2xl font-black text-slate-900 mt-1">{stat.count}</p>
                                    </div>
                                    {stat.title === 'Reports' && (
                                        <button onClick={() => setActiveTab('upload')} className="mt-4 text-xs font-bold text-primary-600 flex items-center gap-1 hover:underline">
                                            <Plus size={14} /> Smart Scan
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                {dashboardData?.Appointments?.find(a => a.status === 'COMPLETED' && a.patientRoadmap) && (
                                    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                                        <Brain size={120} className="absolute -right-8 -bottom-8 opacity-10" />
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                                    <Brain size={20} className="text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold">Latest Doctor Roadmap</h3>
                                            </div>
                                            <div className="space-y-4">
                                                {dashboardData.Appointments.find(a => a.status === 'COMPLETED').patientRoadmap.map((step, i) => (
                                                    <div key={i} className="flex gap-4 items-start bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                                        <div className="w-6 h-6 rounded-full bg-white text-primary-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                                            {i + 1}
                                                        </div>
                                                        <p className="text-sm font-medium leading-relaxed">{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="mt-8 text-xs font-bold text-primary-100 flex items-center gap-2 hover:text-white transition-colors">
                                                View Full Visit Summary <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                        <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
                                            <Calendar className="text-primary-600" /> Recent Schedule
                                        </h3>
                                    </div>
                                    <div className="p-8">
                                        {dashboardData?.Appointments?.length > 0 ? (
                                            <div className="space-y-4">
                                                {dashboardData.Appointments.slice(0, 3).map((apt) => (
                                                    <div key={apt.id} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary-600 shrink-0">
                                                            <Calendar size={20} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-slate-900 truncate">Dr. {apt.doctor?.name}</h4>
                                                            <p className="text-sm text-slate-500 truncate">{apt.doctor?.specialist}</p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="font-black text-slate-800">{apt.time}</p>
                                                            <p className="text-xs text-slate-500 font-bold">{new Date(apt.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                <p className="text-slate-400 font-medium">No appointments found. Book one to start.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute -right-8 -bottom-8 opacity-10">
                                        <Activity size={180} />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4">AI Risk Analyzer</h3>
                                    <p className="text-slate-400 mb-8 leading-relaxed">Instantly analyze your clinical data using our pre-trained ML model.</p>
                                    <button onClick={() => setActiveTab('risk')} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black hover:bg-primary-50 transition-all flex items-center justify-center gap-2">
                                        Run Prediction <ChevronRight size={20} />
                                    </button>
                                </div>
                                
                                <div className="bg-primary-50 rounded-3xl p-8 border border-primary-100">
                                    <h3 className="text-primary-900 font-black text-lg mb-2">Need Help?</h3>
                                    <p className="text-primary-700 text-sm mb-4">Our specialized cancer care experts are available for consultations.</p>
                                    <button onClick={() => setActiveTab('book')} className="text-primary-700 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                        Book Now <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'upload':
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-8">
                        <header className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900">Medical Report Vault</h2>
                            <p className="text-slate-500">Upload your blood reports, biopsy, or prescriptions for AI extraction.</p>
                        </header>
                        <UploadReport onUploadSuccess={handleUploadSuccess} />
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <ShieldAlert size={18} className="text-amber-500" /> Security Note
                            </h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Your reports are encrypted and stored in your private Google Drive vault. Only you and authorized medical staff can access them.
                            </p>
                        </div>
                    </motion.div>
                );
            case 'appointments':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900">Schedules</h3>
                                <p className="text-slate-500">Track and manage your upcoming visits.</p>
                            </div>
                            <button onClick={() => setActiveTab('book')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                                <Plus size={18} /> New Appointment
                            </button>
                        </div>
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {dashboardData?.Appointments?.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-6">
                                                <p className="font-bold text-slate-900">Dr. {apt.doctor?.name}</p>
                                                <p className="text-xs text-slate-500">{apt.doctor?.specialist}</p>
                                            </td>
                                            <td className="p-6">
                                                <p className="font-bold text-slate-900">{apt.time}</p>
                                                <p className="text-xs text-slate-500">{new Date(apt.date).toLocaleDateString()}</p>
                                            </td>
                                            <td className="p-6">
                                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Confirmed</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                );
            case 'prescriptions':
                return <MedicinalRecord user={user} />;
            case 'risk':
                return <RiskAssessment />;
            case 'vault':
                return <ReportHistory />;
            case 'journey':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <header className="mb-10">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Care Journey</h2>
                            <p className="text-slate-500 mt-2 text-lg">Your longitudinal clinical history, mapped chronologically.</p>
                        </header>

                        <div className="relative border-l-2 border-slate-200 ml-6 space-y-12 pb-12">
                            {[
                                { 
                                    date: 'Today', 
                                    title: 'Consultation with Dr. Sarah Wilson', 
                                    type: 'CONSULT', 
                                    desc: 'Discussed chemotherapy cycle 1 side effects.',
                                    icon: Users,
                                    color: 'primary'
                                },
                                { 
                                    date: '2 Days Ago', 
                                    title: 'PET-CT Scan Uploaded', 
                                    type: 'REPORT', 
                                    desc: 'AI extracted 3cm mass in lower lobe. Priority flagged.',
                                    icon: FileText,
                                    color: 'emerald'
                                },
                                { 
                                    date: 'Last Week', 
                                    title: 'Started New Medication', 
                                    type: 'MEDS', 
                                    desc: 'Prescribed: Medication Z (500mg). Status: Ongoing.',
                                    icon: Pill,
                                    color: 'amber'
                                },
                                { 
                                    date: 'Oct 12, 2024', 
                                    title: 'First Symptom Logged', 
                                    type: 'INTAKE', 
                                    desc: 'Patient reported persistent chest pain and cough.',
                                    icon: Activity,
                                    color: 'slate'
                                }
                            ].map((event, idx) => (
                                <div key={idx} className="relative pl-12 group">
                                    <div className={`absolute -left-[33px] top-0 w-16 h-16 rounded-2xl bg-${event.color === 'primary' ? 'indigo' : event.color}-600 border-4 border-white shadow-xl flex items-center justify-center text-white transition-transform group-hover:scale-110`}>
                                        <event.icon size={24} />
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                                        <span className={`text-xs font-black text-${event.color === 'primary' ? 'indigo' : event.color}-600 uppercase tracking-widest mb-2 block`}>{event.date} • {event.type}</span>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                                        <p className="text-slate-500 leading-relaxed">{event.desc}</p>
                                        <button className="mt-6 text-sm font-bold text-slate-400 hover:text-primary-600 flex items-center gap-2 transition-colors">
                                            View Details <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'circle':
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                        <header className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Circle of Care</h2>
                                <p className="text-slate-500 mt-2 text-lg">Manage family access and caregiver coordination.</p>
                            </div>
                            <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                                <Plus size={20} /> Invite Caregiver
                            </button>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-primary-200 transition-all">
                                <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-black text-2xl border-4 border-white shadow-lg">
                                    A
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900">Anjali Bhunia</h3>
                                    <p className="text-slate-500 font-medium">Primary Caregiver • Spouse</p>
                                    <div className="mt-4 flex gap-2">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Can View Reports</span>
                                        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full">Can Book Slots</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-primary-200 transition-all cursor-pointer">
                                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-300 group-hover:text-primary-600 transition-colors mb-4 shadow-sm">
                                    <Plus size={32} />
                                </div>
                                <p className="text-slate-400 font-bold group-hover:text-slate-600 transition-colors">Add another family member</p>
                            </div>
                        </div>

                        <div className="bg-primary-50 rounded-3xl p-8 border border-primary-100 flex items-start gap-6">
                            <div className="p-4 bg-white rounded-2xl shadow-sm text-primary-600">
                                <ShieldAlert size={32} />
                            </div>
                            <div>
                                <h4 className="text-primary-900 font-black text-lg mb-2">Privacy & Control</h4>
                                <p className="text-primary-700 leading-relaxed font-medium">
                                    You have full control over what your circle can see. You can revoke access or change permissions at any time. Your medical history is encrypted and shared only via secure tokens.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans relative">
            <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-white font-black text-2xl tracking-tighter">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <span className="text-white text-xl font-black">C</span>
                        </div>
                        CanQure
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'upload', icon: UploadCloud, label: 'Report Upload' },
                        { id: 'risk', icon: Activity, label: 'AI Risk Prediction' },
                        { id: 'journey', icon: TrendingUp, label: 'My Journey' },
                        { id: 'circle', icon: User, label: 'Circle of Care' },
                        { id: 'vault', icon: Database, label: 'Medical Vault' },
                        { id: 'prescriptions', icon: Pill, label: 'My Medicines' },
                        { id: 'appointments', icon: Calendar, label: 'Schedules' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); }}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all duration-200 group ${activeTab === item.id
                                ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/40'
                                : 'text-slate-500 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={22} className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-colors">
                        <LogOut size={22} /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 lg:ml-72 p-6 lg:p-12 max-w-7xl mx-auto w-full min-w-0">
                {renderContent()}
            </main>
            <SOSButton />
        </div>
    );
};

export default UserDashboard;