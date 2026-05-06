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
    purpose: '',
  });
  const [errors, setErrors] = useState({});
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
        purpose: '',
      });
      setErrors({});
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, age, gender, contactNumber, address, purpose } = formData;

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(age) || age < 1 || age > 120) {
      newErrors.age = 'Age must be a number between 1 and 120';
    }
    
    if (!gender) newErrors.gender = 'Gender is required';
    
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[\d+\s-]+$/.test(contactNumber.trim())) {
      newErrors.contactNumber = 'Please enter a valid contact number';
    }
    
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!purpose.trim()) newErrors.purpose = 'Purpose of visit is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
                placeholder="Enter first name"
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
                placeholder="Enter last name"
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age <span className="required-star">*</span></label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={errors.age ? 'error-input' : ''}
                placeholder="Enter age"
                min="1"
                max="120"
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
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
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={errors.contactNumber ? 'error-input' : ''}
              placeholder="Enter contact number"
            />
            {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
          </div>

          <div className="form-group">
            <label>Address <span className="required-star">*</span></label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error-input' : ''}
              placeholder="Enter your full address"
              rows="3"
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>Purpose of Visit <span className="required-star">*</span></label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className={errors.purpose ? 'error-input' : ''}
              placeholder="Why are you visiting?"
            />
            {errors.purpose && <span className="error-text">{errors.purpose}</span>}
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
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          margin-bottom: 24px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 16px;
        }

        .modal-header h2 {
          font-size: 1.8rem;
          color: #44000D;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .modal-subtitle {
          color: #666;
          font-size: 0.9rem;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 6px;
        }

        .form-group {
          flex: 1;
          margin-bottom: 18px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .required-star {
          color: #e53e3e;
          margin-left: 4px;
        }

        input, select, textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          font-family: inherit;
          background: #fafbfc;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #44000D;
          box-shadow: 0 0 0 3px rgba(68, 0, 13, 0.1);
          background: white;
        }

        .error-input {
          border-color: #e53e3e;
          background: #fff5f5;
        }

        .error-text {
          color: #e53e3e;
          font-size: 0.75rem;
          margin-top: 6px;
          display: block;
        }

        .form-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 24px;
          padding-top: 8px;
          border-top: 1px solid #f0f0f0;
        }

        .cancel-btn, .submit-btn {
          padding: 12px 28px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .cancel-btn {
          background: #f1f3f5;
          color: #4a5568;
        }

        .cancel-btn:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }

        .submit-btn {
          background: linear-gradient(135deg, #44000D 0%, #660014 100%);
          color: white;
          box-shadow: 0 4px 10px rgba(68, 0, 13, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(68, 0, 13, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .modal-container {
            padding: 20px;
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