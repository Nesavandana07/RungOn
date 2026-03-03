import React, { useState } from 'react';

const Login = ({ onLogin, onSignupClick }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Logging in with:', username, password);
        onLogin();
    };

    return (
        <div className="login-container">
            <h1 className="brand-title">RungOn</h1>
            <p className="brand-subtitle">Interactive RK Method Learning & Solver</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        className="input-field"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    Sign In
                </button>
            </form>

            <p className="footer-text">
                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSignupClick(); }} className="footer-link">Sign up</a>
            </p>
        </div>
    );
};

export default Login;
