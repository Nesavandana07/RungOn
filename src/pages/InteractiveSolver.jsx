import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { solveRK4Detailed } from '../engine/rk4';
import { jsPDF } from 'jspdf';

const InteractiveSolver = ({ onBack }) => {
    const [ode, setOde] = useState('x + y');
    const [x0, setX0] = useState(0);
    const [y0, setY0] = useState(1);
    const [h, setH] = useState(0.1);
    const [xTarget, setXTarget] = useState(1);
    const [results, setResults] = useState([]);
    const [isSolving, setIsSolving] = useState(false);
    const [playingStep, setPlayingStep] = useState(null);

    // Safe MathJax rendering
    useEffect(() => {
        if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
            window.MathJax.typesetPromise().catch((err) => console.log('MathJax error:', err));
        }
    }, [results, ode]);

    const handleSolve = () => {
        setIsSolving(true);
        setTimeout(() => {
            try {
                const steps = solveRK4Detailed(ode, Number(x0), Number(y0), Number(h), Number(xTarget));
                setResults(steps);
            } catch (error) {
                console.error("Calculation Error:", error);
                alert("There was an error in the calculation. Please check your formula.");
            }
            setIsSolving(false);
        }, 400);
    };

    const stopSpeech = () => {
        window.speechSynthesis.cancel();
        setPlayingStep(null);
    };

    const speakStep = (step) => {
        if (playingStep === step.step) {
            stopSpeech();
            return;
        }

        window.speechSynthesis.cancel();
        const text = `Step ${step.step} Explanation. 
        First, we calculate k 1 using the slope at the start of the interval, which is ${step.substitutions.k1}. 
        Next, we find k 2 by estimating the slope at the midpoint using k 1 divided by 2, giving ${step.substitutions.k2}. 
        Then k 3 is another midpoint estimate using k 2, resulting in ${step.substitutions.k3}. 
        Finally, k 4 is the slope at the end of the interval, ${step.substitutions.k4}. 
        By taking a weighted average of these slopes, we find that the next y value at x equals ${step.x.toFixed(2)} is ${step.y.toFixed(6)}.`;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setPlayingStep(step.step);
        utterance.onend = () => setPlayingStep(null);
        utterance.onerror = () => setPlayingStep(null);

        window.speechSynthesis.speak(utterance);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(15, 23, 42);
        doc.text('RungOn', 20, 25);
        doc.setFontSize(16);
        doc.text('Manual RK-4 Calculation Report', 20, 35);
        doc.setDrawColor(226, 232, 240);
        doc.line(20, 40, 190, 40);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text(`Problem ODE: dy/dx = ${ode}`, 20, 50);
        doc.text(`Step Size (h): ${h}`, 20, 57);
        doc.text(`Range: [${x0}, ${xTarget}] with y(0) = ${y0}`, 20, 64);

        let yPos = 80;
        results.slice(1).forEach((s) => {
            if (yPos > 250) { doc.addPage(); yPos = 25; }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(15, 23, 42);
            doc.text(`Step ${s.step}: x = ${s.x.toFixed(4)}`, 20, yPos);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(51, 65, 85);
            doc.text(s.substitutions.k1, 25, yPos + 8);
            doc.text(s.substitutions.k2, 25, yPos + 14);
            doc.text(s.substitutions.k3, 25, yPos + 20);
            doc.text(s.substitutions.k4, 25, yPos + 26);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(20, 184, 166);
            doc.text(`Result: y = ${s.y.toFixed(6)}`, 25, yPos + 34);
            yPos += 45;
        });

        doc.save(`RungOn_Calculation_${new Date().getTime()}.pdf`);
    };

    return (
        <motion.div
            className="solver-layout"
            style={{ padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.button
                onClick={onBack}
                className="back-link"
                style={{ background: 'none', border: 'none', color: '#14b8a6', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
                whileHover={{ x: -5 }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                Back to Mode Selection
            </motion.button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }}>
                <motion.div
                    className="mode-card"
                    style={{ padding: '2rem', height: 'fit-content', textAlign: 'left', alignItems: 'flex-start' }}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <h2 className="mode-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Manual Solver</h2>

                    <div className="form-group" style={{ width: '100%' }}>
                        <label className="form-label">ODE Formulation</label>
                        <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '12px', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 700, textAlign: 'center' }}>
                            {"\\(\\frac{dy}{dx} = " + ode + "\\)"}
                        </div>
                        <input type="text" value={ode} onChange={(e) => setOde(e.target.value)} className="input-field" placeholder="e.g., x + y" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                        <div className="form-group">
                            <label className="form-label">{"\\(x_0\\)"}</label>
                            <input type="number" value={x0} onChange={(e) => setX0(e.target.value)} className="input-field" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{"\\(y_0\\)"}</label>
                            <input type="number" value={y0} onChange={(e) => setY0(e.target.value)} className="input-field" />
                        </div>
                    </div>

                    <button onClick={handleSolve} disabled={isSolving} className="btn-login" style={{ marginTop: '1rem' }}>
                        {isSolving ? 'Solving...' : 'Start Calculation'}
                    </button>
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <AnimatePresence>
                        {results.length > 0 ? (
                            <>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}
                                >
                                    <h3 className="mode-title" style={{ fontSize: '1.25rem', marginBottom: 0 }}>Calculation Breakdown</h3>
                                    <button className="mode-btn" onClick={generatePDF} style={{ background: 'var(--primary)', color: 'var(--white)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                        Download PDF
                                    </button>
                                </motion.div>

                                {results.slice(1).map((step, idx) => (
                                    <motion.div
                                        key={step.step}
                                        className="mode-card"
                                        style={{ padding: '1.5rem', textAlign: 'left', alignItems: 'stretch' }}
                                        initial={{ x: 30, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>Step {step.step} | x = {step.x.toFixed(2)}</span>
                                            <button onClick={() => speakStep(step)} style={{ background: playingStep === step.step ? 'var(--accent)' : 'var(--background)', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', color: playingStep === step.step ? 'white' : 'var(--text)', transition: 'all 0.3s ease' }}>
                                                {playingStep === step.step ? (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="14" height="14" x="5" y="5" rx="2" /></svg>
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                                                )}
                                            </button>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            {[1, 2, 3, 4].map(k => (
                                                <div key={k} style={{ padding: '1rem', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{"\\(k_" + k + "\\)"}</p>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{step.substitutions['k' + k]}</p>
                                                    <p style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>= {step['k' + k].toFixed(6)}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--accent)', color: 'white', borderRadius: '12px', fontWeight: 800 }}>
                                            {"Next \\(y_{" + (idx + 1) + "}\\) = " + step.y.toFixed(6)}
                                        </div>
                                    </motion.div>
                                ))}
                            </>
                        ) : (
                            <motion.div
                                style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: '24px', padding: '3rem' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p>Enter values and click "Start Calculation" to see results.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default InteractiveSolver;
