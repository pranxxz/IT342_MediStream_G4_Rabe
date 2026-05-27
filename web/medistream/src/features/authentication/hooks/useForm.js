import { useState } from 'react';

export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    const newValues = {
      ...values,
      [field]: value
    };
    
    setValues(newValues);

    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Validate this field immediately if validate function exists
    if (validate && touched[field]) {
      const fieldErrors = validate(newValues);
      if (fieldErrors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: fieldErrors[field]
        }));
      }
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Validate this field on blur
    if (validate) {
      const fieldErrors = validate(values);
      if (fieldErrors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: fieldErrors[field]
        }));
      } else {
        // Clear error if validation passes
        setErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    }
  };

  const validateForm = () => {
    if (!validate) return true;
    
    const formErrors = validate(values);
    setErrors(formErrors);
    
    // Mark all fields as touched when form is submitted
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    return Object.keys(formErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const setFieldError = (field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
    setErrors,  
    setTouched,
    setFieldError
  };
};