import React from 'react';
import { motion } from 'framer-motion';

const GameHub = ({ stats, onSelect, onBack }) => {
    const statItems = [
        { label: 'Total Stars', icon: '⭐', value: stats.stars },
        { label: 'Level', icon: '🏆', value: stats.level.toString().padStart(2, '0') },
        { label: 'Accuracy', icon: '🎯', value: `${stats.accuracy}%` },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="hub-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.button
                onClick={onBack}
                className="back-link"
                style={{ background: 'none', border: 'none', color: '#14b8a6', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
                whileHover={{ x: -5 }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                Back
            </motion.button>

            <motion.div className="stats-bar" variants={itemVariants}>
                {statItems.map((stat, i) => (
                    <div key={i} className="stat-item">
                        <span className="stat-icon">{stat.icon}</span>
                        <span>{stat.value}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500, marginLeft: '0.25rem' }}>{stat.label}</span>
                    </div>
                ))}
            </motion.div>

            <motion.h1 className="selection-title" variants={itemVariants}>Game Hub</motion.h1>
            <motion.p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }} variants={itemVariants}>Master Runge-Kutta through challenges.</motion.p>

            <div className="selection-container">
                <motion.div
                    className="mode-card"
                    onClick={() => onSelect('quiz')}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="mode-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                    </div>
                    <h2 className="mode-title">RK-Quiz</h2>
                    <p className="mode-desc">
                        Test your theory! Master the formulas and logic of Runge-Kutta in this timed challenge.
                    </p>
                    <button className="mode-btn">Start Quiz</button>
                </motion.div>

                <motion.div
                    className="mode-card"
                    onClick={() => onSelect('pathfinder')}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="mode-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M3 5h4" /><path d="M21 17v4" /><path d="M19 19h4" /></svg>
                    </div>
                    <h2 className="mode-title">Pathfinder RK4</h2>
                    <p className="mode-desc">
                        The Ultimate Challenge. Navigate the curve using real-time calculations to reach the target.
                    </p>
                    <button className="mode-btn">Enter Pathfinder</button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default GameHub;
