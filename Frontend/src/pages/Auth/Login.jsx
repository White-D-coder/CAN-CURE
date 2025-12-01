import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Both fields are required");
            return;
        }

        try {
            const res = await api.post('/login', { identifier: email, password });
            login(res.data.token, { ...res.data.user, role: res.data.role });

            if (res.data.role === 'admin') {
                navigate('/admin');
            } else if (res.data.role === 'doctor') {
                navigate('/doctors');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '64px auto' }}>
            <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Login</h2>

                {error && (
                    <div style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email / Username</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        style={{ width: '100%', marginTop: 16 }}
                    >
                        Login
                    </button>
                </form>

                <p style={{ marginTop: 16, textAlign: 'center' }}>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
