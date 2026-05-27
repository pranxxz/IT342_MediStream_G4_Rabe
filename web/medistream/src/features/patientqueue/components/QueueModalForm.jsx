import React, { useState, useRef, useEffect } from 'react';

const QueueModalForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  isSubmitting = false,
  title = "Join Queue",
  subtitle = "Enter details to get a queue number."
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactNumber: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const firstNameInputRef = useRef(null);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        contactNumber: '',
        address: '',
      });
      setErrors({});
      setWarnings({});
    }
  }, [open]);

  // Focus first name when modal opens
  useEffect(() => {
    if (open && firstNameInputRef.current) {
      firstNameInputRef.current.focus();
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    if (name === 'age') {
      const hasNonNumeric = /[^0-9]/.test(value);
      if (hasNonNumeric) {
        setWarnings(prev => ({ ...prev, age: 'Only numeric characters are allowed' }));
        updatedValue = value.replace(/[^0-9]/g, '');
      } else {
        const ageNum = parseInt(value, 10);
        if (value !== '' && (isNaN(ageNum) || ageNum < 0 || ageNum > 120)) {
          setWarnings(prev => ({ ...prev, age: 'Age must be between 0 and 120' }));
        } else {
          setWarnings(prev => ({ ...prev, age: '' }));
        }
      }
    }

    if (name === 'contactNumber') {
      const hasNonNumeric = /[^0-9]/.test(value);
      if (hasNonNumeric) {
        setWarnings(prev => ({ ...prev, contactNumber: 'Only numeric characters are allowed' }));
        updatedValue = value.replace(/[^0-9]/g, '');
      } else {
        if (value.length > 11) {
          setWarnings(prev => ({ ...prev, contactNumber: 'Contact number must not exceed 11 digits' }));
          updatedValue = value.substring(0, 11);
        } else {
          setWarnings(prev => ({ ...prev, contactNumber: '' }));
        }
      }
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, age, gender, contactNumber, address } = formData;

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        newErrors.age = 'Age must be between 0 and 120';
      }
    }
    
    if (!gender) newErrors.gender = 'Gender is required';
    
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (contactNumber.trim().length !== 11) {
      newErrors.contactNumber = 'Contact number must be exactly 11 digits';
    }
    
    if (!address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !Object.values(warnings).some(w => w !== '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <p className="modal-subtitle">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>First Name <span className="required-star">*</span></label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                ref={firstNameInputRef}
                className={errors.firstName ? 'error-input' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label>Last Name <span className="required-star">*</span></label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error-input' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age <span className="required-star">*</span></label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={(errors.age || warnings.age) ? 'error-input' : ''}
                maxLength="3"
              />
              {(errors.age || warnings.age) && (
                <span className="error-text">{errors.age || warnings.age}</span>
              )}
            </div>

            <div className="form-group">
              <label>Gender <span className="required-star">*</span></label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? 'error-input' : ''}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Contact Number <span className="required-star">*</span></label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={(errors.contactNumber || warnings.contactNumber) ? 'error-input' : ''}
              maxLength="11"
            />
            {(errors.contactNumber || warnings.contactNumber) && (
              <span className="error-text">{errors.contactNumber || warnings.contactNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label>Address <span className="required-star">*</span></label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error-input' : ''}
              rows="3"
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit & Join Queue'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(68, 0, 13, 0.15);
          backdrop-filter: blur(12px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
 
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
 
        .modal-container {
          background: #ffffff;
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(68, 0, 13, 0.1);
          border-radius: 28px;
          width: 90%;
          max-width: 620px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 36px 40px;
          box-shadow: 0 30px 60px -12px rgba(68, 0, 13, 0.15), 0 0 40px rgba(68, 0, 13, 0.05);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          color: #1f2937;
        }
 
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
 
        .modal-header {
          margin-bottom: 28px;
          border-bottom: 1px solid rgba(68, 0, 13, 0.08);
          padding-bottom: 18px;
          text-align: center;
        }
 
        .modal-header h2 {
          font-size: 2rem;
          background: linear-gradient(135deg, #44000d 0%, #7a0017 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
 
        .modal-subtitle {
          color: #4b5563;
          font-size: 0.95rem;
          font-weight: 500;
        }
 
        .form-row {
          display: flex;
          gap: 24px;
          margin-bottom: 6px;
        }
 
        .form-group {
          flex: 1;
          margin-bottom: 20px;
        }
 
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 0.88rem;
          letter-spacing: 0.2px;
        }
 
        .required-star {
          color: #ff3355;
          margin-left: 4px;
        }
 
        input, select, textarea {
          box-sizing: border-box;
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid rgba(68, 0, 13, 0.18);
          border-radius: 12px;
          font-size: 0.92rem;
          transition: all 0.2s ease-in-out;
          font-family: inherit;
          background: #fcfcfc;
          color: #1f2937;
        }
 
        select option {
          background-color: #ffffff;
          color: #1f2937;
        }
 
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #7a0017;
          box-shadow: 0 0 0 4px rgba(122, 0, 23, 0.12);
          background: #ffffff;
        }
 
        .error-input {
          border-color: #dc2626;
          background: rgba(220, 38, 38, 0.02);
        }
 
        .error-text {
          color: #dc2626;
          font-size: 0.78rem;
          margin-top: 6px;
          display: block;
          font-weight: 500;
        }
 
        .form-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 32px;
          padding-top: 18px;
          border-top: 1px solid rgba(68, 0, 13, 0.08);
        }
 
        .cancel-btn, .submit-btn {
          padding: 14px 32px;
          border-radius: 40px;
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
 
        .cancel-btn {
          background: #f3f4f6;
          color: #4b5563;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
 
        .cancel-btn:hover {
          background: #e5e7eb;
          color: #1f2937;
          transform: translateY(-1.5px);
        }
 
        .submit-btn {
          background: linear-gradient(135deg, #7a0017 0%, #44000d 100%);
          color: white;
          box-shadow: 0 6px 20px rgba(122, 0, 23, 0.25);
        }
 
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1.5px);
          box-shadow: 0 8px 25px rgba(122, 0, 23, 0.4);
        }
 
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
 
        /* Custom scrollbar for modal-container */
        .modal-container::-webkit-scrollbar {
          width: 6px;
        }
        .modal-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-container::-webkit-scrollbar-thumb {
          background: rgba(68, 0, 13, 0.15);
          border-radius: 10px;
        }
 
        @media (max-width: 600px) {
          .modal-container {
            padding: 24px;
            width: 95%;
          }
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          .form-buttons {
            flex-direction: column-reverse;
          }
          .cancel-btn, .submit-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default QueueModalForm;