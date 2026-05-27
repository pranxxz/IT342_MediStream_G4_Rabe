import { Box, Typography, TextField, MenuItem } from '@mui/material';

const FIELD_STYLES = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontFamily: '"Arimo", "Poppins", -apple-system, sans-serif',
    backgroundColor: 'white',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: '#e5e7eb',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: '#c4b5b8',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#44000d',
      borderWidth: '1.5px',
    },
    '&.Mui-error fieldset': {
      borderColor: '#ef4444',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#1f2937',
    padding: '10px 14px',
    fontFamily: '"Arimo", "Poppins", -apple-system, sans-serif',
    '&::placeholder': {
      color: '#9ca3af',
      fontWeight: 400,
    },
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.75rem',
    marginLeft: 0,
    marginTop: '4px',
    fontFamily: '"Arimo", "Poppins", -apple-system, sans-serif',
  },
};

const FieldLabel = ({ label, required }) => (
  <Typography
    variant="body2"
    fontWeight={600}
    mb={0.75}
    sx={{
      fontFamily: '"Arimo", "Poppins", -apple-system, sans-serif',
      color: '#374151',
      fontSize: '0.8125rem',
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      letterSpacing: '0.01em',
    }}
  >
    {label}
    {required && (
      <Box component="span" sx={{ color: '#44000d', fontSize: '0.75rem', lineHeight: 1 }}>
        *
      </Box>
    )}
  </Typography>
);

export const FormTextField = ({
  label,
  variant = 'outlined',
  size = 'small',
  required = false,
  error = false,
  helperText,
  mb = 2.5,
  ...props
}) => (
  <Box sx={{ mb }}>
    <FieldLabel label={label} required={required} />
    <TextField
      fullWidth
      variant={variant}
      size={size}
      error={error}
      helperText={helperText}
      sx={FIELD_STYLES}
      {...props}
    />
  </Box>
);

export const FormSelectField = ({
  label,
  options = [],
  required = false,
  error = false,
  helperText,
  mb = 2.5,
  ...props
}) => (
  <Box sx={{ mb }}>
    <FieldLabel label={label} required={required} />
    <TextField
      select
      fullWidth
      size="small"
      error={error}
      helperText={helperText}
      sx={{
        ...FIELD_STYLES,
        '& .MuiOutlinedInput-root': {
          ...FIELD_STYLES['& .MuiOutlinedInput-root'],
          height: '40px',
        },
        '& .MuiSelect-select': {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#1f2937',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          fontFamily: '"Arimo", "Poppins", -apple-system, sans-serif',
        },
      }}
      {...props}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            fontSize: '0.875rem',
            fontFamily: '"Arimo", "Poppins", -apple-system, sans-serif',
            fontWeight: 500,
            color: '#1f2937',
            '&:hover': { backgroundColor: '#fdf2f4' },
            '&.Mui-selected': {
              backgroundColor: '#44000d',
              color: 'white',
              '&:hover': { backgroundColor: '#5a0011' },
            },
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  </Box>
);