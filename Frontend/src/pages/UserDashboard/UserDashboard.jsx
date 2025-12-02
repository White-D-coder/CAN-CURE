import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardData } from '../../api/user';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDashboardData();
                setDashboardData(data);
            } catch (err) {
                setError("Failed to load dashboard data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="dashboard-section">
                        <h3>Welcome back, {user?.name}</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h4>Appointments</h4>
                                <p>{dashboardData?.Appointments?.length || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h4>Prescriptions</h4>
                                <p>{dashboardData?.medicines?.length || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h4>Reports</h4>
                                <p>{dashboardData?.Reports?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'appointments':
                return (
                    <div className="dashboard-section">
                        <h3>My Appointments</h3>
                        {dashboardData?.Appointments?.length > 0 ? (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Doctor</th>
                                            <th>Specialist</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.Appointments.map((apt) => (
                                            <tr key={apt.id}>
                                                <td>{apt.doctor?.name}</td>
                                                <td>{apt.doctor?.specialist}</td>
                                                <td>{new Date(apt.date).toLocaleDateString()}</td>
                                                <td>{apt.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No appointments found.</p>
                        )}
                    </div>
                );
            case 'prescriptions':
                return (
                    <div className="dashboard-section">
                        <h3>My Prescriptions</h3>
                        {dashboardData?.medicines?.length > 0 ? (
                            <div className="cards-grid">
                                {dashboardData.medicines.map((med) => (
                                    <div key={med.medId} className="card">
                                        <h4>{med.medName}</h4>
                                        <p><strong>Dose:</strong> {med.dose}</p>
                                        <p><strong>Frequency:</strong> {med.frequency}</p>
                                        <p><strong>Duration:</strong> {new Date(med.startDate).toLocaleDateString()} - {new Date(med.endDate).toLocaleDateString()}</p>
                                        <p><strong>Doctor:</strong> {med.doctor?.name}</p>
                                        <p className="description">{med.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No prescriptions found.</p>
                        )}
                    </div>
                );
            case 'reports':
                return (
                    <div className="dashboard-section">
                        <h3>My Reports</h3>
                        {dashboardData?.Reports?.length > 0 ? (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Report Name</th>
                                            <th>Date</th>
                                            <th>Doctor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.Reports.map((report) => (
                                            <tr key={report.id}>
                                                <td>{report.reportName}</td>
                                                <td>{new Date(report.date).toLocaleDateString()}</td>
                                                <td>{report.doctor?.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No reports found.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
            </div >

    <div className="card" style={{ padding: '32px' }}>
        <h2>Welcome, {user?.name || 'Patient'}!</h2>
        <p style={{ color: '#6b7280', marginTop: '16px' }}>
            This is your personal health dashboard.
        </p>

        <div style={{ marginTop: '32px', padding: '24px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Your Health Overview</h3>
            <p>No active appointments or medications found.</p>
        </div>
    </div>
        </div >
    );
};

export default UserDashboard;
