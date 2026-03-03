import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const PathfinderRK4 = ({ onBack, onComplete }) => {
    const [level, setLevel] = useState(1);
    const [userK, setUserK] = useState({ k4: '' });
    const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
    const [feedback, setFeedback] = useState('');

    const levels = {
        1: {
            ode: 'dy/dx = x + y',
            latex: '\\frac{dy}{dx} = x + y',
            x0: 0,
            y0: 1,
            h: 0.5,
            targetY: 1.7969,
            k4: 1.15625
        },
        2: {
            ode: 'dy/dx = x^2 - y',
            latex: '\\frac{dy}{dx} = x^2 - y',
            x0: 0,
            y0: 1,
            h: 0.4,
            targetY: 0.6703,
            k4: -0.224
        }
    };

    const currentLevel = levels[level];

    useEffect(() => {
        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }, [level, gameStatus]);

    const speakFeedback = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const handleJump = () => {
        const userFinalK = Number(userK.k4);
        const error = Math.abs(userFinalK - currentLevel.k4);

        if (error < 0.1) {
            setGameStatus('won');
            setFeedback(`Perfect Jump! Level ${level} Mastered.`);
            speakFeedback('Excellent navigation! You landed perfectly on the target path.');
            onComplete(5); // Grant 5 stars
        } else {
            setGameStatus('lost');
            const msg = `Numerical Crash! You missed the target. Your k4 calculation was too far off. Correct value was approximately ${currentLevel.k4}.`;
            setFeedback(msg);
            speakFeedback(msg);
        }
    };

    const chartData = {
        datasets: [
            {
                label: 'Target Path',
                data: [{ x: currentLevel.x0, y: currentLevel.y0 }, { x: currentLevel.x0 + currentLevel.h, y: currentLevel.targetY }],
                borderColor: '#14b8a6',
                backgroundColor: '#14b8a6',
                showLine: true,
                tension: 0.4
            },
            {
                label: 'Your Path',
                data: [{ x: currentLevel.x0, y: currentLevel.y0 }, { x: currentLevel.x0 + currentLevel.h, y: gameStatus === 'won' ? currentLevel.targetY : currentLevel.y0 + (currentLevel.targetY - currentLevel.y0) * 0.5 }],
                borderColor: gameStatus === 'lost' ? '#ef4444' : '#3b82f6',
                borderDash: [5, 5],
                showLine: true
            }
        ]
    };

    return (
        <motion.div
            className="hub-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="pathfinder-layout">
                <motion.div
                    className="grid-card"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="mode-title" style={{ fontSize: '1.25rem', margin: 0 }}>Coordinate Grid</h3>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>Level {level}</span>
                    </div>
                    <div style={{ height: '400px' }}>
                        <Scatter
                            data={chartData}
                            options={{
                                scales: {
                                    x: { min: currentLevel.x0, max: currentLevel.x0 + 1 },
                                    y: { min: currentLevel.y0 - 0.5, max: currentLevel.y0 + 1.5 }
                                },
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        labels: { color: 'var(--text)' }
                                    }
                                }
                            }}
                        />
                    </div>
                    <AnimatePresence>
                        {gameStatus !== 'playing' && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: gameStatus === 'won' ? '#ecfdf5' : '#fef2f2', color: gameStatus === 'won' ? '#064e3b' : '#7f1d1d', fontWeight: 700 }}
                            >
                                {feedback}
                                {gameStatus === 'won' && level < 2 && (
                                    <button onClick={() => { setLevel(2); setGameStatus('playing'); setUserK({ k4: '' }); }} className="mode-btn" style={{ marginTop: '1rem', width: '100%', background: 'var(--accent)', color: 'white' }}>Next Level</button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div
                    className="control-card"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <h3 className="mode-title" style={{ fontSize: '1.25rem' }}>Ship Controls</h3>
                    <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '16px', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Current Equation:</p>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {currentLevel.latex}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            At \( (x_0, y_0) = ({currentLevel.x0}, {currentLevel.y0}) \) with \( h = {currentLevel.h} \)
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Calculate \( k_4 \)</label>
                        <input
                            type="number"
                            className="input-field"
                            value={userK.k4}
                            onChange={(e) => setUserK({ ...userK, k4: e.target.value })}
                            placeholder="Enter result..."
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleJump}
                        className="btn-login"
                        style={{ marginTop: '1rem' }}
                    >
                        Initiate Jump
                    </motion.button>

                    <button onClick={onBack} className="btn-login" style={{ marginTop: '1rem', background: 'var(--background)', color: 'var(--text)' }}>Abandom Mission</button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PathfinderRK4;
