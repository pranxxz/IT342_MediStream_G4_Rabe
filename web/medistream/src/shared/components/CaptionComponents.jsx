import React from 'react';
import { Typography } from '@mui/material';

export const Caption = ({ children, sx = {}, ...props }) => (
  <Typography
    variant="caption"
    sx={{
      color: '#9ca3af',
      fontWeight: 500,
      fontSize: '0.75rem',
      ...sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

export const SubCaption = ({ children, sx = {}, ...props }) => (
  <Typography
    variant="caption"
    sx={{
      color: '#6b7280',
      fontWeight: 600,
      fontSize: '0.75rem',
      ...sx
    }}
    {...props}
  >
    {children}
  </Typography>
);