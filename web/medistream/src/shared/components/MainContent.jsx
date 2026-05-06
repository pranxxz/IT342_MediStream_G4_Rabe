import React from 'react';
import { Box } from '@mui/material';

export const MainContent = ({ children }) => (
  <Box
    component="main"
    sx={{
      flexGrow: 1,
      width: { sm: `calc(100% - 240px)` },
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}
  >
    {children}
  </Box>
);