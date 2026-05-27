import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, TextField, FormControl, Typography, Divider } from '@mui/material';
import { Google } from '@mui/icons-material';

export const MAROON = "#3d080b";
export const MAROON_LIGHT = "#5c1a1d";
export const MAUVE = "#c1a7a7";

export const IconBox = styled(Box)({
  background: MAROON,
  borderRadius: '6px',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  marginRight: '8px'
});

export const StyledInput = styled(TextField)({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      borderColor: MAROON,
      borderWidth: '1.5px',
    },
    '&:hover fieldset': {
      borderColor: MAROON,
    },
    '&.Mui-focused fieldset': {
      borderColor: MAROON,
    },
  },
  '& .MuiInputLabel-root': {
    color: MAROON,
    fontWeight: 600,
    '&.Mui-focused': {
      color: MAROON,
    }
  }
});

export const StyledSelect = styled(FormControl)({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      borderColor: MAROON,
      borderWidth: '1.5px',
    },
    '&:hover fieldset': {
      borderColor: MAROON,
    },
    '&.Mui-focused fieldset': {
      borderColor: MAROON,
    },
  },
  '& .MuiInputLabel-root': {
    color: MAROON,
    fontWeight: 600,
    '&.Mui-focused': {
      color: MAROON,
    }
  }
});

export const PrimaryButton = styled(Button)({
  background: MAROON,
  color: 'white',
  borderRadius: '10px',
  padding: '8px 10px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '15px',
  width: '180px',
  justifyContent: 'center',
  display: 'flex',
  '&:hover': {
    background: '#2a0507',
  },
  '&:disabled': {
    background: '#5c1a1d',
    color: 'rgba(255,255,255,0.6)'
  }
});

export const NavSideButton = styled(Button)({
  borderColor: 'white',
  color: 'white',
  borderRadius: '10px',
  padding: '10px 30px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '14px',
  borderWidth: '1.5px',
  minWidth: '150px',
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    borderColor: 'white',
    borderWidth: '1.5px',
  }
});

export const GoogleButton = styled(Button)({
  background: 'white',
  color: '#444',
  borderRadius: '10px',
  padding: '10px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '14px',
  width: '180px',
  border: '1px solid #ddd',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  '&:hover': {
    background: '#f8f9fa',
    borderColor: '#ccc',
  }
});

export const DividerWithText = ({ text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', my: 2, width: '100%' }}>
    <Divider sx={{ flex: 1, borderColor: 'rgba(0,0,0,0.1)' }} />
    <Typography variant="caption" sx={{ px: 2, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
      {text}
    </Typography>
    <Divider sx={{ flex: 1, borderColor: 'rgba(0,0,0,0.1)' }} />
  </Box>
);