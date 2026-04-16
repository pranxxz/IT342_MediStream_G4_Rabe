import { useState } from 'react';

// Hook for numeric input validation
export const useNumericInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, '');
    setValue(numericValue);
  };

  const reset = () => {
    setValue('');
  };

  return {
    value,
    onChange: handleChange,
    reset,
    setValue // In case you need to set value manually
  };
};

// Hook for form validation
export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateAge = (age) => {
    if (!age) return 'Age is required';
    if (age < 1 || age > 120) return 'Please enter a valid age (1-120)';
    return '';
  };

  const validateContactNumber = (contactNumber) => {
    if (!contactNumber) return 'Contact number is required';
    if (contactNumber.length < 11) return 'Contact number must be 11 digits';
    return '';
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'age':
        return validateAge(value);
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