import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../../shared/services/api';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Grab the token from the URL (?token=...)
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const name = searchParams.get('name');
    const accountId = searchParams.get('accountId');
    const staffId = searchParams.get('staffId');

    if (token) {
      // 2. Save it to localStorage so your API calls can use it
      localStorage.setItem('token', token);
      
      const userObj = {
        email: email,
        role: role,
        name: name,
        accountID: accountId,
        staffID: staffId,
        medicalStaff: {
            name: name,
            role: role
        }
      };
      localStorage.setItem('user', JSON.stringify(userObj));
      
      // 3. Smart Redirect Check
      const checkProfileAndRedirect = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/medicalstaff/all`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const allStaff = await response.json();
            
            // Find medical staff matching email, staffId, or accountId
            let medicalStaff = null;
            if (staffId && staffId !== 'null' && staffId !== 'undefined') {
              medicalStaff = allStaff.find(s => String(s.id) === String(staffId) || String(s.staffID) === String(staffId));
            }
            if (!medicalStaff && accountId && accountId !== 'null' && accountId !== 'undefined') {
              medicalStaff = allStaff.find(s => s.userAccount && String(s.userAccount.accountID) === String(accountId));
            }
            if (!medicalStaff && email) {
              medicalStaff = allStaff.find(s => s.userAccount && s.userAccount.username === email);
            }
            
            const isProfileComplete = medicalStaff && 
              medicalStaff.age !== null && 
              medicalStaff.age !== undefined && 
              String(medicalStaff.age).trim() !== '' && 
              String(medicalStaff.age).trim() !== 'N/A' &&
              medicalStaff.gender && 
              String(medicalStaff.gender).trim() !== 'N/A' &&
              medicalStaff.contactNo && 
              String(medicalStaff.contactNo).trim() !== 'N/A';

            if (isProfileComplete) {
              // Direct straight to PatientQueue for completed profile
              navigate('/PatientQueue');
            } else {
              // First time logging in (or incomplete profile) -> redirect to update profile
              navigate('/general-settings', { state: { showUpdateSnackbar: true } });
            }
          } else {
            // Fallback: redirect to general-settings
            navigate('/general-settings', { state: { showUpdateSnackbar: true } });
          }
        } catch (err) {
          console.error('Error checking profile completion:', err);
          navigate('/general-settings', { state: { showUpdateSnackbar: true } });
        }
      };

      checkProfileAndRedirect();
    } else {
      // If something went wrong, send them back to login
      navigate('/Login');
    }
  }, [searchParams, navigate]);

  // Show a simple loading message while it processes the redirect
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <h2>Authenticating...</h2>
    </div>
  );
};

export default OAuthCallback;