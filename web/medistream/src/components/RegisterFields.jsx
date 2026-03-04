import React from 'react';
import { Box, Typography, TextField, MenuItem, IconButton, Button } from '@mui/material';
import { Visibility, VisibilityOff, Lock, Email, Person, Badge } from '@mui/icons-material';

// InputField Component
export const InputField = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type = 'text',
  startAdornment,
  endAdornment,
  touched = true,
  fullWidth = true,
  sx = {},
  select = false,
  children,
  ...props
}) => {
  const isError = touched && !!error;
  
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      fullWidth={fullWidth}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={isError}
      helperText={touched ? helperText : ''}
      select={select}
      slotProps={{
        input: {
          startAdornment: startAdornment,
          endAdornment: endAdornment,
        },
      }}
      sx={{
        mb: 3,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '& fieldset': {
            borderColor: isError ? '#f44336' : '#44000d',
          },
          '&:hover fieldset': {
            borderColor: isError ? '#f44336' : '#44000d',
          },
          '&.Mui-focused fieldset': {
            borderColor: isError ? '#f44336' : '#44000d',
          },
        },
        '& .MuiOutlinedInput-input': {
          py: '12px',
          px: '10px',
          fontSize: '0.85rem',
        },
        '& .MuiInputLabel-root': {
          color: isError ? '#f44336' : '#44000d',
          '&.Mui-focused': {
            color: isError ? '#f44336' : '#44000d',
          },
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </TextField>
  );
};

// PasswordField Component
export const PasswordField = ({
  label = 'Password',
  showPassword,
  onToggleVisibility,
  touched = true,
  error,
  helperText,
  sx = {},
  ...props
}) => {
  const isError = touched && !!error;
  
  return (
    <InputField
      label={label}
      type={showPassword ? "text" : "password"}
      touched={touched}
      error={error}
      helperText={helperText}
      startAdornment={
        <Lock 
          sx={{ 
            mr: 1,
            color: isError ? '#f44336' : '#44000d',
            fontSize: '1.2rem'
          }}
        />
      }
      endAdornment={
        <IconButton
          onClick={onToggleVisibility}
          edge="end"
          sx={{
            color: '#44000d',
            paddingRight: '13px',
          }}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      }
      sx={sx}
      {...props}
    />
  );
};

// RoleSelectField Component
export const RoleSelectField = ({
  label = 'Role',
  value,
  onChange,
  onBlur,
  error,
  helperText,
  touched = true,
  options = [
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'staff', label: 'Staff' }
  ],
  sx = {},
  ...props
}) => {
  const isError = touched && !!error;
  
  return (
    <InputField
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      touched={touched}
      select
      startAdornment={
        <Badge 
          sx={{ 
            mr: 1,
            color: isError ? '#f44336' : '#44000d',
            fontSize: '1.2rem'
          }}
        />
      }
      sx={sx}
      {...props}
    >
      <MenuItem value=""><em>Select your role</em></MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </InputField>
  );
};

// NameFieldsRow Component
export const NameFieldsRow = ({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onFirstNameBlur,
  onLastNameBlur,
  firstNameError,
  lastNameError,
  firstNameTouched,
  lastNameTouched,
}) => {
  const isFirstNameError = firstNameTouched && !!firstNameError;
  const isLastNameError = lastNameTouched && !!lastNameError;

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Box sx={{ flex: 1 }}>
        <TextField
          label="First Name"
          variant="outlined"
          value={firstName}
          onChange={onFirstNameChange}
          onBlur={onFirstNameBlur}
          error={isFirstNameError}
          helperText={isFirstNameError ? firstNameError : ''}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <Person 
                  sx={{ 
                    mr: 1,
                    color: isFirstNameError ? '#f44336' : '#44000d',
                    fontSize: '1.2rem'
                  }}
                />
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                borderColor: isFirstNameError ? '#f44336' : '#44000d',
              },
              '&:hover fieldset': {
                borderColor: isFirstNameError ? '#f44336' : '#44000d',
              },
              '&.Mui-focused fieldset': {
                borderColor: isFirstNameError ? '#f44336' : '#44000d',
              },
            },
            '& .MuiOutlinedInput-input': {
              py: '12px',
              px: '10px',
              fontSize: '0.85rem',
            },
            '& .MuiInputLabel-root': {
              color: isFirstNameError ? '#f44336' : '#44000d',
              '&.Mui-focused': {
                color: isFirstNameError ? '#f44336' : '#44000d',
              },
            },
          }}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <TextField
          label="Last Name"
          variant="outlined"
          value={lastName}
          onChange={onLastNameChange}
          onBlur={onLastNameBlur}
          error={isLastNameError}
          helperText={isLastNameError ? lastNameError : ''}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <Person 
                  sx={{ 
                    mr: 1,
                    color: isLastNameError ? '#f44336' : '#44000d',
                    fontSize: '1.2rem'
                  }}
                />
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                borderColor: isLastNameError ? '#f44336' : '#44000d',
              },
              '&:hover fieldset': {
                borderColor: isLastNameError ? '#f44336' : '#44000d',
              },
              '&.Mui-focused fieldset': {
                borderColor: isLastNameError ? '#f44336' : '#44000d',
              },
            },
            '& .MuiOutlinedInput-input': {
              py: '12px',
              px: '10px',
              fontSize: '0.85rem',
            },
            '& .MuiInputLabel-root': {
              color: isLastNameError ? '#f44336' : '#44000d',
              '&.Mui-focused': {
                color: isLastNameError ? '#f44336' : '#44000d',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

// ErrorAlert Component
export const ErrorAlert = ({ message, sx = {} }) => {
  if (!message) return null;
  
  return (
    <Box sx={{
      mb: 3,
      p: 2,
      borderRadius: 2,
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      color: '#c33',
      fontSize: '0.875rem',
      ...sx,
    }}>
      {message}
    </Box>
  );
};

// EmailField Component
export const EmailField = ({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  touched = true,
  checkingEmail = false,
  sx = {},
  ...props
}) => {
  const isError = touched && !!error;
  
  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      <InputField
        label="Email"
        placeholder="Enter your email"
        type="email"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        touched={touched}
        startAdornment={
          <Email 
            sx={{ 
              mr: 1,
              color: isError ? '#f44336' : '#44000d',
              fontSize: '1.2rem'
            }}
          />
        }
        sx={{ mb: 0, ...sx }}
        {...props}
      />
      {checkingEmail && (
        <Box 
          sx={{ 
            position: 'absolute', 
            right: 12, 
            top: '20px', 
            color: '#44000d',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          Checking...
        </Box>
      )}
    </Box>
  );
};