import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';

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
                    path="/doctors"
                    element={
                        <PrivateRoute>
                            <DoctorDashboard />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/doctors" />} />
            </Routes>
        </Router>
    );
}

export default App;
