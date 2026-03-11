import React, { useState } from 'react';
import './App.css';
import RegisterPage from './pages/Register.jsx';
import LoginPage from './pages/Login.jsx';
import LandingPage from './pages/LandingPage.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('landing');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
    localStorage.removeItem('token');
    localStorage.removeItem('oauthMode');
  };

  // On first render check if we landed on oauth callback URL
  React.useEffect(() => {
    if (window.location.pathname === '/oauth/callback') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const mode = params.get('mode');
      if (token) {
        localStorage.setItem('token', token);
        // call login handler
        handleLogin();
        if (mode === 'register') {
          // maybe additional logic if needed
          setCurrentPage('landing');
        }
      }
      // clear the url to avoid confusion
      window.history.replaceState({}, document.title, '/');
      // cleanup stored mode
      localStorage.removeItem('oauthMode');
    }
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <LandingPage onLogout={handleLogout} />
      ) : currentPage === 'login' ? (
        <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />
      ) : (
        <RegisterPage onNavigate={setCurrentPage} />
      )}
    </div>
  );
}

export default App;