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
import { Calendar, Users, Clock, Pill, FileText, Activity, LogOut, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' or 'schedule'
    const [appointments, setAppointments] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Schedule State
    const [scheduleDate, setScheduleDate] = useState('');
    const [mySlots, setMySlots] = useState([]);

    // Prescription State
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

    // Report State
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

    // Schedule Functions
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
                <div className="flex items-center gap-3 text-primary-600 font-medium text-lg">
                    <Activity className="animate-spin" size={24} />
                    Loading dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-600 p-2 rounded-lg text-white">
                            <Activity size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-none">Doctor Portal</h1>
                            <p className="text-xs text-slate-500 font-medium mt-1">Dr. {user?.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={20} />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {!selectedPatient ? (
                    <>
                        <div className="flex gap-4 mb-8 border-b border-slate-200">
                            <button
                                onClick={() => setActiveTab('appointments')}
                                className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 transition-all relative ${
                                    activeTab === 'appointments' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <Users size={18} />
                                Appointments
                                {activeTab === 'appointments' && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('schedule')}
                                className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 transition-all relative ${
                                    activeTab === 'schedule' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <Calendar size={18} />
                                My Schedule
                                {activeTab === 'schedule' && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                                )}
                            </button>
                        </div>

                        {activeTab === 'appointments' ? (
                            <div className="card overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-slate-800">Your Appointments</h2>
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        Total: {appointments.length}
                                    </span>
                                </div>
                                
                                {appointments.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="text-slate-400" size={32} />
                                        </div>
                                        <h3 className="text-slate-900 font-medium mb-1">No appointments yet</h3>
                                        <p className="text-slate-500 text-sm">You don't have any appointments scheduled.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                                <tr>
                                                    <th className="p-4">Date & Time</th>
                                                    <th className="p-4">Patient Name</th>
                                                    <th className="p-4">Status</th>
                                                    <th className="p-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {appointments.map((apt) => (
                                                    <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="p-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-slate-900 flex items-center gap-2">
                                                                    <Calendar size={14} className="text-slate-400" />
                                                                    {new Date(apt.date).toLocaleDateString()}
                                                                </span>
                                                                <span className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                                                                    <Clock size={14} className="text-slate-400" />
                                                                    {apt.time}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                                                                    {apt.user.name.charAt(0)}
                                                                </div>
                                                                <span className="font-medium text-slate-900">{apt.user.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold border border-green-200">
                                                                Confirmed
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => handleViewPatient(apt.userId)}
                                                                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                            >
                                                                View Records
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="card p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-bold text-slate-800">Manage Schedule</h2>
                                    <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border border-slate-200">
                                        <input
                                            type="date"
                                            value={scheduleDate}
                                            onChange={(e) => setScheduleDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0"
                                        />
                                    </div>
                                </div>

                                {!scheduleDate ? (
                                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                        <Calendar className="text-slate-300 mx-auto mb-3" size={48} />
                                        <p className="text-slate-500 font-medium">Select a date to view or manage your time slots.</p>
                                    </div>
                                ) : (
                                    <div>
                                        {mySlots.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-slate-500">No slots assigned for this date.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                {mySlots.map(slot => (
                                                    <div
                                                        key={slot.id}
                                                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                                                            slot.status === 'PENDING' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                                                            slot.status === 'AVAILABLE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                            slot.status === 'BOOKED' ? 'bg-blue-50 border-blue-200 text-blue-700' : 
                                                            'bg-gray-50 border-gray-200 text-gray-500'
                                                        }`}
                                                    >
                                                        <span className="font-bold text-lg">{slot.time}</span>
                                                        <span className="text-[10px] uppercase tracking-wider font-bold">
                                                            {slot.status}
                                                        </span>

                                                        {slot.status === 'PENDING' ? (
                                                            <button
                                                                onClick={() => handleApproveSlot(slot.id)}
                                                                className="w-full mt-2 bg-white border border-orange-200 text-orange-700 hover:bg-orange-100 text-xs py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1"
                                                            >
                                                                <Check size={12} />
                                                                Approve
                                                            </button>
                                                        ) : slot.status === 'FROZEN' ? (
                                                            <span className="text-xs text-red-500 font-medium mt-1">Frozen by Admin</span>
                                                        ) : (
                                                            <span className="text-xs opacity-75 mt-1">
                                                                {slot.status === 'BOOKED' ? 'Booked' : 'Active'}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <button
                            onClick={closePatientView}
                            className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <ChevronLeft size={16} />
                            Back to Appointments
                        </button>

                        <div className="card p-6 mb-8 flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <Users size={40} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{selectedPatient.name}</h2>
                                <p className="text-slate-500 font-medium">{selectedPatient.email}</p>
                                <div className="flex gap-2 mt-3">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                                        Patient ID: {selectedPatient.id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Medical History Section */}
                            <div className="space-y-6">
                                <div className="card p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <Pill className="text-primary-500" size={20} />
                                            Prescriptions
                                        </h3>
                                        <button
                                            onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                                            className="btn btn-primary text-sm py-2 px-4 shadow-sm"
                                        >
                                            {showPrescriptionForm ? 'Cancel' : '+ New Prescription'}
                                        </button>
                                    </div>

                                    {showPrescriptionForm && (
                                        <motion.form
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 space-y-4"
                                            onSubmit={handlePrescriptionSubmit}
                                        >
                                            <div className="input-group">
                                                <label className="input-label">Medicine Name</label>
                                                <input
                                                    type="text"
                                                    value={prescriptionForm.medName}
                                                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medName: e.target.value })}
                                                    required
                                                    className="input-field"
                                                    placeholder="e.g. Amoxicillin"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label className="input-label">Description</label>
                                                <input
                                                    type="text"
                                                    value={prescriptionForm.description}
                                                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, description: e.target.value })}
                                                    required
                                                    className="input-field"
                                                    placeholder="e.g. Take after meals"
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
                                                        className="input-field"
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
                                                        className="input-field"
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
                                                        className="input-field"
                                                    />
                                                </div>
                                                <div className="input-group">
                                                    <label className="input-label">End Date</label>
                                                    <input
                                                        type="date"
                                                        value={prescriptionForm.endDate}
                                                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, endDate: e.target.value })}
                                                        required
                                                        className="input-field"
                                                    />
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-primary w-full shadow-md">
                                                {editingPrescriptionId ? 'Update Prescription' : 'Add Prescription'}
                                            </button>
                                        </motion.form>
                                    )}

                                    <div className="space-y-4">
                                        {selectedPatient.medicines && selectedPatient.medicines.length > 0 ? (
                                            selectedPatient.medicines.map((med) => (
                                                <div key={med.medId} className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-all bg-white group">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{med.medName} <span className="text-slate-400 font-normal text-sm">| {med.dose}</span></h4>
                                                            <p className="text-sm text-slate-500 mt-1 font-medium">{med.frequency}</p>
                                                            <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg inline-block">{med.description}</p>
                                                            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                                                                <Calendar size={12} />
                                                                {new Date(med.startDate).toLocaleDateString()} - {new Date(med.endDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleEditPrescription(med)}
                                                            className="text-primary-600 hover:text-primary-700 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-primary-50 rounded-lg"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                <Pill className="mx-auto mb-2 opacity-50" size={24} />
                                                <p className="text-sm">No prescriptions added yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedPatient.CancerType && selectedPatient.CancerType.length > 0 && (
                                    <div className="card p-6 bg-red-50 border-red-100">
                                        <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                                            <Activity size={18} />
                                            Diagnosis History
                                        </h4>
                                        {selectedPatient.CancerType.map((cancer) => (
                                            <div key={cancer.cancerId} className="bg-white p-4 rounded-xl border border-red-100 shadow-sm mb-3 last:mb-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <strong className="text-slate-800">{cancer.name}</strong>
                                                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-bold">Stage {cancer.stage}</span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 text-sm mt-2">{cancer.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Lab Reports Section */}
                            <div className="card p-6 h-fit">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <FileText className="text-emerald-500" size={20} />
                                        Lab Reports
                                    </h3>
                                    <button
                                        onClick={() => setShowReportForm(!showReportForm)}
                                        className="btn btn-secondary text-sm py-2 px-4 shadow-sm"
                                    >
                                        {showReportForm ? 'Cancel' : '+ Add Report'}
                                    </button>
                                </div>

                                {showReportForm && (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 space-y-4"
                                        onSubmit={handleReportSubmit}
                                    >
                                        <div className="input-group">
                                            <label className="input-label">Report Name</label>
                                            <input
                                                type="text"
                                                value={reportForm.reportName}
                                                onChange={(e) => setReportForm({ ...reportForm, reportName: e.target.value })}
                                                required
                                                className="input-field"
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
                                                className="input-field"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-full shadow-md">
                                            {editingReportId ? 'Update Report' : 'Add Report'}
                                        </button>
                                    </motion.form>
                                )}

                                <div className="space-y-3">
                                    {selectedPatient.Reports && selectedPatient.Reports.length > 0 ? (
                                        selectedPatient.Reports.map((report) => (
                                            <div key={report.reportId} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800 text-sm">{report.reportName}</h4>
                                                        <p className="text-xs text-slate-500">{new Date(report.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <a
                                                        href={report.reportUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                                                    >
                                                        View
                                                    </a>
                                                    <button
                                                        onClick={() => handleEditReport(report)}
                                                        className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <FileText className="mx-auto mb-2 opacity-50" size={24} />
                                            <p className="text-sm">No reports available.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorDashboard;