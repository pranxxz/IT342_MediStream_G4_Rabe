import { Box, Typography, TextField, MenuItem } from '@mui/material';

export const FormTextField = ({ 
  label, 
  variant = "outlined", 
  size = "small", 
  required = false,
  error = false,
  helperText,
  ...props 
}) => (
  <Box sx={{ mb: 3 }}>
    <Typography 
      variant="body2" 
      fontWeight={600} 
      mb={1} 
      sx={{ 
        fontFamily: '"Arimo", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
        color: '#1f2937',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: 0.5
      }}
    >
      {label}
      {required}
    </Typography>
    <TextField
      fullWidth
      variant={variant}
      size={size}
      error={error}
      helperText={helperText}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 1,
          fontFamily: '"Arimo", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: 'white',
          transition: 'all 0.2s ease',
          '& fieldset': { 
            borderColor: error ? '#ef4444' : '#e5e7eb',
            borderWidth: '1px'
          },
          '&:hover fieldset': { 
            borderColor: error ? '#ef4444' : '#d1d5db' 
          },
          '&.Mui-focused fieldset': { 
            borderColor: error ? '#ef4444' : '#44000d',
            borderWidth: '1px'
          },
        },
        '& .MuiInputBase-input': {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#1f2937',
          padding: '10px 14px',
          height: '20px',  
          '&::placeholder': {
            color: '#9ca3af',
            fontWeight: 400,
          }
        },
        '& .MuiFormHelperText-root': {
          fontSize: '0.75rem',
          marginLeft: 0,
          marginTop: 1,
          color: error ? '#ef4444' : '#6b7280',
          fontFamily: '"Arimo", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }
      }}
      required
      {...props}
    />
  </Box>
);

export const FormSelectField = ({ 
  label, 
  options, 
  required = false,
  error = false,
  helperText,
  ...props 
}) => (
  <Box sx={{ mb: 3 }}>
    <Typography 
      variant="body2" 
      fontWeight={600} 
      mb={1} 
      sx={{ 
        fontFamily: '"Arimo", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
        color: '#1f2937',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: 0.5
      }}
    >
      {label}
      {required && (
        <Box component="span" sx={{ color: '#ef4444', fontSize: '0.75rem' }}>
          *
        </Box>
      )}
    </Typography>
    <TextField
      select
      fullWidth
      size="small"
      error={error}
      helperText={helperText}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 1,
          fontFamily: '"Arimo", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: 'white',
          height: '40px',  
          transition: 'all 0.2s ease',
          '& fieldset': { 
            borderColor: error ? '#ef4444' : '#e5e7eb',
            borderWidth: '1px'
          },
          '&:hover fieldset': { 
            borderColor: error ? '#ef4444' : '#d1d5db' 
          },
          '&.Mui-focused fieldset': { 
            borderColor: error ? '#ef4444' : '#44000d',
            borderWidth: '1px'
          },
        },
        '& .MuiSelect-select': {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#1f2937',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
        },
        '& .MuiFormHelperText-root': {
          fontSize: '0.75rem',
          marginLeft: 0,
          marginTop: 1,
          color: error ? '#ef4444' : '#6b7280',
          fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }
      }}
      {...props}
    >
      {options.map((option) => (
        <MenuItem 
          key={option.value} 
          value={option.value}
          sx={{
            fontSize: '0.875rem',
            fontFamily: '"Arimo", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 500,
            color: '#1f2937',
            '&:hover': {
              backgroundColor: '#f3f4f6',
            },
            '&.Mui-selected': {
              backgroundColor: '#44000d',
              color: 'white',
              '&:hover': {
                backgroundColor: '#44000d',
              }
            }
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  </Box>
);