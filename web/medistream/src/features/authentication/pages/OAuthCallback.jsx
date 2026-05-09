import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
      
      // 3. Redirect the user to the profile page to update info
      navigate('/general-settings', { state: { showUpdateSnackbar: true } }); 
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