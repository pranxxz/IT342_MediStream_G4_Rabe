import React, { useState } from "react";

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
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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
        onLogin();
      } else {
        setFormErrors({ submit: 'Invalid email or password' });
      }
    } catch (error) {
      setFormErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your MediStream account</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email"
                style={{
                  ...styles.input,
                  borderColor: formTouched.email && formErrors.email ? '#ef4444' : '#ccc'
                }}
              />
              {formTouched.email && formErrors.email && (
                <p style={styles.error}>{formErrors.email}</p>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
                  onBlur={() => handleBlur('password')}
                  placeholder="Enter your password"
                  style={{
                    ...styles.input,
                    borderColor: formTouched.password && formErrors.password ? '#ef4444' : '#ccc'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.toggleButton}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formTouched.password && formErrors.password && (
                <p style={styles.error}>{formErrors.password}</p>
              )}
            </div>

            {formErrors.submit && (
              <p style={{...styles.error, textAlign: 'center'}}>{formErrors.submit}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                style={styles.linkButton}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    padding: '40px',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
  },
  passwordContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  toggleButton: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '0'
  },
  error: {
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '4px'
  },
  button: {
    padding: '12px 16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    background: 'linear-gradient(135deg, #44000d 0%, #44000d 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    marginTop: '10px'
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #f3f4f6'
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#44000d',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline'
  }
};