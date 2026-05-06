import { Card, Box, IconButton } from '@mui/material';

export const PatientCard = ({ patient, onMenuClick, ...props }) => (
  <Card 
    sx={{ 
      p: 3, 
      borderRadius: 3,
      boxShadow: '0 2px 12px rgba(102, 126, 234, 0.08)',
      border: '1px solid rgba(102, 126, 234, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
        transform: 'translateY(-2px)',
        borderColor: 'rgba(102, 126, 234, 0.2)',
      }
    }}
    {...props}
  >
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box sx={{ flex: 1 }}>
        {/* Card content that's repeated across Patient.jsx, PatientHistory.jsx, etc. */}
      </Box>
      <IconButton onClick={onMenuClick}>...</IconButton>
    </Box>
  </Card>
);