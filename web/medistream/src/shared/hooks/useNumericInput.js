import { useState } from 'react';

// Hook for numeric input validation with live warnings
export const useNumericInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const [warning, setWarning] = useState('');

  const handleChange = (event) => {
    const rawValue = event.target.value;
    const hasNonNumeric = /[^0-9]/.test(rawValue);
    
    if (hasNonNumeric) {
      setWarning('Only numeric characters are allowed');
    } else {
      setWarning('');
    }

    const numericValue = rawValue.replace(/[^0-9]/g, '');
    setValue(numericValue);
  };

  const reset = () => {
    setValue('');
    setWarning('');
  };

  return {
    value,
    warning,
    onChange: handleChange,
    reset,
    setValue: (val) => {
      setValue(val);
      setWarning('');
    }
  };
};

// Hook for form validation
export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateAge = (age) => {
    if (age === '' || age === undefined || age === null) return 'Age is required';
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) return 'Please enter a valid age (0-120)';
    return '';
  };

  const validateContactNumber = (contactNumber) => {
    if (!contactNumber) return 'Contact number is required';
    if (contactNumber.length < 11) return 'Contact number must be 11 digits';
    if (contactNumber.length > 11) return 'Contact number must be exactly 11 digits';
    return '';
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'age':
        return validateAge(value);
      case 'contactNo':
      case 'contactNumber':
        return validateContactNumber(value);
      default:
        return '';
    }
  };

  const setFieldError = (field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearFieldError = (field) => {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  return {
    errors,
    validateField,
    setFieldError,
    clearErrors,
    clearFieldError
  };
};