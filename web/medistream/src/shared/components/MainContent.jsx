import React from 'react';
import { Box } from '@mui/material';

export const MainContent = ({ children }) => (
  <Box
    component="main"
    sx={{
      flexGrow: 1,
      marginLeft: '240px',         
      height: '100%',
      backgroundColor: '#f5f5f7',
      borderRadius: { sm: '40px 0 0 40px' },
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)',
      overflowY: 'auto',
      position: 'relative'
    }}
  >
    {children}
  </Box>
);