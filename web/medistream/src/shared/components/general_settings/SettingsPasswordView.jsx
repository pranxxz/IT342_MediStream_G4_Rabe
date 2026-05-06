import React, { useState } from 'react';
import { Lock, LogOut, Globe, Eye, EyeOff } from 'lucide-react';
import { FeedbackModal } from "../FeedbackModal";

const SettingsPasswordView = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [modalState, setModalState] = useState({
    open: false,
    type: 'info', 
    title: '',
    message: '',
    onConfirm: undefined, 
    confirmText: 'Okay'
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentFocused, setCurrentFocused] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  // Helper to close modal
  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, open: false }));
  };

  // Helper to show errors
  const showError = (message) => {
    setModalState({
      open: true,
      type: 'error',
      title: 'Action Failed',
      message: message,
      confirmText: 'Try Again'
    });
  };

  const handleChangePassword = async () => {
    try {
      // Validation
      if (!currentPassword.trim()) {
        showError('Please enter your current password');
        return;
      }
      
      if (!newPassword.trim()) {
        showError('Please enter a new password');
        return;
      }
      
      if (newPassword.length < 6) {
        showError('New password must be at least 6 characters long');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        showError('New passwords do not match');
        return;
      }
      
      if (currentPassword === newPassword) {
        showError('New password must be different from current password');
        return;
      }

      setLoading(true);
      
      // Get user data from localStorage
      const storedUser = localStorage.getItem('user') || 
                         localStorage.getItem('currentUser') ||
                         sessionStorage.getItem('user');
      
      if (!storedUser) {
        throw new Error('User not found. Please login again.');
      }
      
      const userData = JSON.parse(storedUser);
      const accountId = userData.accountID || userData.id;
      const username = userData.username || userData.email;
      
      if (!accountId || !username) {
        throw new Error('User information incomplete');
      }

      console.log('Changing password for account:', accountId);
      
      // Call API to change password
      const response = await fetch('http://localhost:8080/api/useraccount/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          currentPassword: currentPassword,
          newPassword: newPassword,
          accountID: parseInt(accountId)
        })
      });
      
      const data = await response.text();
      
      if (response.ok) {
        // Update localStorage with new password
        if (userData.password) {
          userData.password = newPassword;
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // SHOW SUCCESS MODAL
        setModalState({
          open: true,
          type: 'success',
          title: 'Success!',
          message: 'Your password has been changed successfully.',
          confirmText: 'Great'
        });
        
      } else {
        throw new Error(data || 'Failed to change password. Please try again.');
      }
      
    } catch (error) {
      console.error('Error changing password:', error);
      showError(error.message || 'An error occurred while changing password');
    } finally {
      setLoading(false);
    }
  };

  // Logic to actually perform the logout
  const executeLogout = () => {
    try {
      // Clear all user data from storage
      localStorage.removeItem('user');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('medicalStaffData');
      sessionStorage.removeItem('user');
      
      // Clear token if exists
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Redirect to login page
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      showError('Error during logout. Please try again.');
    }
  };

  // Trigger the Confirmation Modal
  const handleLogoutAllSessions = () => {
    setModalState({
      open: true,
      type: 'warning',
      title: 'Log Out All Devices?',
      message: 'Are you sure you want to log out from all devices? This will end all active sessions immediately.',
      confirmText: 'Yes, Log Out',
      onConfirm: executeLogout // Pass the function to be called on confirmation
    });
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
        {/* Change Password */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#F3F0FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Lock size={24} color="#4B0082" />
            </div>
            <h3 style={{ 
              fontWeight: 700, 
              fontSize: '24px', 
              marginBottom: '8px', 
              color: '#1f2937',
              fontFamily: '"Poppins", "Inter", sans-serif'
            }}>
              Change Password
            </h3>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
              lineHeight: '1.5'
            }}>
              To change your password, please<br />fill all fields below:
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Current Password Input */}
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '40px',
                  borderRadius: '8px',
                  border: currentFocused ? '1px solid #4B0082' : '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
                  color: '#1f2937',
                  background: '#f9fafb',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: currentFocused ? '0 0 0 3px rgba(75,0,130,0.1)' : 'none'
                }}
                onFocus={() => setCurrentFocused(true)}
                onBlur={() => setCurrentFocused(false)}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* New Password Input */}
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '40px',
                  borderRadius: '8px',
                  border: newFocused ? '1px solid #4B0082' : '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
                  color: '#1f2937',
                  background: '#f9fafb',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: newFocused ? '0 0 0 3px rgba(75,0,130,0.1)' : 'none'
                }}
                onFocus={() => setNewFocused(true)}
                onBlur={() => setNewFocused(false)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Confirm Password Input */}
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '40px',
                  borderRadius: '8px',
                  border: confirmFocused ? '1px solid #4B0082' : '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
                  color: '#1f2937',
                  background: '#f9fafb',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: confirmFocused ? '0 0 0 3px rgba(75,0,130,0.1)' : 'none'
                }}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleChangePassword}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: loading ? '#9ca3af' : '#4B0082',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
              marginTop: '24px',
              boxShadow: '0 3px 10px rgba(75,0,130,0.25)',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = '#3A0066';
                e.target.style.boxShadow = '0 5px 15px rgba(75,0,130,0.3)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = '#4B0082';
                e.target.style.boxShadow = '0 3px 10px rgba(75,0,130,0.25)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
          
          {/* Password Requirements */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            fontSize: '12px',
            color: '#6b7280',
            fontFamily: '"Arimo", "Poppins", "Inter", sans-serif'
          }}>
            <strong>Password Requirements:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>At least 6 characters long</li>
              <li>Must be different from current password</li>
              <li>New passwords must match</li>
            </ul>
          </div>
        </div>

        {/* Session Management */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#F3F0FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Globe size={24} color="#4B0082" />
            </div>
            <h3 style={{ 
              fontWeight: 700, 
              fontSize: '24px', 
              marginBottom: '8px', 
              color: '#1f2937',
              fontFamily: '"Poppins", "Inter", sans-serif'
            }}>
              Session Management
            </h3>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '24px',
              fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              Manage your active sessions and<br />account security
            </p>
          </div>
          <button 
            onClick={handleLogoutAllSessions}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: '#4B0082',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
              boxShadow: '0 3px 10px rgba(75,0,130,0.25)',
              transition: 'all 0.2s ease',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#3A0066';
              e.target.style.boxShadow = '0 5px 15px rgba(75,0,130,0.3)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#4B0082';
              e.target.style.boxShadow = '0 3px 10px rgba(75,0,130,0.25)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <LogOut size={16} />
            Log Out All Sessions
          </button>
          
          {/* Warning Box */}
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            color: '#92400e',
            fontSize: '13px',
            fontFamily: '"Arimo", "Poppins", "Inter", sans-serif'
          }}>
            <strong>⚠️ Important:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>This will log you out from all devices</li>
              <li>You'll need to login again on all devices</li>
              <li>Active sessions will be terminated immediately</li>
            </ul>
          </div>
        </div>
      </div>

      <FeedbackModal
        open={modalState.open}
        onClose={handleCloseModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        onConfirm={modalState.onConfirm}
      />
    </div>
  );
};

export default SettingsPasswordView;