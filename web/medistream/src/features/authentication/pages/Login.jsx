import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Grid
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, Mail, Google } from '@mui/icons-material';
import { 
  MAROON, 
  IconBox, 
  PrimaryButton, 
  NavSideButton,
  GoogleButton,
  DividerWithText
} from "../components/AuthStyledComp";
import { 
  LoginStyledInput, 
  ErrorAlert, 
  PasswordField,
  EmailField
} from "../components/AuthFormsComp";
import { 
  BackgroundShapes, 
  FloatingShapesCSS, 
  ToggleContainerCSS, 
  DecorativeCard,
  SuccessSnackbar 
} from "../components/AuthUIComp";

const loginValidation = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  return errors;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const errors = loginValidation(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userRole', data.user?.role || 'patient');
        setShowSuccess(true);
        
        // Smart redirect checking for normal login
        const checkProfileAndRedirect = async () => {
          try {
            const allStaffResponse = await fetch('http://localhost:8080/api/medicalstaff/all', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            });
            
            if (allStaffResponse.ok) {
              const allStaff = await allStaffResponse.json();
              const userObj = data.user;
              const staffId = userObj?.staffID || userObj?.medicalStaff?.id || userObj?.medicalStaff?.staffID;
              const accountId = userObj?.accountID || userObj?.id;
              const email = userObj?.email || userObj?.username;

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
                navigate('/PatientQueue');
              } else {
                navigate('/general-settings', { state: { showUpdateSnackbar: true } });
              }
            } else {
              navigate('/PatientQueue');
            }
          } catch (err) {
            console.error('Error checking profile completion:', err);
            navigate('/PatientQueue');
          }
        };

        setTimeout(checkProfileAndRedirect, 1500);
      } else {
        setSubmitError('Invalid email or password');
      }
    } catch (err) {
      setSubmitError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleNavigateToRegister = (e) => {
    e.preventDefault();
    setIsActive(true);
    setTimeout(() => navigate('/register'), 600);
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <Box sx={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fcfcfc',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <FloatingShapesCSS />
      <ToggleContainerCSS />
      
      <BackgroundShapes />

      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', zIndex: 100 }}>
        <div className={`container ${isActive ? 'active' : ''}`}>
          {/* FORM SECTION (Sign In) */}
          <div className="form-box login">
            <Box sx={{ width: '100%', maxWidth: '410px', p: 4, textAlign: 'center' }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '2.5rem', color: MAROON, mb: 1, letterSpacing: '-1.5px' }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', fontSize: '0.95rem', fontWeight: 500 }}>
                  Sign in to your MediStream account
                </Typography>
              </Box>

              <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                <EmailField
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onBlur={() => handleBlur('email')}
                  error={formErrors.email}
                  helperText={formErrors.email}
                  touched={touched.email}
                />

                <PasswordField
                  label="Password"
                  showPassword={showPassword}
                  onToggleVisibility={() => setShowPassword(!showPassword)}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => handleBlur('password')}
                  error={formErrors.password}
                  helperText={formErrors.password}
                  touched={touched.password}
                />

                <ErrorAlert message={submitError} />

                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <PrimaryButton type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </PrimaryButton>
                  
                  <DividerWithText text="or" />
                  
                  <GoogleButton onClick={handleGoogleLogin}>
                    <Google sx={{ fontSize: 18, color: '#DB4437' }} />
                    Google
                  </GoogleButton>
                </Box>
              </form>

              <Box className="mobile-link" sx={{ textAlign: 'center', mt: 3, display: { md: 'none' } }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Don't have an account?{' '}
                  <span onClick={handleNavigateToRegister} style={{ color: MAROON, fontWeight: 700, cursor: 'pointer' }}>
                    Sign up
                  </span>
                </Typography>
              </Box>
            </Box>
          </div>

          {/* TOGGLE OVERLAY SECTION */}
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <Typography variant="h2" sx={{ fontWeight: 800, fontSize: '2.5rem', mb: 2, letterSpacing: '-1px', textAlign: 'center' }}>
                  Join Us!
                </Typography>
                <Typography sx={{ mb: 4, opacity: 0.9, textAlign: 'center' }}>
                  Register to start managing your healthcare records.
                </Typography>
              </div>

              <div className="toggle-panel toggle-right">
                <Typography variant="h2" sx={{ fontWeight: 800, fontSize: '2.5rem', mb: 2, letterSpacing: '-1px', textAlign: 'center' }}>
                  MediStream
                </Typography>
                <Typography sx={{ mb: 4, opacity: 0.8, textAlign: 'center' }}>
                  Enter your personal details to use all site features
                </Typography>

                <DecorativeCard />

                <Typography variant="body2" sx={{ color: 'white', mb: 3, opacity: 0.7, textAlign: 'center' }}>
                  Don't have an account yet?
                </Typography>

                <NavSideButton onClick={handleNavigateToRegister}>
                  Create Account
                </NavSideButton>
              </div>
            </div>
          </div>

          <SuccessSnackbar 
            open={showSuccess} 
            message="Login successful! Redirecting..."
          />
        </div>
      </Box>
    </Box>
  );
}