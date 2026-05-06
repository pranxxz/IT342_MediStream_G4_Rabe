import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import MenuItem from '@mui/material/MenuItem';
import { useNumericInput, useFormValidation } from '../hooks';
import { GradientButton } from './ButtonComponents';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

// Existing CustomTextField
const CustomTextField = ({ sx, labelSx, ...props }) => (
  <TextField
    fullWidth
    variant="standard"
    // If you actually wanted to use those styles, pass them here:
    InputLabelProps={{ sx: labelSx }} 
    sx={{
      '& .MuiInput-underline': {
        '&:before': { borderBottomColor: '#4B0082' },
        '&:hover:before': { borderBottomColor: '#4B0082' },
        '&:after': { borderBottomColor: '#4B0082' },
      },
      '& .MuiInputBase-input': {
        fontSize: 14,
        padding: '10px 0', 
        fontWeight: 600,
        height: '20px',             
        boxSizing: 'content-box',
      },
      '& .MuiInputLabel-root': { paddingLeft: '5px' },
      mb: 2,
      ...sx,
    }}
    {...props} 
  />
);

const GenderSelectField = ({ value, onChange, error, helperText, ...props }) => {
  return (
    <CustomTextField
      select
      label="Gender"
      required
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      {...props}
    >
      <MenuItem value=""><em>Select Gender</em></MenuItem>
      <MenuItem value="Male">Male</MenuItem>
      <MenuItem value="Female">Female</MenuItem>
    </CustomTextField>
  );
};

export function PatientFormModal({ 
    open, 
    onClose, 
    onSubmit, // NEW: Function to handle submission logic
    initialData = null, // NEW: Data for editing (optional)
    title = "Join Queue", // NEW: Customizable Title
    subtitle = "Fill in details below.", // NEW: Customizable Subtitle
    submitLabel = "Submit & Join Queue", // NEW: Customizable Button Label
    isSubmitting = false // NEW: Loading state for button
}) { 
  
  // Initialize inputs
  const ageInput = useNumericInput(initialData?.age || '');
  const contactInput = useNumericInput(initialData?.contactNo || '');
  const { errors, validateField, setFieldError, clearErrors } = useFormValidation();

  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactNo: '',
    address: '',
    ...initialData // Overwrite defaults if initialData exists
  });

  // Reset form when modal opens/closes or initialData changes
  React.useEffect(() => {
    if (open) {
        if (initialData) {
            setFormData(initialData);
            ageInput.setValue(initialData.age); // Assuming useNumericInput has setValue
            contactInput.setValue(initialData.contactNo);
        } else {
            // Reset to empty
            setFormData({ firstName: '', lastName: '', age: '', gender: '', contactNo: '', address: '' });
            ageInput.reset();
            contactInput.reset();
        }
        clearErrors();
    }
  }, [open, initialData]);

  // Sync hooks
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      age: ageInput.value,
      contactNo: contactInput.value
    }));
  }, [ageInput.value, contactInput.value]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setFieldError(field, '');
  };

  const validateForm = () => {
    const ageError = validateField('age', formData.age);
    const contactError = validateField('contactNo', formData.contactNo);
    const genderError = !formData.gender ? "Gender is required" : "";
    
    const newErrors = {};
    if (ageError) newErrors.age = ageError;
    if (contactError) newErrors.contactNo = contactError;
    if (genderError) newErrors.gender = genderError;

    Object.keys(newErrors).forEach(field => setFieldError(field, newErrors[field]));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
        // Pass the data back to the parent component
        // The parent handles API calls, navigation, etc.
        onSubmit(formData); 
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="queue-modal-title"
      aria-describedby="queue-modal-description"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
            <Typography 
            id="queue-modal-title" 
            fontSize= "22px"
            component="h2" 
            fontWeight="bold" 
            mb={1}
                sx={{ 
                fontFamily: '"Arimo", "Poppins", "Inter", "SF Pro Text", "Segoe UI", sans-serif',
                color: '#4B0082',
                }}
            >
            {title}
            </Typography>
            
            <Typography 
            variant="body2" 
            mb={3}
            sx={{ 
                fontFamily: '"Arimo", "Poppins", "Inter", "SF Pro Text", "Segoe UI", sans-serif',
                color: '#666',
            }}
            >
            {subtitle}
            </Typography>

            <form onSubmit={handleSubmit}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>

                {/* First Name & Last Name Row */}
                <Box sx={{ display: 'flex', gap: 2, width: '100%', flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box sx={{ flex: 1 }}>
                    <CustomTextField
                        label="First Name"
                        fontSize="12px"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        required
                        fullWidth
                    />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                    <CustomTextField
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        required
                        fullWidth
                    />
                    </Box>
                </Box>

                {/* Age, Gender & Contact Number Row */}
                <Box sx={{ display: 'flex', gap: 2, width: '100%', flexDirection: { xs: 'column', sm: 'row' }, mt:2, alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                    <CustomTextField
                        label="Age"
                        value={ageInput.value} 
                        onChange={ageInput.onChange}
                        required
                        fullWidth
                        labelSx={{ fontSize: '14px' }}
                        error={!!errors.age}
                        helperText={errors.age}
                        inputProps={{ maxLength: 3 }}
                    />
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <GenderSelectField
                        value={formData.gender}
                        onChange={handleInputChange('gender')}
                        error={!!errors.gender}
                        helperText={errors.gender}
                        required
                      />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                    <CustomTextField
                        label="Contact Number"
                        value={contactInput.value}
                        onChange={contactInput.onChange}
                        type="text"
                        required
                        fullWidth
                        labelSx={{ fontSize: '14px' }}
                        error={!!errors.contactNo}
                        helperText={errors.contactNo}
                        inputProps={{ maxLength: 11 }}
                    />
                    </Box>
                </Box>

                {/* Address */}
                <Box sx={{ width: '100%' , mt:2 }}>
                    <CustomTextField
                    label="Address"
                    value={formData.address}
                    onChange={handleInputChange('address')}
                    required
                    fullWidth
                    />
                </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                <GradientButton 
                    onClick={onClose}
                    // Override gradient button styles for "Cancel" to look different if needed
                    // Or use a simple Button component here
                    sx={{ 
                        padding: "5px 24px !important",
                        minWidth: "auto",
                        fontSize: "14px",
                        background: 'transparent',
                        color: '#666',
                        border: '1px solid #ccc',
                        '&:hover': { background: '#f5f5f5' }
                    }}
                >
                    Cancel
                </GradientButton>
                <GradientButton 
                    type="submit"
                    disabled={isSubmitting}
                    sx={{ 
                        padding: "5px 24px !important",
                        minWidth: "auto",
                        fontSize: "14px"
                    }}
                    >
                    {isSubmitting ? "Processing..." : submitLabel}
                </GradientButton>
                </Box>
            </form>
        </Box>
      </Fade>
    </Modal>
  );
}