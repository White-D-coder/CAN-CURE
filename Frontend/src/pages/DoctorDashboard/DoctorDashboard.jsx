import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDoctorAppointments, getPatientDetails } from '../../api/doctor';

const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Medical History</h3>
                            {selectedPatient.medicines && selectedPatient.medicines.length > 0 ? (
                                <ul style={{ paddingLeft: '20px' }}>
                                    {selectedPatient.medicines.map((med) => (
                                        <li key={med.medId} style={{ marginBottom: '8px' }}>
                                            <strong>{med.medName}</strong> - {med.dose} ({med.frequency})
                                            <br />
                                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{med.description}</span>
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
