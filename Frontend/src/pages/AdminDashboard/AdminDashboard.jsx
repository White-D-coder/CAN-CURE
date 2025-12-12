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

    // ... (Edit/Delete handlers remain same)
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
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
                <button
                    onClick={logout}
                    className="btn"
                    style={{ backgroundColor: '#ef4444', padding: '8px 16px' }}
                >
                    Logout
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
                    <h3 style={{ margin: 0, color: '#6b7280', fontSize: '14px', textTransform: 'uppercase' }}>Total Doctors</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '16px 0 0', color: '#4f46e5' }}>{stats.doctors}</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
                    <h3 style={{ margin: 0, color: '#6b7280', fontSize: '14px', textTransform: 'uppercase' }}>Total Patients</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '16px 0 0', color: '#10b981' }}>{stats.patients}</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
                    <h3 style={{ margin: 0, color: '#6b7280', fontSize: '14px', textTransform: 'uppercase' }}>Total Appointments</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '16px 0 0', color: '#f59e0b' }}>{stats.appointments}</p>
                </div>
            </div>

            {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px', textAlign: 'center' }}>
                    {error}
                </div>
            )}
            {successMsg && (
                <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '24px', textAlign: 'center' }}>
                    {successMsg}
                </div>
            )}

            <div style={{ marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
                <button
                    onClick={() => setActiveTab('doctors')}
                    style={{
                        padding: '12px 24px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'doctors' ? '2px solid #4f46e5' : 'none',
                        color: activeTab === 'doctors' ? '#4f46e5' : '#6b7280',
                        fontWeight: activeTab === 'doctors' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Manage Doctors
                </button>
                <button
                    onClick={() => setActiveTab('patients')}
                    style={{
                        padding: '12px 24px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'patients' ? '2px solid #4f46e5' : 'none',
                        color: activeTab === 'patients' ? '#4f46e5' : '#6b7280',
                        fontWeight: activeTab === 'patients' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Manage Patients
                </button>
                <button
                    onClick={() => setActiveTab('schedule')}
                    style={{
                        padding: '12px 24px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'schedule' ? '2px solid #4f46e5' : 'none',
                        color: activeTab === 'schedule' ? '#4f46e5' : '#6b7280',
                        fontWeight: activeTab === 'schedule' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Manage Schedule
                </button>
            </div>

            {activeTab === 'doctors' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                    {/* Doctor Form - Same as before */}
                    <div className="card" style={{ height: 'fit-content' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>{editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                        <form onSubmit={handleDoctorSubmit}>
                            {/* ... inputs ... */}
                            <div className="input-group">
                                <label>Name</label>
                                <input type="text" value={doctorFormData.name} onChange={(e) => setDoctorFormData({ ...doctorFormData, name: e.target.value })} required placeholder="Dr. John Doe" />
                            </div>
                            <div className="input-group">
                                <label>Specialist</label>
                                <input type="text" value={doctorFormData.specialist} onChange={(e) => setDoctorFormData({ ...doctorFormData, specialist: e.target.value })} required placeholder="Cardiologist" />
                            </div>
                            <div className="input-group">
                                <label>Experience (Years)</label>
                                <input type="number" value={doctorFormData.experience} onChange={(e) => setDoctorFormData({ ...doctorFormData, experience: e.target.value })} required placeholder="5" min="0" />
                            </div>
                            <div className="input-group">
                                <label>Email</label>
                                <input type="email" value={doctorFormData.email} onChange={(e) => setDoctorFormData({ ...doctorFormData, email: e.target.value })} required placeholder="doctor@example.com" />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input type="text" value={doctorFormData.password} onChange={(e) => setDoctorFormData({ ...doctorFormData, password: e.target.value })} required={!editingDoctorId} placeholder={editingDoctorId ? "Leave blank to keep current" : "password123"} />
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                                <button type="submit" className="btn" style={{ flex: 1 }}>{editingDoctorId ? 'Update Doctor' : 'Add Doctor'}</button>
                                {editingDoctorId && <button type="button" className="btn" style={{ backgroundColor: '#6b7280' }} onClick={() => { setEditingDoctorId(null); setDoctorFormData({ name: '', specialist: '', experience: '', email: '', password: 'password123' }); }}>Cancel</button>}
                            </div>
                        </form>
                    </div>

                    <div className="card">
                        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Doctors List</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                                        <th style={{ padding: '12px' }}>Name</th>
                                        <th style={{ padding: '12px' }}>Specialist</th>
                                        <th style={{ padding: '12px' }}>Exp</th>
                                        <th style={{ padding: '12px' }}>Email</th>
                                        <th style={{ padding: '12px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.map((doctor) => (
                                        <tr key={doctor.doctorId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '12px' }}>{doctor.name}</td>
                                            <td style={{ padding: '12px' }}>{doctor.specialist}</td>
                                            <td style={{ padding: '12px' }}>{doctor.experience}y</td>
                                            <td style={{ padding: '12px' }}>{doctor.email}</td>
                                            <td style={{ padding: '12px' }}>
                                                <button onClick={() => handleEditDoctor(doctor)} style={{ marginRight: '16px', background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                                                <button onClick={() => handleDeleteDoctor(doctor.doctorId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                    {/* Patient Form - Same as before */}
                    <div className="card" style={{ height: 'fit-content' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>{editingPatientId ? 'Edit Patient' : 'Add New Patient'}</h3>
                        <form onSubmit={handlePatientSubmit}>
                            <div className="input-group">
                                <label>Name</label>
                                <input type="text" value={patientFormData.name} onChange={(e) => setPatientFormData({ ...patientFormData, name: e.target.value })} required placeholder="John Doe" />
                            </div>
                            <div className="input-group">
                                <label>Email</label>
                                <input type="email" value={patientFormData.email} onChange={(e) => setPatientFormData({ ...patientFormData, email: e.target.value })} required placeholder="patient@example.com" />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input type="text" value={patientFormData.password} onChange={(e) => setPatientFormData({ ...patientFormData, password: e.target.value })} required={!editingPatientId} placeholder={editingPatientId ? "Leave blank to keep current" : "password123"} />
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                                <button type="submit" className="btn" style={{ flex: 1 }}>{editingPatientId ? 'Update Patient' : 'Add Patient'}</button>
                                {editingPatientId && <button type="button" className="btn" style={{ backgroundColor: '#6b7280' }} onClick={() => { setEditingPatientId(null); setPatientFormData({ name: '', email: '', password: 'password123' }); }}>Cancel</button>}
                            </div>
                        </form>
                    </div>

                    <div className="card">
                        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Registered Patients</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                                        <th style={{ padding: '12px' }}>ID</th>
                                        <th style={{ padding: '12px' }}>Name</th>
                                        <th style={{ padding: '12px' }}>Email</th>
                                        <th style={{ padding: '12px' }}>Appointments</th>
                                        <th style={{ padding: '12px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((patient) => (
                                        <tr key={patient.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '12px' }}>#{patient.id}</td>
                                            <td style={{ padding: '12px' }}>{patient.name}</td>
                                            <td style={{ padding: '12px' }}>{patient.email}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>{patient._count?.Appointments || 0}</span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <button onClick={() => handleEditPatient(patient)} style={{ marginRight: '16px', background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                                                <button onClick={() => handleDeletePatient(patient.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                    <div className="card" style={{ height: 'fit-content' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Manage Schedule</h3>
                        <div className="input-group">
                            <label>Select Doctor</label>
                            <select
                                value={scheduleData.doctorId}
                                onChange={(e) => setScheduleData({ ...scheduleData, doctorId: e.target.value })}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                            >
                                <option value="">-- Select Doctor --</option>
                                {doctors.map(doc => (
                                    <option key={doc.doctorId} value={doc.doctorId}>{doc.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Select Date</label>
                            <input
                                type="date"
                                value={scheduleData.date}
                                onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
                            <h4 style={{ margin: '0 0 12px' }}>Add Time Slot</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="time"
                                    value={newSlotTime}
                                    onChange={(e) => setNewSlotTime(e.target.value)}
                                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                />
                                <button
                                    onClick={handleCreateSlot}
                                    className="btn"
                                    disabled={!scheduleData.doctorId || !scheduleData.date || !newSlotTime}
                                    style={{ opacity: (!scheduleData.doctorId || !scheduleData.date || !newSlotTime) ? 0.5 : 1 }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>
                            Time Slots {scheduleData.date && `for ${scheduleData.date}`}
                        </h3>

                        {!scheduleData.doctorId || !scheduleData.date ? (
                            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
                                Select a doctor and date to view slots.
                            </p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                                {doctorSlots.length === 0 ? (
                                    <p style={{ gridColumn: '1/-1', color: '#6b7280', textAlign: 'center' }}>No slots created yet.</p>
                                ) : (
                                    doctorSlots.map(slot => (
                                        <div
                                            key={slot.id}
                                            style={{
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                backgroundColor: slot.status === 'FROZEN' ? '#f3f4f6' :
                                                    slot.status === 'BOOKED' ? '#e0e7ff' :
                                                        slot.status === 'AVAILABLE' ? '#dcfce7' : '#fff',
                                                opacity: slot.status === 'FROZEN' ? 0.7 : 1
                                            }}
                                        >
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{slot.time}</div>
                                            <div style={{ fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', color: '#4b5563' }}>
                                                {slot.status}
                                            </div>
                                            {slot.status !== 'BOOKED' && (
                                                <button
                                                    onClick={() => handleToggleFreeze(slot)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '4px',
                                                        fontSize: '12px',
                                                        backgroundColor: slot.status === 'FROZEN' ? '#4f46e5' : '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {slot.status === 'FROZEN' ? 'Unfreeze' : 'Freeze'}
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
