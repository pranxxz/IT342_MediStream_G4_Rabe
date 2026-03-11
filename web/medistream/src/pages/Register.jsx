import React, { useState } from "react";
import { Box, Button, Typography, Paper, Container } from '@mui/material';
import { Badge } from '@mui/icons-material';
import { 
  InputField, 
  PasswordField, 
  NameFieldsRow, 
  EmailField, 
  ErrorAlert 
} from '../components/RegisterFields'; 

const basicValidation = (values) => {
  const errors = {};

  if (!values.firstName) {
    errors.firstName = 'First name is required';
  } else if (!/^[A-Za-z\s]+$/.test(values.firstName)) {
    errors.firstName = 'First name should contain only letters';
  } else if (values.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  if (!values.lastName) {
    errors.lastName = 'Last name is required';
  } else if (!/^[A-Za-z\s]+$/.test(values.lastName)) {
    errors.lastName = 'Last name should contain only letters';
  } else if (values.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  // If registering as staff (not patient), require an ID number
  const roleLower = values.role ? values.role.toLowerCase() : '';
  if (roleLower && roleLower !== 'patient') {
    if (!values.idNumber) {
      errors.idNumber = 'ID number is required for staff';
    } else if (!/^[A-Za-z0-9\-]+$/.test(values.idNumber)) {
      errors.idNumber = 'ID number contains invalid characters';
    }
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export default function RegisterPage({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    idNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    if (field === 'firstName' || field === 'lastName') {
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, '');
      setFormData(prev => ({ ...prev, [field]: lettersOnly }));
    } else if (field === 'idNumber') {
      const alphaNum = value.replace(/[^A-Za-z0-9]/g, '');
      setFormData(prev => ({ ...prev, [field]: alphaNum }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => {
    setFormTouched(prev => ({ ...prev, [field]: true }));
    const errors = basicValidation(formData);
    if (errors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: errors[field] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setFormTouched(allTouched);
    
    const errors = basicValidation(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Registration successful! Please log in.');
        onNavigate('login');
      } else {
        setFormErrors({ submit: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setFormErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell"'
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 3,
            maxHeight: '80vh',
            overflowY: 'auto',
            maxWidth: '430px',
          }}
        >
          <Typography variant="h5" align="center" gutterBottom fontWeight="bold" color="#1f2937" sx={{ mb: 4 }}>
            Create an Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <NameFieldsRow
              firstName={formData.firstName}
              lastName={formData.lastName}
              onFirstNameChange={handleChange('firstName')}
              onLastNameChange={handleChange('lastName')}
              onFirstNameBlur={() => handleBlur('firstName')}
              onLastNameBlur={() => handleBlur('lastName')}
              firstNameError={formErrors.firstName}
              lastNameError={formErrors.lastName}
              firstNameTouched={formTouched.firstName}
              lastNameTouched={formTouched.lastName}
            />

            <EmailField
              value={formData.email}
              onChange={handleChange('email')}
              onBlur={() => handleBlur('email')}
              error={formErrors.email}
              helperText={formErrors.email}
              touched={formTouched.email}
            />

            {/* id number */}
            <EmailField
              label="ID Number"
              placeholder="Enter your ID number"
              startAdornment={
                <Badge 
                  sx={{ 
                    mr: 1,
                    color: formTouched.idNumber && formErrors.idNumber ? '#f44336' : '#44000d',
                    fontSize: '1.2rem'
                  }}
                />
              }

              value={formData.idNumber}
              onChange={handleChange('idNumber')}
              onBlur={() => handleBlur('idNumber')}
              error={formErrors.idNumber}
              helperText={formErrors.idNumber}
              touched={formTouched.idNumber}
            />

            <PasswordField
              label="Password"
              value={formData.password}
              onChange={handleChange('password')}
              onBlur={() => handleBlur('password')}
              error={formErrors.password}
              helperText={formErrors.password}
              touched={formTouched.password}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword(!showPassword)}
              placeholder="Enter password (min 8 characters)"
            />

            <PasswordField
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onBlur={() => handleBlur('confirmPassword')}
              error={formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              touched={formTouched.confirmPassword}
              showPassword={showConfirmPassword}
              onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Confirm password"
            />

            <ErrorAlert message={formErrors.submit} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: '#44000d',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#660013',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#44000d',
                  opacity: 0.6,
                }
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Button
                onClick={() => onNavigate('login')}
                sx={{
                  color: '#44000d',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  }
                }}
              >
                Sign in
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}