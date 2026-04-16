import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import './App.css';
import RegisterPage from './pages/Register.jsx';
import LoginPage from './pages/Login.jsx';
import PatientQueue from './pages/PatientQueue.jsx';
import Consultation from './pages/Consultation';   
import MedicalHistory from './pages/MedicalHistory.jsx';



// ── Placeholder pages for sidebar nav ─────────────────────────────────────────
// Replace each of these with your real page components as you build them.
const PlaceholderPage = ({ title }) => (
  <div style={{
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', gap: 12, background: '#f5f5f7', minHeight: '100vh',
  }}>
    <div style={{ fontSize: 40 }}>🚧</div>
    <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{title}</div>
    <div style={{ fontSize: 14, color: '#666' }}>This page is under construction.</div>
  </div>
);

// Map sidebar keys → page components
// Swap PlaceholderPage out for your real imports when ready:
//   import PatientsPage    from './pages/Patients.jsx';
//   import MedicalStaff   from './pages/MedicalStaff.jsx';
//   import Consultation   from './pages/Consultation.jsx';
const PAGES = {
  queue:    (props) => <PatientQueue {...props} />,
  patients: ()     => <PlaceholderPage title="Patients" />,
  staff:    ()     => <PlaceholderPage title="Medical Staff" />,
  consult:  (props) => <Consultation {...props} />,  
  history:  (props) => <MedicalHistory {...props} />,   // <-- use real component
};

function App() {
  const [currentPage, setCurrentPage] = useState('login');   // auth routing
  const [activeSidebar, setActiveSidebar] = useState('queue'); // sidebar routing
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOauthSuccess, setShowOauthSuccess] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveSidebar('queue'); // always land on Patient Queue after login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
    setActiveSidebar('queue');
    localStorage.removeItem('token');
    localStorage.removeItem('oauthMode');
  };

  // OAuth callback handler
  React.useEffect(() => {
    if (window.location.pathname === '/oauth/callback') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const mode = params.get('mode');
      if (token) {
        localStorage.setItem('token', token);
        handleLogin();
        setShowOauthSuccess(true);
        setTimeout(() => setShowOauthSuccess(false), 1500);
        // 'register' mode used to go to landing — now just goes to queue
        if (mode === 'register') {
          setActiveSidebar('queue');
        }
      }
      window.history.replaceState({}, document.title, '/');
      localStorage.removeItem('oauthMode');
    }
  }, []);

  // Render the active sidebar page, passing onLogout + onNavigate as props
  const renderSidebarPage = () => {
    const PageComponent = PAGES[activeSidebar];
    return PageComponent
      ? PageComponent({ onLogout: handleLogout, activeItem: activeSidebar, setActiveItem: setActiveSidebar })
      : <PlaceholderPage title="Page Not Found" />;
  };

  return (
    <div>
      <Snackbar open={showOauthSuccess} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ minWidth: 300 }}>
          ✅ OAuth sign-in successful! Redirecting...
        </Alert>
      </Snackbar>

      {isLoggedIn ? (
        // Pass sidebar state down so PatientQueue's Sidebar can control routing
        renderSidebarPage()
      ) : currentPage === 'login' ? (
        <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />
      ) : (
        <RegisterPage onNavigate={setCurrentPage} />
      )}
    </div>
  );
}

export default App;