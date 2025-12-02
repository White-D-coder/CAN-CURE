import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDoctorAppointments, getPatientDetails, addPrescription, updatePrescription } from '../../api/doctor';

const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
    };

    const handlePrescriptionSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPrescriptionId) {
                await updatePrescription(user.id, selectedPatient.id, editingPrescriptionId, prescriptionForm);
            } else {
                await addPrescription(user.id, selectedPatient.id, prescriptionForm);
            }
            // Refresh patient details
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

    if (loading && !selectedPatient) return <div className="container" style={{ padding: '32px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Doctor Dashboard</h1>
                    <p style={{ margin: '8px 0 0', color: '#6b7280' }}>Welcome, Dr. {user?.name}</p>
                </div>
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

            {!selectedPatient ? (
                <div className="card">
                    <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Your Appointments</h2>
                    {appointments.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: '32px' }}>No appointments scheduled.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                                        <th style={{ padding: '12px' }}>Date</th>
                                        <th style={{ padding: '12px' }}>Time</th>
                                        <th style={{ padding: '12px' }}>Patient Name</th>
                                        <th style={{ padding: '12px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((apt) => (
                                        <tr key={apt.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '12px' }}>{apt.date}</td>
                                            <td style={{ padding: '12px' }}>{apt.time}</td>
                                            <td style={{ padding: '12px' }}>{apt.user.name}</td>
                                            <td style={{ padding: '12px' }}>
                                                <button
                                                    onClick={() => handleViewPatient(apt.userId)}
                                                    className="btn"
                                                    style={{ padding: '6px 12px', fontSize: '14px' }}
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
                <div>
                    <button
                        onClick={closePatientView}
                        style={{
                            marginBottom: '24px',
                            background: 'none',
                            border: 'none',
                            color: '#4f46e5',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '16px'
                        }}
                    >
                        ← Back to Appointments
                    </button>

                    <div className="card" style={{ marginBottom: '32px' }}>
                        <h2 style={{ marginTop: 0 }}>Patient: {selectedPatient.name}</h2>
                        <p style={{ color: '#6b7280' }}>Email: {selectedPatient.email}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ marginTop: 0 }}>Medical History</h3>
                                <button
                                    onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                                    className="btn"
                                    style={{ padding: '4px 8px', fontSize: '12px' }}
                                >
                                    {showPrescriptionForm ? 'Cancel' : '+ Add Prescription'}
                                </button>
                            </div>

                            {showPrescriptionForm && (
                                <form onSubmit={handlePrescriptionSubmit} style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                                    <div style={{ marginBottom: '12px' }}>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Medicine Name</label>
                                        <input
                                            type="text"
                                            value={prescriptionForm.medName}
                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medName: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '12px' }}>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Description</label>
                                        <input
                                            type="text"
                                            value={prescriptionForm.description}
                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, description: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Dose</label>
                                            <input
                                                type="text"
                                                value={prescriptionForm.dose}
                                                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dose: e.target.value })}
                                                required
                                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Frequency</label>
                                            <input
                                                type="text"
                                                value={prescriptionForm.frequency}
                                                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })}
                                                required
                                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Start Date</label>
                                            <input
                                                type="date"
                                                value={prescriptionForm.startDate}
                                                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, startDate: e.target.value })}
                                                required
                                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>End Date</label>
                                            <input
                                                type="date"
                                                value={prescriptionForm.endDate}
                                                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, endDate: e.target.value })}
                                                required
                                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn" style={{ width: '100%' }}>
                                        {editingPrescriptionId ? 'Update Prescription' : 'Add Prescription'}
                                    </button>
                                </form>
                            )}

                            {selectedPatient.medicines && selectedPatient.medicines.length > 0 ? (
                                <ul style={{ paddingLeft: '20px' }}>
                                    {selectedPatient.medicines.map((med) => (
                                        <li key={med.medId} style={{ marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <div>
                                                    <strong>{med.medName}</strong> - {med.dose} ({med.frequency})
                                                    <br />
                                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{med.description}</span>
                                                    <br />
                                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                                        {new Date(med.startDate).toLocaleDateString()} - {new Date(med.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleEditPrescription(med)}
                                                    style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '12px' }}
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: '#6b7280' }}>No medicine history found.</p>
                            )}

                            {selectedPatient.CancerType && selectedPatient.CancerType.length > 0 && (
                                <div style={{ marginTop: '24px' }}>
                                    <h4 style={{ marginBottom: '8px' }}>Cancer Diagnosis</h4>
                                    {selectedPatient.CancerType.map((cancer) => (
                                        <div key={cancer.cancerId} style={{ marginBottom: '12px' }}>
                                            <strong>{cancer.name} (Stage {cancer.stage})</strong>
                                            <p style={{ margin: '4px 0', fontSize: '14px' }}>{cancer.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="card">
                            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Lab Reports</h3>
                            {selectedPatient.Reports && selectedPatient.Reports.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {selectedPatient.Reports.map((report) => (
                                        <li key={report.reportId} style={{
                                            padding: '12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            marginBottom: '12px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <strong>{report.reportName}</strong>
                                                <br />
                                                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    {new Date(report.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <a
                                                href={report.reportUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#4f46e5', textDecoration: 'none' }}
                                            >
                                                View
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: '#6b7280' }}>No lab reports uploaded.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
