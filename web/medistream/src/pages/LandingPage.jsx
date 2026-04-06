import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

export default function LandingPage({ onLogout }) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Show success toast on mount (covers both regular login and OAuth)
    const email = localStorage.getItem('userEmail') || '';
    setUserEmail(email);
    setShowWelcome(true);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Landing Page</h1>
        {userEmail && (
          <p style={styles.email}>Logged in as: <strong>{userEmail}</strong></p>
        )}
        <button onClick={onLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* ✅ Welcome Success Toast */}
      <Snackbar
        open={showWelcome}
        autoHideDuration={3000}
        onClose={() => setShowWelcome(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowWelcome(false)}
          severity="success"
          sx={{
            width: '100%',
            minWidth: '300px',
            backgroundColor: '#4caf50',
            color: 'white',
            fontWeight: 500,
            '& .MuiAlert-icon': { color: 'white' },
            '& .MuiAlert-action .MuiIconButton-root': { color: 'white' },
          }}
        >
          ✅ Login successful! Welcome{userEmail ? `, ${userEmail}` : ''}!
        </Alert>
      </Snackbar>
    </div>
  );
}

const styles = {
  wrapper: {
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell"',
    backgroundColor: '#f5f5f5',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    padding: '60px 40px',
    textAlign: 'center',
    maxWidth: '500px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '12px',
  },
  email: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
  },
  logoutButton: {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    background: 'linear-gradient(135deg, #660013 0%, #44000d 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};