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
  };

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