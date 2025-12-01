import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ margin: 0 }}>Patient Dashboard</h1>
                <button
                    onClick={logout}
                    className="btn"
                    style={{ backgroundColor: '#ef4444', padding: '8px 16px' }}
                >
                    Logout
                </button>
            </div>

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
        </div>
    );
};

export default UserDashboard;
