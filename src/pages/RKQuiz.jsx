import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RKQuiz = ({ onBack, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    const questions = [
        {
            text: "What is the correct formula for \\(k_2\\) in RK-4?",
            options: [
                "\\(h \\cdot f(x_n + h, y_n + k_1)\\)",
                "\\(h \\cdot f(x_n + \\frac{h}{2}, y_n + \\frac{k_1}{2})\\)",
                "\\(h \\cdot f(x_n + \\frac{h}{2}, y_n + k_1)\\)",
                "\\(h \\cdot f(x_n, y_n + \\frac{k_1}{2})\\)"
            ],
            correct: 1
        },
        {
            text: "Given step size \\(h=0.2\\) and \\(x_n=1.0\\), what is the next x value \\(x_{n+1}\\)?",
            options: ["1.0", "1.1", "1.2", "1.4"],
            correct: 2
        },
        {
            text: "Which value of \\(k\\) is calculated at the end of the interval \\(x_n + h\\)?",
            options: ["\\(k_1\\)", "\\(k_2\\)", "\\(k_3\\)", "\\(k_4\\)"],
            correct: 3
        }
    ];

    useEffect(() => {
        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }, [currentQuestion, isFinished]);

    useEffect(() => {
        if (timeLeft > 0 && !showFeedback && !isFinished) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showFeedback && !isFinished) {
            handleAnswer(null);
        }
    }, [timeLeft, showFeedback, isFinished]);

    const handleAnswer = (index) => {
        setSelectedOption(index);
        setShowFeedback(true);
        if (index === questions[currentQuestion].correct) {
            setScore(score + 10);
        }

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setTimeLeft(15);
                setShowFeedback(false);
                setSelectedOption(null);
            } else {
                setIsFinished(true);
                const earnedStars = Math.floor((score + (index === questions[currentQuestion].correct ? 10 : 0)) / 10);
                onComplete(earnedStars, Math.round(((score + (index === questions[currentQuestion].correct ? 10 : 0)) / 30) * 100));
            }
        }, 1500);
    };

    return (
        <div className="hub-container">
            <motion.button
                onClick={onBack}
                className="back-link"
                style={{ background: 'none', border: 'none', color: '#14b8a6', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
                whileHover={{ x: -5 }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                Back
            </motion.button>

            <div className="quiz-container">
                <AnimatePresence mode="wait">
                    {!isFinished ? (
                        <motion.div
                            key={currentQuestion}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="timer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Question {currentQuestion + 1}/3</span>
                                <span>⏱️ {timeLeft}s</span>
                            </div>
                            <h2 className="mode-title" style={{ marginBottom: '2rem', minHeight: '3.5rem' }}>{questions[currentQuestion].text}</h2>

                            <div className="options-list">
                                {questions[currentQuestion].options.map((option, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => !showFeedback && handleAnswer(i)}
                                        className={`option-btn ${showFeedback && i === questions[currentQuestion].correct ? 'correct' :
                                            showFeedback && i === selectedOption ? 'wrong' : ''
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {option}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ textAlign: 'center' }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
                            <h2 className="mode-title">Quiz Complete!</h2>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                You scored {score}/30
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                {[...Array(Math.floor(score / 10))].map((_, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: i * 0.2 }}
                                        style={{ fontSize: '2rem' }}
                                    >
                                        ⭐
                                    </motion.span>
                                ))}
                            </div>
                            <button onClick={onBack} className="btn-login">Collect Rewards</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RKQuiz;
