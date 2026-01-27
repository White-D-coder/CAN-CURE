import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { User, Lock, Activity, ArrowRight, AlertCircle } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('sarah.wilson@medcan.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Both fields are required");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await api.post('/login', {
                identifier: email,
                password
            });

            login(res.data.token, {
                ...res.data.user,
                role: res.data.role
            });

            if (res.data.role === 'admin') {
                navigate('/admin');
            } else if (res.data.role === 'doctor') {
                navigate('/doctors');
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Login failed'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-6 sm:p-10"
                style={{ width: '100%', maxWidth: '450px' }}
            >

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.1
                        }}
                        style={{
                            width: '64px',
                            height: '64px',
                            background:
                                'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow:
                                '0 10px 25px -5px rgba(2, 132, 199, 0.4)'
                        }}
                    >
                        <Activity size={32} color="white" />
                    </motion.div>

                    <h2
                        style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            marginBottom: '8px'
                        }}
                    >
                        Welcome Back
                    </h2>

                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        Sign in to access the medical portal
                    </p>
                </div>


                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            background: '#fef2f2',
                            border: '1px solid #fee2e2',
                            color: '#ef4444',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.9rem'
                        }}
                    >
                        <AlertCircle size={18} />
                        {error}
                    </motion.div>
                )}


                <form onSubmit={handleLogin}>

                    <div className="input-group">
                        <label>Email or Username</label>

                        <div style={{ position: 'relative' }}>
                            <User
                                size={20}
                                className="input-icon"
                                style={{
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Enter your email or username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>


                    <div className="input-group">
                        <label>Password</label>

                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={20}
                                className="input-icon"
                                style={{
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                            />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>


                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn"
                        style={{ width: '100%', marginTop: '8px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            'Signing in...'
                        ) : (
                            <>
                                Sign In <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </form>


                <p
                    style={{
                        marginTop: '24px',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem'
                    }}
                >
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ fontWeight: '600' }}>
                        Create Account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

export default Login;
