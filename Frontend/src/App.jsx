import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import MedicalHistory from './pages/UserDashboard/MedicalHistory';
import Medications from './pages/UserDashboard/Medications';
import Reports from './pages/UserDashboard/Reports';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <AdminDashboard />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/doctors"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <DoctorDashboard />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <UserDashboard />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/dashboard/history"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <MedicalHistory />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/dashboard/medications"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Medications />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/dashboard/reports"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Reports />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
