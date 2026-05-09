import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/authentication/hooks/useAuth';
import { useRole } from '../hooks/useRole';

const RoleBasedRoute = ({ children, requiredRoles = [], allowedPages = [] }) => {
  const { isAuthenticated } = useAuth();
  const { hasRole, canAccessPage } = useRole();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
        }}>
          <h1 style={{ color: '#4a0e0e', marginBottom: '10px' }}>Access Denied</h1>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            You do not have permission to access this page.
          </p>
          <a href="/PatientQueue" style={{
            color: '#4a0e0e',
            textDecoration: 'none',
            fontWeight: '600',
            padding: '10px 20px',
            border: '1px solid #4a0e0e',
            borderRadius: '6px',
            display: 'inline-block',
          }}>
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Check if page is accessible
  if (allowedPages.length > 0) {
    const currentPage = window.location.pathname.split('/').pop();
    if (!allowedPages.includes(currentPage) && !canAccessPage(currentPage)) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>
          <div style={{
            textAlign: 'center',
            padding: '40px',
          }}>
            <h1 style={{ color: '#4a0e0e', marginBottom: '10px' }}>Access Denied</h1>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              This page is not available for your role.
            </p>
            <a href="/PatientQueue" style={{
              color: '#4a0e0e',
              textDecoration: 'none',
              fontWeight: '600',
              padding: '10px 20px',
              border: '1px solid #4a0e0e',
              borderRadius: '6px',
              display: 'inline-block',
            }}>
              Go to Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default RoleBasedRoute;
