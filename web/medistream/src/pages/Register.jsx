import React, { useState } from "react";

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

  if (!values.role) {
    errors.role = 'Role is required';
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
    password: '',
    confirmPassword: ''
  });

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    if (field === 'firstName' || field === 'lastName') {
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, '');
      setFormData(prev => ({ ...prev, [field]: lettersOnly }));
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
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join MediStream today</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={{...styles.formGroup, flex: 1, marginRight: '10px'}}>
                <label style={styles.label}>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  onBlur={() => handleBlur('firstName')}
                  placeholder="First name"
                  style={{
                    ...styles.input,
                    borderColor: formTouched.firstName && formErrors.firstName ? '#ef4444' : '#ccc'
                  }}
                />
                {formTouched.firstName && formErrors.firstName && (
                  <p style={styles.error}>{formErrors.firstName}</p>
                )}
              </div>

              <div style={{...styles.formGroup, flex: 1, marginLeft: '10px'}}>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  onBlur={() => handleBlur('lastName')}
                  placeholder="Last name"
                  style={{
                    ...styles.input,
                    borderColor: formTouched.lastName && formErrors.lastName ? '#ef4444' : '#ccc'
                  }}
                />
                {formTouched.lastName && formErrors.lastName && (
                  <p style={styles.error}>{formErrors.lastName}</p>
                )}
              </div>
            </div>

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
              <label style={styles.label}>Role</label>
              <select
                value={formData.role}
                onChange={handleChange('role')}
                onBlur={() => handleBlur('role')}
                style={{
                  ...styles.input,
                  borderColor: formTouched.role && formErrors.role ? '#ef4444' : '#ccc'
                }}
              >
                <option value="">Select your role</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="staff">Staff</option>
              </select>
              {formTouched.role && formErrors.role && (
                <p style={styles.error}>{formErrors.role}</p>
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
                  placeholder="Enter password (min 8 characters)"
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

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Confirm password"
                  style={{
                    ...styles.input,
                    borderColor: formTouched.confirmPassword && formErrors.confirmPassword ? '#ef4444' : '#ccc'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.toggleButton}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formTouched.confirmPassword && formErrors.confirmPassword && (
                <p style={styles.error}>{formErrors.confirmPassword}</p>
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                style={styles.linkButton}
              >
                Sign in
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
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
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
    gap: '16px'
  },
  row: {
    display: 'flex',
    gap: '0'
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