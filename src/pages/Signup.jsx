import React, { useState } from 'react';

const Signup = ({ onBackToLogin, onSignup }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Signing up:', { name, email, password });
        onSignup(); // For now, just transition to the next step
    };

    return (
        <div className="login-container animate-fade-in">
            <h1 className="brand-title">RungOn</h1>
            <p className="brand-subtitle">Join the RK Method Learning Platform</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        className="input-field"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        className="input-field"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="input-field"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-login">
                    Create Account
                </button>
            </form>

            <p className="footer-text">
                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onBackToLogin(); }} className="footer-link">Log in</a>
            </p>
        </div>
    );
};

export default Signup;
