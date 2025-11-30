import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/signup', {
                username,
                email,
                password
            });

            login(response.data.token, { email, username });
            navigate('/doctors');
        } catch (err) {
            console.error("Signup Error:", err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '64px' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Sign Up</h2>

                {error && (
                    <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="btn" style={{ width: '100%', marginTop: '16px' }}>
                        Create Account
                    </button>
                </form>

                <p style={{ marginTop: '16px', textAlign: 'center' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
