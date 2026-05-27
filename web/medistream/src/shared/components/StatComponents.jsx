import React from 'react';
import { Card, Typography, Box } from '@mui/material';

// Stat Cards
export const StatCard = ({ children, sx = {}, ...props }) => (
  <Card 
    sx={{ 
      background: 'white',
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s ease',
      minHeight: 130,
      '&:hover': {
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      },
      ...sx
    }}
    {...props}
  >
    {children}
  </Card>
);

export const StatTitle = ({ children, sx = {}, ...props }) => (
  <Typography 
    variant="body2"
    sx={{
      color: '#6b7280',
      fontWeight: 600,
      mb: 1,
      fontSize: '0.875rem',
      fontFamily: '"Arimo", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      ...sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

export const StatNumber = ({ children, sx = {}, ...props }) => (
  <Typography 
    variant="h3"
    sx={{
      color: '#1f2937',
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1,
      fontFamily: '"Arimo", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mb: 0.5,
      ...sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

export const SubText = ({ children, sx = {}, ...props }) => (
  <Typography 
    variant="caption"
    sx={{
      color: '#9ca3af',
      fontWeight: 400,
      fontSize: '0.8125rem',
      display: 'block',
      ...sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

export const StatIcon = ({ children, background = '#44000D', sx = {}, ...props }) => (
  <Box 
    sx={{ 
      background,
      p: 1.5,
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 56,
      height: 56,
      flexShrink: 0,
      ...sx
    }}
    {...props}
  >
    {children}
  </Box>
);