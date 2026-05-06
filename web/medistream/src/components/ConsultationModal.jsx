import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
} from '@mui/material';
import {
  Person,
  Tag,
  Wc,
  CalendarToday,
  MedicalServices,
  Description,
  Topic,
  Medication,
  Note
} from '@mui/icons-material';

// Import your styled components here
import { InputField } from './RegisterFields'; 
import { GradientButton, OutlineButton } from './ButtonComponents'; 

const ConsultationModal = ({ open, onClose, data, isEditMode = false, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        symptoms: data.symptoms || '',
        diagnosis: data.diagnosis || '',
        prescription: data.prescription || '',
        remarks: data.remarks || '',
        date: data.date || '',
        doctor: data.doctor || '',
        age: data.age || '',
        gender: data.gender || ''
      });
    }
  }, [data, open]);

  if (!data) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (onSave) onSave(formData);
  };

  const names = data.patientName ? data.patientName.split(' ') : ['', ''];
  const firstName = names[0];
  const lastName = names.slice(1).join(' ');

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: '#ffffff',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    p: 4,
    borderRadius: '20px',
    outline: 'none'
  };

  const iconColor = { color: '#4B0082', mr: 1, fontSize: '1.2rem', };
  
  const rowStyle = { display: 'flex', gap: 2.5 };
  const colStyle = { flex: 1 };
  const inputSx = { mb: 2 };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>

        {/* Title Section */}
        <Box sx={{ mb: 4, textAlign: 'start' }}>
          <Typography
            variant="h5"
            sx={{ 
              color: '#4B0082', 
              fontWeight: 700, 
              mb: 0.5, 
              fontFamily: '"Poppins", sans-serif'
            }}
          >
            Consultation Details
          </Typography>
          <Typography
            variant="body2"
            sx={{ 
              color: '#6b7280', 
              fontFamily: '"Poppins", sans-serif',
              fontSize: '0.875rem'
            }}
          >
            {isEditMode 
              ? "Edit the consultation details." 
              : "View the consultation details."}
          </Typography>
        </Box>

        {/* ========== FORM CONTAINER ========== */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* ROW 1: FIRST & LAST NAME */}
          <Box sx={rowStyle}>
            <Box sx={colStyle}>
              <InputField
                label="First Name"
                value={firstName}
                InputProps={{ readOnly: true }}
                startAdornment={<Person sx={iconColor} />}
                sx={inputSx}
              />
            </Box>
            <Box sx={colStyle}>
              <InputField
                label="Last Name"
                value={lastName}
                InputProps={{ readOnly: true }}
                startAdornment={<Person sx={iconColor} />}
                sx={inputSx}
              />
            </Box>
          </Box>

          {/* ROW 2: AGE & GENDER */}
          <Box sx={rowStyle}>
            <Box sx={colStyle}>
              <InputField
                label="Age"
                value={formData.age}
                InputProps={{ readOnly: true }}
                startAdornment={<Tag sx={iconColor} />}
                sx={inputSx}
              />
            </Box>
            <Box sx={colStyle}>
              <InputField
                label="Gender"
                value={formData.gender}
                InputProps={{ readOnly: true }}
                startAdornment={<Wc sx={iconColor} />}
                sx={inputSx}
              />
            </Box>
          </Box>

          {/* ROW 3: DOCTOR & DATE */}
          <Box sx={rowStyle}>
            <Box sx={colStyle}>
              <InputField
                label="Attending Doctor"
                value={formData.doctor}
                InputProps={{ readOnly: true }}
                startAdornment={<MedicalServices sx={iconColor} />}
                sx={inputSx}
              />
            </Box>
            <Box sx={colStyle}>
              <InputField
                label="Consultation Date"
                value={formData.date}
                InputProps={{ readOnly: true }}
                startAdornment={<CalendarToday sx={iconColor} />}
                sx={inputSx}
              />
            </Box>
          </Box>

          {/* === LARGE TEXT AREAS (Stacked Vertical) === */}

          <InputField
            label="Symptoms"
            name="symptoms"
            multiline
            rows={2} 
            value={isEditMode ? formData.symptoms : data.symptoms}
            onChange={handleInputChange}
            InputProps={{ readOnly: !isEditMode }}
            sx={inputSx}
          />

          <InputField
            label="Diagnosis"
            name="diagnosis"
            multiline
            rows={2}
            value={isEditMode ? formData.diagnosis : data.diagnosis}
            onChange={handleInputChange}
            InputProps={{ readOnly: !isEditMode }}
            sx={inputSx}
          />

          <InputField
            label="Prescription"
            name="prescription"
            multiline
            rows={2}
            value={isEditMode ? formData.prescription : data.prescription}
            onChange={handleInputChange}
            InputProps={{ readOnly: !isEditMode }}
            sx={inputSx}
          />

          <InputField
            label="Remarks / Notes"
            name="remarks"
            multiline
            rows={2}
            value={isEditMode ? formData.remarks : data.remarks}
            onChange={handleInputChange}
            InputProps={{ readOnly: !isEditMode }}
            sx={inputSx}
          />

          {/* BUTTONS */}
          {isEditMode && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1, height: 40,  }}>
              <OutlineButton onClick={onClose}>
                Cancel
              </OutlineButton>
              <GradientButton onClick={handleSave}>
                Save Changes
              </GradientButton>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ConsultationModal;