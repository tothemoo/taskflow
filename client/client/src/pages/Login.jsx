
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../auth.css';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            const { token, user } = response.data;

            login(token, user);
            navigate('/dashboard');
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'An error occurred. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    {/* Branding Section */}
                    <div className="col-lg-6 auth-brand-panel d-none d-lg-flex">
                        <div className="auth-brand-content">
                            <div className="brand-logo mb-5">
                                <span className="brand-icon">T</span>
                                <span>TaskFlow</span>
                            </div>

                            <div className="brand-message">
                                <span className="brand-tagline">
                                    WORK SMARTER. BUILD BETTER.
                                </span>

                                <h1>
                                    Bring your team's work
                                    <span> together.</span>
                                </h1>

                                <p>
                                    Plan projects, organize tasks, collaborate
                                    with your team and keep everything moving
                                    forward — all in one place.
                                </p>
                            </div>

                            <div className="brand-footer">
                                © 2026 TaskFlow. Built for productive teams.
                            </div>
                        </div>
                    </div>

                    {/* Login Section */}
                    <div className="col-lg-6 auth-form-panel">
                        <div className="auth-mobile-brand d-lg-none">
                            <span className="brand-icon">T</span>
                            <span>TaskFlow</span>
                        </div>

                        <div className="auth-form-wrapper">
                            <div className="auth-heading">
                                <span className="auth-eyebrow">
                                    WELCOME BACK
                                </span>

                                <h2>Sign in to your account</h2>

                                <p>
                                    Enter your credentials to access your workspace.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-4">
                                    <label htmlFor="email" className="auth-label">
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        className="form-control auth-input"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="auth-label">
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        className="form-control auth-input"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="alert alert-danger auth-error">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn auth-submit-btn w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                    {!loading && <span>→</span>}
                                </button>

                            </form>

                            <div className="auth-register-link">
                                Don't have an account?{' '}
                                <Link to="/register">
                                    Create an account
                                </Link>
                            </div>

                            <div className="auth-security-note">
                                <span>🔒</span>
                                Your workspace is protected and secure.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
