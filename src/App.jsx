import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ModeSelection from './pages/ModeSelection';
import InteractiveSolver from './pages/InteractiveSolver';
import GameHub from './pages/GameHub';
import RKQuiz from './pages/RKQuiz';
import PathfinderRK4 from './pages/PathfinderRK4';

function App() {
  const [view, setView] = useState('login');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Global User Stats
  const [stats, setStats] = useState({
    stars: 12,
    level: 5,
    accuracy: 92,
    exp: 450,
    maxExp: 1000
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addStars = (amount) => {
    setStats(prev => ({
      ...prev,
      stars: prev.stars + amount,
      exp: prev.exp + (amount * 50)
    }));
  };

  const updateAccuracy = (newAcc) => {
    setStats(prev => ({
      ...prev,
      accuracy: Math.round((prev.accuracy + newAcc) / 2)
    }));
  };

  useEffect(() => {
    if (stats.exp >= stats.maxExp) {
      setStats(prev => ({
        ...prev,
        level: prev.level + 1,
        exp: prev.exp - prev.maxExp,
        maxExp: prev.maxExp + 500
      }));
    }
  }, [stats.exp]);

  const handleLogin = () => setView('selection');
  const handleSignup = () => setView('selection');

  const handleModeSelect = (mode) => {
    if (mode === 'interactive') setView('solver');
    else if (mode === 'game') setView('gamehub');
  };

  const handleGameSelect = (game) => {
    if (game === 'quiz') setView('quiz');
    if (game === 'pathfinder') setView('pathfinder');
  };

  return (
    <div className="app">
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
        {theme === 'light' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
        )}
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="view-wrapper"
        >
          {view === 'login' && <Login onLogin={handleLogin} onSignupClick={() => setView('signup')} />}
          {view === 'signup' && <Signup onBackToLogin={() => setView('login')} onSignup={handleSignup} />}
          {view === 'selection' && <ModeSelection onSelect={handleModeSelect} />}
          {view === 'solver' && <InteractiveSolver onBack={() => setView('selection')} />}

          {view === 'gamehub' && (
            <GameHub
              stats={stats}
              onSelect={handleGameSelect}
              onBack={() => setView('selection')}
            />
          )}

          {view === 'quiz' && (
            <RKQuiz
              onBack={() => setView('gamehub')}
              onComplete={(earnedStars, acc) => {
                addStars(earnedStars);
                updateAccuracy(acc);
              }}
            />
          )}

          {view === 'pathfinder' && (
            <PathfinderRK4
              onBack={() => setView('gamehub')}
              onComplete={(earnedStars) => addStars(earnedStars)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
