import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    getDoctorAppointments,
    getPatientDetails,
    addPrescription,
    updatePrescription,
    addReport,
    updateReport,
    getDoctorSlots,
    approveSlot
} from '../../api/doctor';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, Pill, FileText, Activity, LogOut, ChevronLeft, Check, AlertCircle, Plus, Search, ChevronRight, X, Menu, Brain, ExternalLink, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import SOSButton from '../../components/SOSButton';
import ConsultationInterface from '../../components/ConsultationInterface';

const PreCallBrief = ({ patient, onClose, onStartCall }) => (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <header className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Pre-Consultation Briefing</h2>
                    <p className="text-slate-500 mt-1 font-medium italic">Case #CC-{patient.id.slice(-6)} • Prepared by Canqure Intelligence</p>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-colors">
                    <X size={24} className="text-slate-400" />
                </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="space-y-8">
                    <div>
                        <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-4">Patient Profile</h4>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">{patient.name}</h3>
                            <p className="text-slate-500 text-sm mt-1">45 years • Male • O+ Positive</p>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-4">Symptom History</h4>
                        <div className="space-y-3">
                            {["Chest pain for 2 weeks", "Persistent cough", "Difficulty breathing at night"].map((s, i) => (
                                <div key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="space-y-8">
                    <div>
                        <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-4">Intelligence Findings</h4>
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                            <p className="text-amber-800 text-sm font-bold leading-relaxed italic">
                                "Extracted text from PET scan indicates suspicious 3cm mass in right lower lobe. CEA levels are elevated (8.2). Prior biopsy recommended."
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-4">Reports Overview</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                                <p className="text-emerald-700 font-black text-lg">94%</p>
                                <p className="text-[10px] text-emerald-600 font-bold uppercase">Confidence</p>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                                <p className="text-indigo-700 font-black text-lg">3</p>
                                <p className="text-[10px] text-indigo-600 font-bold uppercase">Reports Scanned</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="p-8 bg-slate-900 flex justify-end gap-4">
                <button onClick={onClose} className="px-8 py-4 rounded-2xl font-black text-slate-400 hover:text-white transition-colors">
                    Close Briefing
                </button>
                <button onClick={onStartCall} className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-primary-900/40 hover:bg-primary-700 transition-all flex items-center gap-2">
                    Start Video Consult <ChevronRight size={20} />
                </button>
            </footer>
        </motion.div>
    </div>
);

const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeCall, setActiveCall] = useState(null);
    const [showBriefing, setShowBriefing] = useState(null);

    const [scheduleDate, setScheduleDate] = useState('');
    const [mySlots, setMySlots] = useState([]);

    const [prescriptionForm, setPrescriptionForm] = useState({
        medName: '',
        description: '',
        dose: '',
        frequency: '',
        startDate: '',
        endDate: ''
    });
    const [editingPrescriptionId, setEditingPrescriptionId] = useState(null);
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

    useEffect(() => {
        if (user && user.id) {
            fetchAppointments();
        }
    }, [user]);

    const fetchAppointments = async () => {
        try {
            const data = await getDoctorAppointments(user.id);
            setAppointments(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments.');
            setLoading(false);
        }
    };

    const handleViewPatient = async (patientId) => {
        try {
            setLoading(true);
            const data = await getPatientDetails(user.id, patientId);
            setSelectedPatient(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching patient details:', err);
            setError('Failed to load patient details.');
            setLoading(false);
        }
    };

    const closePatientView = () => setSelectedPatient(null);

    const handlePrescriptionSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPrescriptionId) {
                await updatePrescription(user.id, selectedPatient.id, editingPrescriptionId, prescriptionForm);
            } else {
                await addPrescription(user.id, selectedPatient.id, prescriptionForm);
            }
            await handleViewPatient(selectedPatient.id);
            setShowPrescriptionForm(false);
            setEditingPrescriptionId(null);
        } catch (err) {
            setError('Failed to save prescription.');
        }
    };

    if (loading && !selectedPatient) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Accessing Secure Records...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans relative">
            <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Activity size={20} className="text-white" />
                        </div>
                        MediPortal
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => { setActiveTab('appointments'); closePatientView(); }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group ${activeTab === 'appointments' && !selectedPatient ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Users size={20} /> Appointments
                    </button>
                    <button
                        onClick={() => { setActiveTab('schedule'); closePatientView(); }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group ${activeTab === 'schedule' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Calendar size={20} /> My Schedule
                    </button>
                </nav>
            </aside>

            <main className="flex-1 lg:ml-64 p-4 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
                {!selectedPatient ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <header className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900">Clinical Dashboard</h2>
                            <p className="text-slate-500 mt-1">Review your patient queue and manage availability.</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Patients</p>
                                <p className="text-4xl font-black text-slate-900">{appointments.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Pending Reviews</p>
                                <p className="text-4xl font-black text-indigo-600">3</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Alerts</p>
                                <p className="text-4xl font-black text-red-500">1</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-slate-800">Current Queue</h3>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Patient</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Schedule</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {appointments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                                        {apt.user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{apt.user.name}</p>
                                                        <p className="text-xs text-slate-500">{apt.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm font-medium text-slate-900">{apt.time}</p>
                                                <p className="text-xs text-slate-500">{new Date(apt.date).toLocaleDateString()}</p>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button 
                                                        onClick={async () => {
                                                            const details = await getPatientDetails(user.id, apt.userId);
                                                            setShowBriefing({ ...details, appointmentId: apt.id });
                                                        }} 
                                                        className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-1"
                                                    >
                                                        <FileText size={14} /> Review Brief
                                                    </button>
                                                    <button 
                                                        onClick={() => handleViewPatient(apt.userId)} 
                                                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                                    >
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <button onClick={closePatientView} className="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
                            <ChevronLeft size={20} /> Back to Queue
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900">{selectedPatient.name}</h2>
                                            <p className="text-slate-500">Patient History & Active Prescriptions</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">Patient ID: {selectedPatient.id.slice(-6)}</span>
                                        </div>
                                    </div>

                                    {/* AI Insights Section */}
                                    <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
                                        <Brain size={80} className="absolute -right-4 -bottom-4 opacity-10" />
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                                <Brain size={20} className="text-indigo-300" />
                                            </div>
                                            <h3 className="font-bold">AI Medicine Extraction (from Reports)</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedPatient.Reports?.some(r => r.extractedMedicines?.length > 0) ? (
                                                selectedPatient.Reports.flatMap(r => r.extractedMedicines || []).map((med, idx) => (
                                                    <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/10 p-3 rounded-xl flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold text-sm">{med.name}</p>
                                                            <p className="text-[10px] text-indigo-200">{med.dosage} • {med.frequency}</p>
                                                        </div>
                                                        {med.needsReview && <ShieldAlert size={16} className="text-orange-400" />}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-indigo-200 text-sm italic col-span-2">No medicines detected in recent OCR scans.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-lg text-slate-800">Current Medications</h3>
                                            <button onClick={() => setShowPrescriptionForm(true)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedPatient.medicines?.map((med) => (
                                                <div key={med.medId} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:border-indigo-200 transition-colors">
                                                    <div className="flex justify-between mb-2">
                                                        <p className="font-bold text-slate-900">{med.medName}</p>
                                                        <p className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{med.dose}</p>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed">{med.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <FileText size={20} className="text-emerald-500" /> Medical Vault
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedPatient.Reports?.map((report) => (
                                            <div key={report.id} className="p-4 border border-slate-50 rounded-xl bg-slate-50/50 flex justify-between items-center group">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                                                        <FileText size={16} className="text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 truncate max-w-[120px]">{report.reportName}</p>
                                                        <p className="text-[10px] text-slate-400">{new Date(report.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <a href={report.reportUrl} target="_blank" className="p-2 bg-white rounded-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ExternalLink size={14} className="text-indigo-600" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
            <AnimatePresence>
                {showBriefing && (
                    <PreCallBrief 
                        patient={showBriefing} 
                        onClose={() => setShowBriefing(null)} 
                        onStartCall={() => {
                            setActiveCall({ ...showBriefing, id: showBriefing.appointmentId });
                            setShowBriefing(null);
                        }}
                    />
                )}
            </AnimatePresence>

            {activeCall && (
                <ConsultationInterface 
                    appointment={activeCall} 
                    onComplete={() => {
                        setActiveCall(null);
                        fetchAppointments();
                    }}
                    onCancel={() => setActiveCall(null)}
                />
            )}

            <SOSButton />
        </div>
    );
};

export default DoctorDashboard;