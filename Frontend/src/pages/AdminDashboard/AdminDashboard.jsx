import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    getSystemStats,
    getAllUsers,
    getAllDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    createPatient,
    updatePatient,
    deletePatient,
    createTimeSlots,
    updateSlotStatus,
    getDoctorSlots
} from '../../api/admin';
import { 
    Users, 
    UserPlus, 
    Calendar, 
    Activity, 
    Trash2, 
    Edit, 
    Plus, 
    LogOut, 
    CheckCircle, 
    AlertCircle, 
    Shield,
    Stethoscope,
    Clock,
    Lock,
    Unlock
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
    const [activeTab, setActiveTab] = useState('doctors');

    // Doctor Form Data
    const [doctorFormData, setDoctorFormData] = useState({
        name: '',
        specialist: '',
        experience: '',
        email: '',
        password: 'password123'
    });
    const [editingDoctorId, setEditingDoctorId] = useState(null);

    // Patient Form Data
    const [patientFormData, setPatientFormData] = useState({
        name: '',
        email: '',
        password: 'password123'
    });
    const [editingPatientId, setEditingPatientId] = useState(null);

    // Schedule Management Data
    const [scheduleData, setScheduleData] = useState({
        doctorId: '',
        date: '',
        slots: []
    });
    const [doctorSlots, setDoctorSlots] = useState([]);
    const [newSlotTime, setNewSlotTime] = useState('');

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const { logout } = useAuth();

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [doctorsRes, statsRes, patientsRes] = await Promise.all([
                getAllDoctors(),
                getSystemStats(),
                getAllUsers()
            ]);
            setDoctors(doctorsRes);
            setStats(statsRes);
            setPatients(patientsRes);
            setError('');
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError('Failed to load dashboard data.');
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await getAllDoctors();
            setDoctors(response);
            const statsRes = await getSystemStats();
            setStats(statsRes);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await getAllUsers();
            setPatients(response);
            const statsRes = await getSystemStats();
            setStats(statsRes);
        } catch (err) {
            console.error('Error fetching patients:', err);
        }
    };

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...doctorFormData,
                experience: parseInt(doctorFormData.experience)
            };

            if (editingDoctorId) {
                await updateDoctor(editingDoctorId, data);
            } else {
                await createDoctor(data);
            }

            setDoctorFormData({ name: '', specialist: '', experience: '', email: '', password: 'password123' });
            setEditingDoctorId(null);
            setError('');
            setSuccessMsg('Doctor saved successfully');
            fetchDoctors();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error('Error saving doctor:', err);
            setError('Failed to save doctor. Please try again.');
        }
    };

    const handlePatientSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPatientId) {
                await updatePatient(editingPatientId, patientFormData);
            } else {
                await createPatient(patientFormData);
            }

            setPatientFormData({ name: '', email: '', password: 'password123' });
            setEditingPatientId(null);
            setError('');
            setSuccessMsg('Patient saved successfully');
            fetchPatients();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error('Error saving patient:', err);
            setError('Failed to save patient. Please try again.');
        }
    };

    // Schedule Management Functions
    const handleFetchSlots = async () => {
        if (!scheduleData.doctorId || !scheduleData.date) return;
        try {
            const slots = await getDoctorSlots(scheduleData.doctorId, scheduleData.date);
            setDoctorSlots(slots);
        } catch (err) {
            console.error("Error fetching slots:", err);
        }
    };

    useEffect(() => {
        if (activeTab === 'schedule') {
            handleFetchSlots();
        }
    }, [scheduleData.doctorId, scheduleData.date, activeTab]);

    const handleCreateSlot = async () => {
        if (!newSlotTime) return;
        try {
            await createTimeSlots({
                doctorId: scheduleData.doctorId,
                date: scheduleData.date,
                slots: [newSlotTime]
            });
            setNewSlotTime('');
            handleFetchSlots();
            setSuccessMsg('Slot created successfully');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError('Failed to create slot');
        }
    };

    const handleToggleFreeze = async (slot) => {
        try {
            const newStatus = slot.status === 'FROZEN' ? 'PENDING' : 'FROZEN';
            await updateSlotStatus({
                slotId: slot.id,
                status: newStatus
            });
            handleFetchSlots();
        } catch (err) {
            setError('Failed to update slot status');
        }
    };

    const handleEditDoctor = (doctor) => {
        setDoctorFormData({
            name: doctor.name,
            specialist: doctor.specialist,
            experience: doctor.experience,
            email: doctor.email,
            password: ''
        });
        setEditingDoctorId(doctor.doctorId);
        setActiveTab('doctors');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEditPatient = (patient) => {
        setPatientFormData({
            name: patient.name,
            email: patient.email,
            password: ''
        });
        setEditingPatientId(patient.id);
        setActiveTab('patients');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteDoctor = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await deleteDoctor(id);
                fetchDoctors();
            } catch (err) {
                console.error('Error deleting doctor:', err);
                setError('Failed to delete doctor.');
            }
        }
    };

    const handleDeletePatient = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await deletePatient(id);
                fetchPatients();
            } catch (err) {
                console.error('Error deleting patient:', err);
                setError('Failed to delete patient.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-600 p-2 rounded-lg text-white">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-none">Admin Portal</h1>
                            <p className="text-xs text-slate-500 font-medium mt-1">System Management Dashboard</p>
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
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <Stethoscope size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Total Doctors</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.doctors}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Total Patients</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.patients}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Total Appointments</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.appointments}</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={20} />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}
                {successMsg && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6 rounded-r-lg flex items-center gap-3">
                        <CheckCircle className="text-emerald-500" size={20} />
                        <p className="text-emerald-700 font-medium">{successMsg}</p>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('doctors')}
                        className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 transition-all relative ${
                            activeTab === 'doctors' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Stethoscope size={18} />
                        Manage Doctors
                        {activeTab === 'doctors' && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('patients')}
                        className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 transition-all relative ${
                            activeTab === 'patients' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Users size={18} />
                        Manage Patients
                        {activeTab === 'patients' && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 transition-all relative ${
                            activeTab === 'schedule' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Clock size={18} />
                        Manage Schedule
                        {activeTab === 'schedule' && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                        )}
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'doctors' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Doctor Form */}
                        <div className="card h-fit">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    {editingDoctorId ? <Edit size={18} /> : <Plus size={18} />}
                                    {editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}
                                </h3>
                            </div>
                            <form onSubmit={handleDoctorSubmit} className="p-6 space-y-4">
                                <div className="input-group">
                                    <label className="input-label">Name</label>
                                    <input type="text" value={doctorFormData.name} onChange={(e) => setDoctorFormData({ ...doctorFormData, name: e.target.value })} required placeholder="Dr. John Doe" className="input-field" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Specialist</label>
                                    <input type="text" value={doctorFormData.specialist} onChange={(e) => setDoctorFormData({ ...doctorFormData, specialist: e.target.value })} required placeholder="Cardiologist" className="input-field" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Experience (Years)</label>
                                    <input type="number" value={doctorFormData.experience} onChange={(e) => setDoctorFormData({ ...doctorFormData, experience: e.target.value })} required placeholder="5" min="0" className="input-field" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email</label>
                                    <input type="email" value={doctorFormData.email} onChange={(e) => setDoctorFormData({ ...doctorFormData, email: e.target.value })} required placeholder="doctor@example.com" className="input-field" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Password</label>
                                    <input type="text" value={doctorFormData.password} onChange={(e) => setDoctorFormData({ ...doctorFormData, password: e.target.value })} required={!editingDoctorId} placeholder={editingDoctorId ? "Leave blank to keep" : "password123"} className="input-field" />
                                </div>
                                <div className="flex gap-3 mt-6 pt-4">
                                    <button type="submit" className="flex-1 btn btn-primary flex justify-center items-center gap-2">
                                        {editingDoctorId ? 'Update' : 'Add Doctor'}
                                    </button>
                                    {editingDoctorId && (
                                        <button 
                                            type="button" 
                                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                            onClick={() => { setEditingDoctorId(null); setDoctorFormData({ name: '', specialist: '', experience: '', email: '', password: 'password123' }); }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Doctors List */}
                        <div className="card lg:col-span-2 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 mb-0">
                                <h3 className="text-lg font-bold text-slate-800">Doctors Directory</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Specialist</th>
                                            <th className="p-4">Exp</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {doctors.map((doctor) => (
                                            <tr key={doctor.doctorId} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 font-medium text-slate-900">{doctor.name}</td>
                                                <td className="p-4 text-slate-600">{doctor.specialist}</td>
                                                <td className="p-4 text-slate-600">{doctor.experience}y</td>
                                                <td className="p-4 text-slate-600">{doctor.email}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleEditDoctor(doctor)} 
                                                            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteDoctor(doctor.doctorId)} 
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'patients' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Patient Form */}
                        <div className="card h-fit">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    {editingPatientId ? <Edit size={18} /> : <UserPlus size={18} />}
                                    {editingPatientId ? 'Edit Patient' : 'Add New Patient'}
                                </h3>
                            </div>
                            <form onSubmit={handlePatientSubmit} className="p-6 space-y-4">
                                <div className="input-group">
                                    <label className="input-label">Name</label>
                                    <input type="text" value={patientFormData.name} onChange={(e) => setPatientFormData({ ...patientFormData, name: e.target.value })} required placeholder="John Doe" className="input-field" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email</label>
                                    <input type="email" value={patientFormData.email} onChange={(e) => setPatientFormData({ ...patientFormData, email: e.target.value })} required placeholder="patient@example.com" className="input-field" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Password</label>
                                    <input type="text" value={patientFormData.password} onChange={(e) => setPatientFormData({ ...patientFormData, password: e.target.value })} required={!editingPatientId} placeholder={editingPatientId ? "Leave blank to keep" : "password123"} className="input-field" />
                                </div>
                                <div className="flex gap-3 mt-6 pt-4">
                                    <button type="submit" className="flex-1 btn btn-primary flex justify-center items-center gap-2">
                                        {editingPatientId ? 'Update' : 'Add Patient'}
                                    </button>
                                    {editingPatientId && (
                                        <button 
                                            type="button" 
                                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                            onClick={() => { setEditingPatientId(null); setPatientFormData({ name: '', email: '', password: 'password123' }); }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Patients List */}
                        <div className="card lg:col-span-2 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 mb-0">
                                <h3 className="text-lg font-bold text-slate-800">Registered Patients</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Appointments</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {patients.map((patient) => (
                                            <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 text-slate-400 font-mono text-xs">#{patient.id}</td>
                                                <td className="p-4 font-medium text-slate-900">{patient.name}</td>
                                                <td className="p-4 text-slate-600">{patient.email}</td>
                                                <td className="p-4">
                                                    <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs font-semibold">
                                                        {patient._count?.Appointments || 0}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleEditPatient(patient)} 
                                                            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeletePatient(patient.id)} 
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="card h-fit p-6 space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Manage Schedule</h3>
                            <div className="input-group">
                                <label className="input-label">Select Doctor</label>
                                <select
                                    value={scheduleData.doctorId}
                                    onChange={(e) => setScheduleData({ ...scheduleData, doctorId: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="">-- Select Doctor --</option>
                                    {doctors.map(doc => (
                                        <option key={doc.doctorId} value={doc.doctorId}>{doc.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Select Date</label>
                                <input
                                    type="date"
                                    value={scheduleData.date}
                                    onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="input-field"
                                />
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="text-sm font-semibold text-slate-700 mb-3">Add Time Slot</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="time"
                                        value={newSlotTime}
                                        onChange={(e) => setNewSlotTime(e.target.value)}
                                        className="input-field"
                                    />
                                    <button
                                        onClick={handleCreateSlot}
                                        className="btn btn-primary px-6"
                                        disabled={!scheduleData.doctorId || !scheduleData.date || !newSlotTime}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card lg:col-span-2 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                                <span>Time Slots</span>
                                {scheduleData.date && <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{scheduleData.date}</span>}
                            </h3>

                            {!scheduleData.doctorId || !scheduleData.date ? (
                                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                    <Clock className="text-slate-300 mx-auto mb-3" size={48} />
                                    <p className="text-slate-500 font-medium">Select a doctor and date to view slots.</p>
                                </div>
                            ) : (
                                <div>
                                    {doctorSlots.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-slate-500">No slots created yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {doctorSlots.map(slot => (
                                                <div
                                                    key={slot.id}
                                                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${
                                                        slot.status === 'FROZEN' ? 'bg-red-50 border-red-200 text-red-700 opacity-80' :
                                                        slot.status === 'BOOKED' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                        slot.status === 'AVAILABLE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                                                        'bg-white border-slate-200'
                                                    }`}
                                                >
                                                    <span className="font-bold text-lg">{slot.time}</span>
                                                    <span className="text-[10px] uppercase tracking-wider font-bold">
                                                        {slot.status}
                                                    </span>
                                                    
                                                    {slot.status !== 'BOOKED' && (
                                                        <button
                                                            onClick={() => handleToggleFreeze(slot)}
                                                            className={`w-full text-xs py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 ${
                                                                slot.status === 'FROZEN' 
                                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            {slot.status === 'FROZEN' ? (
                                                                <><Unlock size={12} /> Unfreeze</>
                                                            ) : (
                                                                <><Lock size={12} /> Freeze</>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;