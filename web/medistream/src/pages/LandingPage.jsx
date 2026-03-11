import React from "react";

export default function LandingPage({ onLogout }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Landing Page</h1>
        <button onClick={onLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell"'
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    padding: '60px 40px',
    textAlign: 'center',
    maxWidth: '500px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '30px'
  },
  logoutButton: {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  }
};
