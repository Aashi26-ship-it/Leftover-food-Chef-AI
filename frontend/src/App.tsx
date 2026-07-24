import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingMascot } from './components/AIChefMascot';
import { FloatingBackground, PageTransition } from './components/PremiumUI';
import { Home } from './pages/Home';
import { Pantry } from './pages/Pantry';
import { Recipes } from './pages/Recipes';
import { Shopping } from './pages/Shopping';
import { Planner } from './pages/Planner';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PantryProvider } from './context/PantryContext';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <FloatingBackground />
      <div className="relative min-h-screen">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/pantry"
              element={
                <PageTransition>
                  <Pantry />
                </PageTransition>
              }
            />
            <Route
              path="/recipes"
              element={
                <PageTransition>
                  <Recipes />
                </PageTransition>
              }
            />
            <Route
              path="/shopping"
              element={
                <PageTransition>
                  <Shopping />
                </PageTransition>
              }
            />
            <Route
              path="/planner"
              element={
                <PageTransition>
                  <Planner />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />
            <Route
              path="/register"
              element={
                <PageTransition>
                  <Register />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>

        <Footer />
        <FloatingMascot />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PantryProvider>
        <Router>
          <AppContent />
        </Router>
      </PantryProvider>
    </AuthProvider>
  );
}

export default App;
