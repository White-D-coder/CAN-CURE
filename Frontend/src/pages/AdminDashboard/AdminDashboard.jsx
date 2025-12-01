import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { getSystemStats, getAllUsers } from '../../api/admin';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
    const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' or 'patients'
    const [formData, setFormData] = useState({
        name: '',
        specialist: '',
        experience: '',
        email: '',
        password: 'password123'
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const { logout } = useAuth();

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [doctorsRes, statsRes, patientsRes] = await Promise.all([
                api.get('/api/doctors'),
                getSystemStats(),
                getAllUsers()
            ]);
            setDoctors(doctorsRes.data);
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
            const response = await api.get('/api/doctors');
            setDoctors(response.data);
            // Update stats as well
            const statsRes = await getSystemStats();
            setStats(statsRes);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                experience: parseInt(formData.experience)
            };

            if (editingId) {
                await api.put(`/api/doctors/${editingId}`, data);
            } else {
                await api.post('/api/doctors', data);
            }

            setFormData({ name: '', specialist: '', experience: '', email: '', password: 'password123' });
            setEditingId(null);
            setError('');
            fetchDoctors();
        } catch (err) {
            console.error('Error saving doctor:', err);
            setError('Failed to save doctor. Please try again.');
        }
    };

    const handleEdit = (doctor) => {
        setFormData({
            name: doctor.name,
            specialist: doctor.specialist,
            experience: doctor.experience,
            email: doctor.email,
            password: doctor.password || ''
        });
        setEditingId(doctor.doctorId);
        setActiveTab('doctors');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await api.delete(`/api/doctors/${id}`);
                fetchDoctors();
            } catch (err) {
                console.error('Error deleting doctor:', err);
                setError('Failed to delete doctor.');
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

            {/* Stats Cards */}
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
                <div style={{
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '24px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            {/* Tabs */}
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
                    View Patients
                </button>
            </div>

            {activeTab === 'doctors' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                    {/* Form Section */}
                    <div className="card" style={{ height: 'fit-content' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>
                            {editingId ? 'Edit Doctor' : 'Add New Doctor'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Dr. John Doe"
                                />
                            </div>

                            <div className="input-group">
                                <label>Specialist</label>
                                <input
                                    type="text"
                                    value={formData.specialist}
                                    onChange={(e) => setFormData({ ...formData, specialist: e.target.value })}
                                    required
                                    placeholder="Cardiologist"
                                />
                            </div>

                            <div className="input-group">
                                <label>Experience (Years)</label>
                                <input
                                    type="number"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    required
                                    placeholder="5"
                                    min="0"
                                />
                            </div>

                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="doctor@example.com"
                                />
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="text"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="password123"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                                <button type="submit" className="btn" style={{ flex: 1 }}>
                                    {editingId ? 'Update Doctor' : 'Add Doctor'}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        className="btn"
                                        style={{ backgroundColor: '#6b7280' }}
                                        onClick={() => {
                                            setEditingId(null);
                                            setFormData({ name: '', specialist: '', experience: '', email: '', password: 'password123' });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List Section */}
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
                                    {doctors.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                                                No doctors found. Add one to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        doctors.map((doctor) => (
                                            <tr key={doctor.doctorId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '12px' }}>{doctor.name}</td>
                                                <td style={{ padding: '12px' }}>{doctor.specialist}</td>
                                                <td style={{ padding: '12px' }}>{doctor.experience}y</td>
                                                <td style={{ padding: '12px' }}>{doctor.email}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <button
                                                        onClick={() => handleEdit(doctor)}
                                                        style={{
                                                            marginRight: '16px',
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#4f46e5',
                                                            cursor: 'pointer',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(doctor.doctorId)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#ef4444',
                                                            cursor: 'pointer',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
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
                                </tr>
                            </thead>
                            <tbody>
                                {patients.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                                            No patients registered yet.
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map((patient) => (
                                        <tr key={patient.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '12px' }}>#{patient.id}</td>
                                            <td style={{ padding: '12px' }}>{patient.name}</td>
                                            <td style={{ padding: '12px' }}>{patient.email}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    backgroundColor: '#e0e7ff',
                                                    color: '#4f46e5',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px'
                                                }}>
                                                    {patient._count?.Appointments || 0}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
