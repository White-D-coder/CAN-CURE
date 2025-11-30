import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        specialist: '',
        experience: '',
        email: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const { logout } = useAuth();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/api/doctors');
            setDoctors(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError('Failed to load doctors.');
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

            setFormData({ name: '', specialist: '', experience: '', email: '' });
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
            email: doctor.email
        });
        setEditingId(doctor.doctorId);
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
                <h1 style={{ margin: 0 }}>Doctor Management</h1>
                <button
                    onClick={logout}
                    className="btn"
                    style={{ backgroundColor: '#ef4444', padding: '8px 16px' }}
                >
                    Logout
                </button>
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
                                        setFormData({ name: '', specialist: '', experience: '', email: '' });
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
        </div>
    );
};

export default DoctorDashboard;
