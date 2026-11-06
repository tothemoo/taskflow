
import React, { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../auth.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/users", {
                name: name.trim(),
                email: email.trim(),
                password
            });

            setSuccess(
                res.data.message || "Your account has been created successfully."
            );

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    {/* LEFT BRANDING PANEL */}
                    <div className="col-lg-6 auth-brand-panel d-none d-lg-flex">
                        <div className="auth-brand-content">

                            <div className="brand-logo mb-5">
                                <span className="brand-icon">T</span>
                                <span>TaskFlow</span>
                            </div>

                            <div className="brand-message">
                                <span className="brand-tagline">
                                    START WORKING SMARTER
                                </span>

                                <h1>
                                    Great work starts with <span>great teamwork.</span>
                                </h1>

                                <p>
                                    Create your workspace, bring your team together,
                                    organize your projects and turn your ideas into
                                    meaningful progress.
                                </p>
                            </div>

                            <div className="brand-footer">
                                © 2026 TaskFlow. Built for productive teams.
                            </div>

                        </div>
                    </div>

                    {/* RIGHT REGISTRATION PANEL */}
                    <div className="col-lg-6 auth-form-panel">

                        {/* MOBILE BRANDING */}
                        <div className="auth-mobile-brand d-lg-none">
                            <span className="brand-icon">T</span>
                            <span>TaskFlow</span>
                        </div>

                        <div className="auth-form-wrapper register-form-wrapper">

                            <div className="auth-heading">
                                <span className="auth-eyebrow">
                                    GET STARTED
                                </span>

                                <h2>Create your account</h2>

                                <p>
                                    Sign up to start managing your projects with TaskFlow.
                                </p>
                            </div>

                            {/* SUCCESS MESSAGE */}
                            {success && (
                                <div className="alert alert-success auth-error">
                                    {success}
                                    <div className="mt-2">
                                        <Link to="/login" className="auth-success-link">
                                            Continue to sign in
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* ERROR MESSAGE */}
                            {error && (
                                <div className="alert alert-danger auth-error">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleRegister}>

                                {/* FULL NAME */}
                                <div className="mb-3">
                                    <label htmlFor="name" className="auth-label">
                                        Full name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        className="form-control auth-input"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="name"
                                        required
                                    />
                                </div>

                                {/* EMAIL */}
                                <div className="mb-3">
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

                                {/* PASSWORD */}
                                <div className="mb-3">
                                    <label htmlFor="password" className="auth-label">
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        className="form-control auth-input"
                                        placeholder="At least 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="auth-label">
                                        Confirm password
                                    </label>

                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        className="form-control auth-input"
                                        placeholder="Enter your password again"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>

                                {/* SUBMIT BUTTON */}
                                <button
                                    type="submit"
                                    className="btn auth-submit-btn w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Creating account..." : "Create account"}
                                    {!loading && <span>→</span>}
                                </button>

                            </form>

                            {/* LOGIN LINK */}
                            <div className="auth-register-link">
                                Already have an account?{" "}
                                <Link to="/login">Sign in</Link>
                            </div>

                            <div className="auth-security-note">
                                <span>🔒</span> Your information is protected and secure.
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;
