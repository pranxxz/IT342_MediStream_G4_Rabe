import React from 'react';
import { Box, Typography, Button } from '@mui/material';

// Header Components
export const HeaderPaper = ({ children, sx = {}, ...props }) => (
  <Box
    sx={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      py: 3,
      px: 4,
      mb: 0,
      ...sx
    }}
    {...props}
  >
    {children}
  </Box>
);

export const HeaderIcon = ({ children, sx = {}, ...props }) => (
  <Box
    sx={{
      width: 40,
      height: 40,
      borderRadius: 2,
      background: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...sx
    }}
    {...props}
  >
    {children}
  </Box>
);

export const HeaderTitle = ({ children, sx = {}, ...props }) => (
  <Typography
    variant="h5"
    sx={{
      color: '#4B0082',
      fontWeight: 700,
        fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '1.5rem',
      ...sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

export const HeaderSubText = ({ children, sx = {}, ...props }) => (
  <Typography
    variant="body2"
    sx={{
      color: '#6b7280',
        fontFamily: '"Arimo", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '0.875rem',
      ...sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

export const HeaderButton = ({ 
  children,
  variant = "contained",
  startIcon,
  background = '#4B0082',
  color = 'rgba(255, 255, 255, 0.9)',
  textTransform = 'none',
  fontWeight = 700,
  borderRadius = 3,
  px = 4,
    fontFamily = '"Arimo", "Poppins", "Inter", "SF Pro Text", "Segoe UI", sans-serif',
  fontSize = '0.875rem',
  boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)',
  sx = {},
  ...props 
}) => (
  <Button 
    variant={variant}
    startIcon={startIcon}
    sx={{
      background,
      color,
      textTransform,
      fontWeight,
      borderRadius,
      px,
      fontFamily,
      fontSize,
      boxShadow,
      '&:hover': {
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
      },
      ...sx
    }}
    {...props}
  >
    {children}
  </Button>
);