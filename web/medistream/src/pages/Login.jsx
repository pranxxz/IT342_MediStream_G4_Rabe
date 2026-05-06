import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Container, Divider, Snackbar, Alert } from '@mui/material';
import { 
  PasswordField, 
  EmailField, 
  ErrorAlert 
} from '../components/RegisterFields';
import GoogleIcon from '@mui/icons-material/Google'; 

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

export default function LoginPage({ onNavigate, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Success message for login
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Handle OAuth2 failure redirect from backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const message = params.get('message');
    
    if (error) {
      if (message) {
        setFormErrors(prev => ({ ...prev, submit: decodeURIComponent(message) }));
      }
      
      const mode = localStorage.getItem('oauthMode');
      if (mode === 'register') {
        onNavigate('register');
      }
      
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onNavigate]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => {
    setFormTouched(prev => ({ ...prev, [field]: true }));
    const errors = loginValidation(formData);
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
    
    const errors = loginValidation(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

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
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userRole', data.role || 'patient');
        
        setShowSuccessMessage(true);
        setTimeout(() => {
          onLogin();
        }, 1500);
      } else {
        const errorData = await response.json().catch(() => null);
        setFormErrors({ 
          submit: errorData?.message || 'Invalid email or password' 
        });
      }
    } catch (error) {
      setFormErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    
    setGoogleLoading(true);
    localStorage.setItem('oauthMode', 'login');
    
    const timestamp = new Date().getTime();
    window.location.href = `http://localhost:8080/api/auth/google?prompt=select_account&mode=login&_=${timestamp}`;
  };


  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5'
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            maxWidth: '400px',
            mx: 'auto'
          }}
        >
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="#1f2937">
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your MediStream account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <EmailField
              value={formData.email}
              onChange={handleChange('email')}
              onBlur={() => handleBlur('email')}
              error={formErrors.email}
              helperText={formErrors.email}
              touched={formTouched.email}
              disabled={loading || googleLoading}
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
              placeholder="Enter your password"
              disabled={loading || googleLoading}
            />

            <ErrorAlert message={formErrors.submit} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || googleLoading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                backgroundColor: '#660013',
                '&:hover': { backgroundColor: '#44000d' },
                '&.Mui-disabled': { backgroundColor: '#44000d', opacity: 0.6 }
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            startIcon={<GoogleIcon />}
            sx={{
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              borderColor: '#dadce0',
              color: '#3c4043',
              backgroundColor: '#fff',
              '&:hover': { backgroundColor: '#f8f9fa', borderColor: '#dadce0' }
            }}
          >
            {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </Button>

          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Button
                onClick={() => onNavigate('register')}
                sx={{
                  color: '#44000d',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  p: 0,
                  minWidth: 'auto',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                }}
              >
                Sign up
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Login Success Snackbar */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ bgcolor: '#4caf50', color: 'white', '& .MuiAlert-icon': { color: 'white' } }}>
          ✅ Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
}