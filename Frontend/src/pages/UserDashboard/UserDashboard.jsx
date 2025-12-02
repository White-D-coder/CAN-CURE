import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardData, getDoctors, bookAppointment } from '../../api/user';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingData, setBookingData] = useState({
        doctorId: '',
        date: '',
        time: '',
        patientName: user?.name || ''
    });
    const [bookingStatus, setBookingStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDashboardData();
                setDashboardData(data);
                const docs = await getDoctors();
                setDoctors(docs);
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

    const handleBookingChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingStatus('Booking...');
        try {
            await bookAppointment(bookingData);
            setBookingStatus('Appointment booked successfully!');
            // Refresh dashboard data
            const data = await getDashboardData();
            setDashboardData(data);
            setBookingData({ doctorId: '', date: '', time: '', patientName: user?.name || '' });
        } catch (err) {
            setBookingStatus('Failed to book appointment.');
            console.error(err);
        }
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
            case 'book':
                return (
                    <div className="dashboard-section">
                        <h3>Book an Appointment</h3>
                        <form onSubmit={handleBookingSubmit} className="booking-form">
                            <div className="form-group">
                                <label>Select Doctor</label>
                                <select
                                    name="doctorId"
                                    value={bookingData.doctorId}
                                    onChange={handleBookingChange}
                                    required
                                >
                                    <option value="">-- Select Doctor --</option>
                                    {doctors.map(doc => (
                                        <option key={doc.doctorId} value={doc.doctorId}>
                                            {doc.name} ({doc.specialist})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={bookingData.date}
                                    onChange={handleBookingChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={bookingData.time}
                                    onChange={handleBookingChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Patient Name</label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={bookingData.patientName}
                                    onChange={handleBookingChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-btn">Book Appointment</button>
                            {bookingStatus && <p className="status-msg">{bookingStatus}</p>}
                        </form>
                    </div>
                );
            case 'prescriptions':
                return (
                    <div className="dashboard-section">
                        <h3>My Prescriptions</h3>
                        {dashboardData?.medicines?.length > 0 ? (
                            <div className="prescriptions-grid">
                                {dashboardData.medicines.map((med) => (
                                    <div key={med.medId} className="prescription-card">
                                        <div className="rx-header">
                                            <span className="rx-icon">💊</span>
                                            <h4>{med.medName}</h4>
                                            <span className="rx-status">Active</span>
                                        </div>
                                        <div className="rx-body">
                                            <div className="rx-detail">
                                                <label>Dosage</label>
                                                <p>{med.dose}</p>
                                            </div>
                                            <div className="rx-detail">
                                                <label>Frequency</label>
                                                <p>{med.frequency}</p>
                                            </div>
                                            <div className="rx-detail">
                                                <label>Duration</label>
                                                <p>{new Date(med.startDate).toLocaleDateString()} - {new Date(med.endDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="rx-detail full-width">
                                                <label>Instructions</label>
                                                <p>{med.description}</p>
                                            </div>
                                        </div>
                                        <div className="rx-footer">
                                            <p>Prescribed by: Dr. {med.doctor?.name}</p>
                                        </div>
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
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>Patient Portal</h2>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={activeTab === 'overview' ? 'active' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={activeTab === 'book' ? 'active' : ''}
                        onClick={() => setActiveTab('book')}
                    >
                        Book Appointment
                    </button>
                    <button
                        className={activeTab === 'appointments' ? 'active' : ''}
                        onClick={() => setActiveTab('appointments')}
                    >
                        Appointments
                    </button>
                    <button
                        className={activeTab === 'prescriptions' ? 'active' : ''}
                        onClick={() => setActiveTab('prescriptions')}
                    >
                        Prescriptions
                    </button>
                    <button
                        className={activeTab === 'reports' ? 'active' : ''}
                        onClick={() => setActiveTab('reports')}
                    >
                        Reports
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </nav>
            </div>
            <div className="main-content">
                {renderContent()}
            </div>
            <style>{`
                .dashboard-container {
                    display: flex;
                    min-height: 100vh;
                    background-color: #f5f7fa;
                }
                .sidebar {
                    width: 250px;
                    background-color: #ffffff;
                    box-shadow: 2px 0 5px rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                }
                .sidebar-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                }
                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                    padding: 20px 0;
                }
                .sidebar-nav button {
                    padding: 15px 20px;
                    text-align: left;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    color: #555;
                    transition: all 0.3s;
                }
                .sidebar-nav button:hover {
                    background-color: #f0f4f8;
                    color: #007bff;
                }
                .sidebar-nav button.active {
                    background-color: #e3f2fd;
                    color: #007bff;
                    border-right: 3px solid #007bff;
                }
                .sidebar-nav button.logout-btn {
                    margin-top: auto;
                    color: #dc3545;
                }
                .main-content {
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    text-align: center;
                }
                .stat-card h4 {
                    margin: 0;
                    color: #777;
                }
                .stat-card p {
                    font-size: 32px;
                    font-weight: bold;
                    color: #007bff;
                    margin: 10px 0 0;
                }
                .table-container {
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    overflow: hidden;
                    margin-top: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                th {
                    background-color: #f8f9fa;
                    font-weight: 600;
                }
                .cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                .card {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .card h4 {
                    margin-top: 0;
                    color: #007bff;
                }
                .description {
                    color: #666;
                    font-style: italic;
                    margin-top: 10px;
                }
                .booking-form {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    max-width: 500px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: #555;
                }
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 16px;
                }
                .submit-btn {
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    width: 100%;
                }
                .submit-btn:hover {
                    background-color: #0056b3;
                }
                .status-msg {
                    margin-top: 10px;
                    text-align: center;
                    color: #28a745;
                }
                
                /* Prescription Card Styles */
                .prescriptions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 24px;
                    margin-top: 20px;
                }
                .prescription-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    overflow: hidden;
                    border: 1px solid #eef2f6;
                    transition: transform 0.2s;
                }
                .prescription-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 12px rgba(0,0,0,0.1);
                }
                .rx-header {
                    background: #f8f9fa;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #eee;
                }
                .rx-icon {
                    font-size: 24px;
                    margin-right: 12px;
                }
                .rx-header h4 {
                    margin: 0;
                    flex: 1;
                    color: #333;
                    font-size: 18px;
                }
                .rx-status {
                    background: #e6f4ea;
                    color: #1e7e34;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                }
                .rx-body {
                    padding: 20px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                .rx-detail label {
                    display: block;
                    font-size: 12px;
                    color: #888;
                    margin-bottom: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .rx-detail p {
                    margin: 0;
                    color: #444;
                    font-weight: 500;
                }
                .rx-detail.full-width {
                    grid-column: span 2;
                }
                .rx-footer {
                    padding: 12px 20px;
                    background: #fafbfc;
                    border-top: 1px solid #eee;
                    font-size: 13px;
                    color: #666;
                }
            `}</style>
        </div>
    );
};

export default UserDashboard;
