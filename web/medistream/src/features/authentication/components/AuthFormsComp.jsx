import React from 'react';
import { Box, TextField, MenuItem, IconButton, InputAdornment, FormControl, InputLabel, Select, Alert, Grid } from '@mui/material';
import { Visibility, VisibilityOff, Lock, Email, Person, Badge, Mail } from '@mui/icons-material';
import { MAROON, IconBox, StyledInput, StyledSelect } from './AuthStyledComp';

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
          borderRadius: 2.65,
          height: '46px',
          '& fieldset': {
            borderColor: isError ? '#f44336' : MAROON,
          },
          '&:hover fieldset': {
            borderColor: isError ? '#f44336' : MAROON,
          },
          '&.Mui-focused fieldset': {
            borderColor: isError ? '#f44336' : MAROON,
          },
        },
        '& .MuiOutlinedInput-input': {
          py: '12px',
          px: '10px',
          fontSize: '0.85rem',
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        },
        '& .MuiInputLabel-root': {
          color: isError ? '#f44336' : MAROON,
          '&.Mui-focused': {
            color: isError ? '#f44336' : MAROON,
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
      placeholder="Enter your password"
      touched={touched}
      error={error}
      helperText={helperText}
      startAdornment={
        <Lock 
          sx={{ 
            mr: 1,
            color: isError ? '#f44336' : MAROON,
            fontSize: '1.2rem'
          }}
        />
      }
      endAdornment={
        <IconButton
          onClick={onToggleVisibility}
          edge="end"
          sx={{
            color: MAROON,
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
            color: isError ? '#f44336' : MAROON,
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
          placeholder="Enter your first name"
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
                    color: isFirstNameError ? '#f44336' : MAROON,
                    fontSize: '1.2rem'
                  }}
                />
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2.65,
              height: '46px',
              '& fieldset': {
                borderColor: isFirstNameError ? '#f44336' : MAROON,
              },
              '&:hover fieldset': {
                borderColor: isFirstNameError ? '#f44336' : MAROON,
              },
              '&.Mui-focused fieldset': {
                borderColor: isFirstNameError ? '#f44336' : MAROON,
              },
            },
            '& .MuiOutlinedInput-input': {
              py: '12px',
              px: '10px',
              fontSize: '0.85rem',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            },
            '& .MuiInputLabel-root': {
              color: isFirstNameError ? '#f44336' : MAROON,
              '&.Mui-focused': {
                color: isFirstNameError ? '#f44336' : MAROON,
              },
            },
          }}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <TextField
          label="Last Name"
          variant="outlined"
          placeholder="Enter your last name"
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
                    color: isLastNameError ? '#f44336' : MAROON,
                    fontSize: '1.2rem'
                  }}
                />
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2.65,
              height: '46px',
              '& fieldset': {
                borderColor: isLastNameError ? '#f44336' : MAROON,
              },
              '&:hover fieldset': {
                borderColor: isLastNameError ? '#f44336' : MAROON,
              },
              '&.Mui-focused fieldset': {
                borderColor: isLastNameError ? '#f44336' : MAROON,
              },
            },
            '& .MuiOutlinedInput-input': {
              py: '12px',
              px: '10px',
              fontSize: '0.85rem',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            },
            '& .MuiInputLabel-root': {
              color: isLastNameError ? '#f44336' : MAROON,
              '&.Mui-focused': {
                color: isLastNameError ? '#f44336' : MAROON,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

// RoleAndIdFieldsRow Component
export const RoleAndIdFieldsRow = ({
  role,
  idNumber,
  onRoleChange,
  onIdNumberChange,
  onRoleBlur,
  onIdNumberBlur,
  roleError,
  idNumberError,
  roleTouched,
  idNumberTouched,
}) => {
  const isIdNumberError = idNumberTouched && !!idNumberError;

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <RoleSelectField
          value={role}
          onChange={onRoleChange}
          onBlur={onRoleBlur}
          error={roleError}
          helperText={roleError}
          touched={roleTouched}
          sx={{ mb: 0 }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <NumberField
          label="ID Number"
          placeholder="Enter ID number"
          value={idNumber}
          onChange={onIdNumberChange}
          onBlur={onIdNumberBlur}
          error={idNumberError}
          helperText={idNumberError}
          touched={idNumberTouched}
          startAdornment={
            <Badge 
              sx={{ 
                color: isIdNumberError ? '#f44336' : MAROON,
                fontSize: '1.2rem'
              }}
            />
          }
          sx={{ mb: 0 }}
        />
      </Box>
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
              color: isError ? '#f44336' : MAROON,
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
            color: MAROON,
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

// NumberField Component
export const NumberField = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  touched = true,
  disabled,
  placeholder,
  startAdornment,
  fullWidth = true,
  sx = {},
  ...props
}) => {
  const isError = touched && !!error;
  
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      fullWidth={fullWidth}
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={isError}
      helperText={touched ? helperText : ''}
      disabled={disabled}
      inputMode="numeric"
      pattern="[0-9]*"
      slotProps={{
        input: {
          startAdornment: startAdornment && (
            <InputAdornment position="start">
              {startAdornment}
            </InputAdornment>
          ),
        },
      }}
      sx={{
        mb: 3,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2.65,
          height: '46px',
          '& fieldset': {
            borderColor: isError ? '#f44336' : MAROON,
          },
          '&:hover fieldset': {
            borderColor: isError ? '#f44336' : MAROON,
          },
          '&.Mui-focused fieldset': {
            borderColor: isError ? '#f44336' : MAROON,
          },
        },
        '& .MuiOutlinedInput-input': {
          py: '12px',
          px: '10px',
          fontSize: '0.85rem',
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        },
        '& .MuiInputLabel-root': {
          color: isError ? '#f44336' : MAROON,
          '&.Mui-focused': {
            color: isError ? '#f44336' : MAROON,
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};

// LoginStyledInput with IconBox
export const LoginStyledInput = ({ icon: Icon, ...props }) => {
  return (
    <StyledInput
      {...props}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconBox>
              <Icon sx={{ fontSize: 14 }} />
            </IconBox>
          </InputAdornment>
        ),
        ...props.InputProps
      }}
    />
  );
};

// ErrorAlert Component
export const ErrorAlert = ({ message, sx = {} }) => {
  if (!message) return null;
  
  return (
    <Alert severity="error" sx={{ mb: 3, borderRadius: '10px', ...sx }}>
      {message}
    </Alert>
  );
};