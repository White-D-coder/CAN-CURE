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
import { Calendar, Users, Clock, Pill, FileText, Activity, LogOut, ChevronLeft, Check, AlertCircle, Plus, Search, ChevronRight, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import SOSButton from '../../components/SOSButton';

const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


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


    const [reportForm, setReportForm] = useState({
        reportName: '',
        reportUrl: ''
    });
    const [editingReportId, setEditingReportId] = useState(null);
    const [showReportForm, setShowReportForm] = useState(false);

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


    const fetchMySlots = async () => {
        if (!user.id || !scheduleDate) return;
        try {
            const slots = await getDoctorSlots(user.id, scheduleDate);
            setMySlots(slots);
        } catch (err) {
            console.error("Error fetching slots:", err);
        }
    };

    useEffect(() => {
        if (activeTab === 'schedule') {
            fetchMySlots();
        }
    }, [scheduleDate, activeTab]);

    const handleApproveSlot = async (slotId) => {
        try {
            await approveSlot(slotId);
            fetchMySlots();
        } catch (err) {
            console.error("Error approving slot:", err);
            setError("Failed to approve slot");
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

    const closePatientView = () => {
        setSelectedPatient(null);
        setShowPrescriptionForm(false);
        setEditingPrescriptionId(null);
        setPrescriptionForm({
            medName: '',
            description: '',
            dose: '',
            frequency: '',
            startDate: '',
            endDate: ''
        });
        setShowReportForm(false);
        setEditingReportId(null);
        setReportForm({
            reportName: '',
            reportUrl: ''
        });
    };

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
            setPrescriptionForm({
                medName: '',
                description: '',
                dose: '',
                frequency: '',
                startDate: '',
                endDate: ''
            });
        } catch (err) {
            console.error('Error saving prescription:', err);
            setError('Failed to save prescription.');
        }
    };

    const handleEditPrescription = (med) => {
        setPrescriptionForm({
            medName: med.medName,
            description: med.description,
            dose: med.dose,
            frequency: med.frequency,
            startDate: med.startDate.split('T')[0],
            endDate: med.endDate.split('T')[0]
        });
        setEditingPrescriptionId(med.medId);
        setShowPrescriptionForm(true);
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        try {
            const reportData = {
                ...reportForm,
                userId: selectedPatient.id,
                doctorId: user.id
            };

            if (editingReportId) {
                await updateReport(editingReportId, reportData);
            } else {
                await addReport(reportData);
            }
            await handleViewPatient(selectedPatient.id);
            setShowReportForm(false);
            setEditingReportId(null);
            setReportForm({ reportName: '', reportUrl: '' });
        } catch (err) {
            console.error('Error saving report:', err);
            setError('Failed to save report.');
        }
    };

    const handleEditReport = (report) => {
        setReportForm({
            reportName: report.reportName,
            reportUrl: report.reportUrl
        });
        setEditingReportId(report.reportId);
        setShowReportForm(true);
    };

    if (loading && !selectedPatient) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading portal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans relative">

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}


            <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Activity size={20} className="text-white" />
                        </div>
                        MediPortal
                    </div>

                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => { setActiveTab('appointments'); closePatientView(); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group ${activeTab === 'appointments' && !selectedPatient
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <Users size={20} className={activeTab === 'appointments' && !selectedPatient ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
                        Appointments
                    </button>
                    <button
                        onClick={() => { setActiveTab('schedule'); closePatientView(); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group ${activeTab === 'schedule'
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <Calendar size={20} className={activeTab === 'schedule' ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
                        My Schedule
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 lg:ml-64 p-4 lg:p-8 max-w-7xl mx-auto w-full min-w-0">

                <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center">
                            <Activity size={18} className="text-white" />
                        </div>
                        MediPortal
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Menu size={24} />
                    </button>
                </div>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 p-4 mb-6 rounded-xl flex items-center gap-3 text-red-700 shadow-sm">
                        <AlertCircle size={20} />
                        <p className="font-medium">{error}</p>
                    </motion.div>
                )}

                {!selectedPatient ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        {activeTab === 'appointments' ? (
                            <>
                                <header className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
                                        <p className="text-slate-500 mt-1">Manage your patient visits for today.</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm font-medium text-slate-600 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Today: {appointments.length}
                                    </div>
                                </header>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    {appointments.length === 0 ? (
                                        <div className="text-center py-24 bg-white">
                                            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <Users className="text-slate-300" size={40} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">No appointments yet</h3>
                                            <p className="text-slate-500">Your schedule for upcoming appointments will appear here.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50 border-b border-slate-200">
                                                    <tr>
                                                        <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Details</th>
                                                        <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                                        <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                                        <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {appointments.map((apt) => (
                                                        <tr key={apt.id} className="hover:bg-slate-50 transition-colors group">
                                                            <td className="p-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm">
                                                                        {apt.user.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-slate-900">{apt.user.name}</p>
                                                                        <p className="text-xs text-slate-500">ID: #{apt.userId}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-5">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                                                        <Calendar size={14} className="text-slate-400" />
                                                                        {new Date(apt.date).toLocaleDateString()}
                                                                    </span>
                                                                    <span className="text-xs text-slate-500 flex items-center gap-2">
                                                                        <Clock size={14} className="text-slate-400" />
                                                                        {apt.time}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="p-5">
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                                    Confirmed
                                                                </span>
                                                            </td>
                                                            <td className="p-5 text-right">
                                                                <button
                                                                    onClick={() => handleViewPatient(apt.userId)}
                                                                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 ml-auto group-hover:underline decoration-primary-300 underline-offset-4 decoration-2"
                                                                >
                                                                    Open Record <ChevronRight size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6">
                                <header className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Manage Schedule</h2>
                                        <p className="text-slate-500 mt-1">Set your availability for patient bookings.</p>
                                    </div>
                                    <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={scheduleDate}
                                            onChange={(e) => setScheduleDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 py-2 px-3"
                                        />
                                    </div>
                                </header>

                                {!scheduleDate ? (
                                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                            <Calendar className="text-slate-300" size={40} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">Select a Date</h3>
                                        <p className="text-slate-500">Choose a date from the picker to view or manage your time slots.</p>
                                    </div>
                                ) : (
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                        {mySlots.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-slate-500 font-medium">No slots found for this date. Use the admin panel to generate slots.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                                                {mySlots.map(slot => (
                                                    <div
                                                        key={slot.id}
                                                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${slot.status === 'PENDING' ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm' :
                                                            slot.status === 'AVAILABLE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                                slot.status === 'BOOKED' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                                    'bg-slate-50 border-slate-200 text-slate-400'
                                                            }`}
                                                    >
                                                        <span className="font-bold text-lg">{slot.time}</span>
                                                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">
                                                            {slot.status}
                                                        </span>

                                                        {slot.status === 'PENDING' && (
                                                            <button
                                                                onClick={() => handleApproveSlot(slot.id)}
                                                                className="w-full mt-2 bg-white border border-orange-200 text-orange-700 hover:bg-orange-600 hover:text-white hover:border-orange-600 text-xs py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 shadow-sm"
                                                            >
                                                                <Check size={12} /> Approve
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={closePatientView}
                            className="mb-8 group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white"
                        >
                            <div className="bg-white p-1 rounded-md border border-slate-200 shadow-sm group-hover:border-slate-300 transition-colors">
                                <ChevronLeft size={16} />
                            </div>
                            Back to Dashboard
                        </button>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner">
                                    <Users size={40} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedPatient.name}</h2>
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full text-sm border border-slate-100">
                                                    📧 {selectedPatient.email}
                                                </span>
                                                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full text-sm border border-slate-100">
                                                    🆔 #{selectedPatient.id}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                <Pill size={20} />
                                            </div>
                                            Prescriptions
                                        </h3>
                                        <button
                                            onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                                            className="btn btn-primary text-sm py-2 px-4 shadow-md shadow-primary-200"
                                        >
                                            {showPrescriptionForm ? <X size={18} /> : <Plus size={18} />}
                                            {showPrescriptionForm ? ' Cancel' : ' Add New'}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {showPrescriptionForm && (
                                            <motion.form
                                                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 space-y-4 shadow-inner"
                                                onSubmit={handlePrescriptionSubmit}
                                            >
                                                <div className="input-group">
                                                    <label className="input-label">Medicine Name</label>
                                                    <input
                                                        type="text"
                                                        value={prescriptionForm.medName}
                                                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medName: e.target.value })}
                                                        required
                                                        className="input-field bg-white"
                                                        placeholder="e.g. Amoxicillin"
                                                    />
                                                </div>
                                                <div className="input-group">
                                                    <label className="input-label">Description / Instructions</label>
                                                    <textarea
                                                        value={prescriptionForm.description}
                                                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, description: e.target.value })}
                                                        required
                                                        className="input-field bg-white min-h-[80px] py-3"
                                                        placeholder="e.g. Take one tablet after meals with water."
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="input-group">
                                                        <label className="input-label">Dose</label>
                                                        <input
                                                            type="text"
                                                            value={prescriptionForm.dose}
                                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dose: e.target.value })}
                                                            required
                                                            className="input-field bg-white"
                                                            placeholder="e.g. 500mg"
                                                        />
                                                    </div>
                                                    <div className="input-group">
                                                        <label className="input-label">Frequency</label>
                                                        <input
                                                            type="text"
                                                            value={prescriptionForm.frequency}
                                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })}
                                                            required
                                                            className="input-field bg-white"
                                                            placeholder="e.g. Twice Daily"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="input-group">
                                                        <label className="input-label">Start Date</label>
                                                        <input
                                                            type="date"
                                                            value={prescriptionForm.startDate}
                                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, startDate: e.target.value })}
                                                            required
                                                            className="input-field bg-white"
                                                        />
                                                    </div>
                                                    <div className="input-group">
                                                        <label className="input-label">End Date</label>
                                                        <input
                                                            type="date"
                                                            value={prescriptionForm.endDate}
                                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, endDate: e.target.value })}
                                                            required
                                                            className="input-field bg-white"
                                                        />
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn btn-primary w-full shadow-lg">
                                                    {editingPrescriptionId ? 'Update' : 'Save Prescription'}
                                                </button>
                                            </motion.form>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-4">
                                        {selectedPatient.medicines && selectedPatient.medicines.length > 0 ? (
                                            selectedPatient.medicines.map((med) => (
                                                <div key={med.medId} className="p-5 border border-slate-100 rounded-xl hover:shadow-lg hover:border-primary-100 transition-all bg-white group relative">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-slate-800 text-lg">{med.medName}</h4>
                                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{med.dose}</span>
                                                    </div>
                                                    <p className="text-primary-600 font-medium text-sm mb-3">{med.frequency}</p>
                                                    <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg leading-relaxed">{med.description}</p>
                                                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                                                        <p className="text-xs text-slate-400 font-medium">
                                                            {new Date(med.startDate).toLocaleDateString()} - {new Date(med.endDate).toLocaleDateString()}
                                                        </p>
                                                        <button
                                                            onClick={() => handleEditPrescription(med)}
                                                            className="text-primary-600 hover:text-primary-700 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-primary-50 px-3 py-1.5 rounded-lg"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                <Pill className="mx-auto mb-3 opacity-30" size={32} />
                                                <p className="text-sm font-medium">No active prescriptions.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>


                            <div className="space-y-8">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[300px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                                <FileText size={20} />
                                            </div>
                                            Lab Reports
                                        </h3>
                                        <button
                                            onClick={() => setShowReportForm(!showReportForm)}
                                            className="btn btn-secondary text-sm py-2 px-4 shadow-sm"
                                        >
                                            {showReportForm ? <X size={18} /> : <Plus size={18} />}
                                            {showReportForm ? ' Cancel' : ' Add'}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {showReportForm && (
                                            <motion.form
                                                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 space-y-4 shadow-inner"
                                                onSubmit={handleReportSubmit}
                                            >
                                                <div className="input-group">
                                                    <label className="input-label">Report Name</label>
                                                    <input
                                                        type="text"
                                                        value={reportForm.reportName}
                                                        onChange={(e) => setReportForm({ ...reportForm, reportName: e.target.value })}
                                                        required
                                                        className="input-field bg-white"
                                                        placeholder="e.g. Blood Test Result"
                                                    />
                                                </div>
                                                <div className="input-group">
                                                    <label className="input-label">Report URL</label>
                                                    <input
                                                        type="url"
                                                        value={reportForm.reportUrl}
                                                        onChange={(e) => setReportForm({ ...reportForm, reportUrl: e.target.value })}
                                                        required
                                                        className="input-field bg-white"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-primary w-full shadow-lg">
                                                    {editingReportId ? 'Update Report' : 'Save Report'}
                                                </button>
                                            </motion.form>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-3">
                                        {selectedPatient.Reports && selectedPatient.Reports.length > 0 ? (
                                            selectedPatient.Reports.map((report) => (
                                                <div key={report.reportId} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-emerald-100 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                                            DOC
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-sm">{report.reportName}</h4>
                                                            <p className="text-xs text-slate-500 mt-0.5">{new Date(report.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <a
                                                            href={report.reportUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                                                            title="View Report"
                                                        >
                                                            <FileText size={16} />
                                                        </a>
                                                        <button
                                                            onClick={() => handleEditReport(report)}
                                                            className="p-2 text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                                                            title="Edit"
                                                        >
                                                            <Activity size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-slate-400">
                                                <p className="text-sm">No reports available.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedPatient.CancerType && selectedPatient.CancerType.length > 0 && (
                                    <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
                                        <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2 text-lg">
                                            <Activity size={20} />
                                            Diagnosis History
                                        </h4>
                                        <div className="space-y-3">
                                            {selectedPatient.CancerType.map((cancer) => (
                                                <div key={cancer.cancerId} className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <strong className="text-slate-900">{cancer.name}</strong>
                                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-bold uppercase tracking-wider">Stage {cancer.stage}</span>
                                                    </div>
                                                    <p className="text-slate-600 text-sm">{cancer.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
            <SOSButton />
        </div>
    );
};

export default DoctorDashboard;