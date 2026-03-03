import React from 'react';
import { motion } from 'framer-motion';

const ModeSelection = ({ onSelect }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="selection-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="mode-card"
                onClick={() => onSelect('interactive')}
                variants={itemVariants}
                whileHover={{ scale: 1.05, translateY: -10 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="mode-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10" /><path d="M7 12h10" /><path d="M7 17h10" /></svg>
                </div>
                <h2 className="mode-title">Interactive Mode</h2>
                <p className="mode-desc">
                    Universal RK-4 solver with step-by-step tutorials, live graphing, and voice explanations.
                </p>
                <button className="mode-btn">Enter Solver</button>
            </motion.div>

            <motion.div
                className="mode-card"
                onClick={() => onSelect('game')}
                variants={itemVariants}
                whileHover={{ scale: 1.05, translateY: -10 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="mode-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /><path d="M10 8h.01" /><path d="M14 8h.01" /><path d="M10 11a4 4 0 0 0 4 0" /></svg>
                </div>
                <h2 className="mode-title">Game Mode</h2>
                <p className="mode-desc">
                    Challenge yourself with increasingly difficult ODE levels. Earn stars and climb the leaderboard.
                </p>
                <button className="mode-btn">Start Challenge</button>
            </motion.div>
        </motion.div>
    );
};

export default ModeSelection;
