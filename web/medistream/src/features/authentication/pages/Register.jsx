import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../shared/services/api";
import {
  Typography,
  Box,
  Grid
} from "@mui/material";
import { Google } from '@mui/icons-material';
import {
  MAROON,
  PrimaryButton,
  NavSideButton,
  GoogleButton,
  DividerWithText
} from "../components/AuthStyledComp";
import {
  ErrorAlert,
  PasswordField,
  RoleSelectField,
  NameFieldsRow,
  RoleAndIdFieldsRow,
  EmailField,
  NumberField
} from "../components/AuthFormsComp";
import {
  BackgroundShapes,
  FloatingShapesCSS,
  ToggleContainerCSS,
  DecorativeCard,
  SuccessSnackbar
} from "../components/AuthUIComp";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    role: false,
    idNumber: false,
    password: false,
    confirmPassword: false
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'staff',
    idNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.role) errors.role = 'Role is required';
    if (!formData.idNumber) errors.idNumber = 'ID number is required';

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Mark all fields as touched to show errors
      const allTouched = {};
      Object.keys(touched).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => navigate('/Login'), 1500);
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  const handleNavigateToLogin = (e) => {
    e.preventDefault();
    setIsActive(false);
    setTimeout(() => navigate('/Login'), 600);
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleFieldChange = (field, value) => {
    let updatedValue = value;
    if (field === 'idNumber') {
      const hasNonNumeric = /[^0-9]/.test(value);
      if (hasNonNumeric) {
        setFormErrors(prev => ({ ...prev, idNumber: 'Only numeric characters are allowed' }));
        updatedValue = value.replace(/[^0-9]/g, '');
      } else {
        setFormErrors(prev => ({ ...prev, idNumber: '' }));
      }
    }
    
    setFormData({ ...formData, [field]: updatedValue });
    
    // Clear error for other fields when user starts typing
    if (field !== 'idNumber' && formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
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
          {/* FORM SECTION (Sign Up) */}
          <div className="form-box register" >
            <Box sx={{ width: '100%', maxWidth: '410px', p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '2.5rem', color: MAROON, mb: 1.5, letterSpacing: '-1.5px' }}>
                  Create Account
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', fontSize: '0.95rem', fontWeight: 500 }}>
                  Join the MediStream healthcare network
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                {/* First Name & Last Name Row */}
                <NameFieldsRow
                  firstName={formData.firstName}
                  lastName={formData.lastName}
                  onFirstNameChange={(e) => handleFieldChange('firstName', e.target.value)}
                  onLastNameChange={(e) => handleFieldChange('lastName', e.target.value)}
                  onFirstNameBlur={() => handleBlur('firstName')}
                  onLastNameBlur={() => handleBlur('lastName')}
                  firstNameError={formErrors.firstName}
                  lastNameError={formErrors.lastName}
                  firstNameTouched={touched.firstName}
                  lastNameTouched={touched.lastName}
                />

                {/* Email Field */}
                <EmailField
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={formErrors.email}
                  helperText={formErrors.email}
                  touched={touched.email}
                />

                {/* Role & ID Number Row */}
                <RoleAndIdFieldsRow
                  role={formData.role}
                  idNumber={formData.idNumber}
                  onRoleChange={(e) => handleFieldChange('role', e.target.value)}
                  onIdNumberChange={(e) => handleFieldChange('idNumber', e.target.value)}
                  onRoleBlur={() => handleBlur('role')}
                  onIdNumberBlur={() => handleBlur('idNumber')}
                  roleError={formErrors.role}
                  idNumberError={formErrors.idNumber}
                  roleTouched={touched.role}
                  idNumberTouched={touched.idNumber}
                />

                {/* Password Field */}
                <PasswordField
                  label="Password"
                  showPassword={showPassword}
                  onToggleVisibility={() => setShowPassword(!showPassword)}
                  value={formData.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  error={formErrors.password}
                  helperText={formErrors.password}
                  touched={touched.password}
                />

                {/* Confirm Password Field */}
                <PasswordField
                  label="Confirm Password"
                  showPassword={showConfirmPassword}
                  onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                  value={formData.confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  error={formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                  touched={touched.confirmPassword}
                />

                <ErrorAlert message={error} />

                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <PrimaryButton type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
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
                  Already have an account?{' '}
                  <span onClick={handleNavigateToLogin} style={{ color: MAROON, fontWeight: 700, cursor: 'pointer' }}>
                    Sign In
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
                  Hello There!
                </Typography>
                <Typography sx={{ mb: 4, opacity: 0.8, textAlign: 'center' }}>
                  Enter your personal details to use all site features
                </Typography>

                <DecorativeCard />

                <Typography variant="body2" sx={{ color: 'white', mb: 3, opacity: 0.7, textAlign: 'center' }}>
                  Already have an account?
                </Typography>
                <NavSideButton onClick={handleNavigateToLogin}>
                  Sign In
                </NavSideButton>
              </div>

              <div className="toggle-panel toggle-right">
                <Typography variant="h2" sx={{ fontWeight: 800, fontSize: '2.5rem', mb: 2, letterSpacing: '-1px', textAlign: 'center' }}>
                  Welcome Back!
                </Typography>
                <Typography sx={{ mb: 4, opacity: 0.9, textAlign: 'center' }}>
                  Enter your details to log in to your account.
                </Typography>
              </div>
            </div>
          </div>

          <SuccessSnackbar
            open={showSuccess}
            message="Registration successful! Please log in."
          />
        </div>
      </Box>
    </Box>
  );
}