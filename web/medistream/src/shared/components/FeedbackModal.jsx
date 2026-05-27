import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Zoom
} from '@mui/material';
import {
  CheckCircle,
  ErrorOutline,
  WarningAmber,
  Info
} from '@mui/icons-material';

// 1. Helper to get the Icon and Color based on type
const getTypeStyles = (type) => {
  switch (type) {
    case 'success':
      return {
        icon: <CheckCircle sx={{ fontSize: 44, color: '#10b981' }} />, // Green
        color: '#10b981',
        btnGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        glowColor: 'rgba(16, 185, 129, 0.25)'
      };
    case 'error':
      return {
        icon: <ErrorOutline sx={{ fontSize: 44, color: '#ef4444' }} />, // Red
        color: '#ef4444',
        btnGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        glowColor: 'rgba(239, 68, 68, 0.25)'
      };
    case 'delete':
    case 'warning':
      return {
        icon: <WarningAmber sx={{ fontSize: 44, color: '#f59e0b' }} />, // Orange/Amber
        color: '#f59e0b',
        btnGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Red button for delete
        glowColor: 'rgba(239, 68, 68, 0.3)'
      };
    default: // 'info'
      return {
        icon: <Info sx={{ fontSize: 44, color: '#3b82f6' }} />, // Blue
        color: '#3b82f6',
        btnGradient: 'linear-gradient(135deg, #7a0017 0%, #44000d 100%)', // Standard maroon
        glowColor: 'rgba(122, 0, 23, 0.25)'
      };
  }
};

export const FeedbackModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info', // 'success' | 'error' | 'delete' | 'info'
  confirmText = 'Okay',
  cancelText = 'Cancel'
}) => {
  const styles = getTypeStyles(type);
  const isConfirmMode = Boolean(onConfirm); // If onConfirm exists, show 2 buttons

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Zoom}
      TransitionProps={{ timeout: 350 }}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          p: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', pt: 3, pb: 1, px: 3 }}>
        {/* Animated Icon Container */}
        <Box
          sx={{
            mb: 3,
            display: 'inline-flex',
            width: 80,
            height: 80,
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: type === 'delete' || type === 'warning' ? '#fff9db' : `${styles.color}15`, // beautiful soft warm background for yellow warning
            animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {styles.icon}
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: '#1f2937',
            mb: 1.5,
            fontSize: '1.45rem',
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: '-0.5px'
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#4b5563',
            lineHeight: 1.6,
            mb: 2.5,
            fontSize: '0.98rem',
            fontFamily: '"Inter", sans-serif'
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3, gap: 2 }}>
        {isConfirmMode ? (
          // Two Buttons (Cancel & Confirm) - For Delete/Warning
          <>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                flex: 1,
                borderRadius: '40px',
                textTransform: 'none',
                color: '#4b5563',
                borderColor: '#d1d5db',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '12px 24px',
                fontFamily: '"Inter", sans-serif',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                  transform: 'translateY(-1.5px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }
              }}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              sx={{
                flex: 1,
                borderRadius: '40px',
                textTransform: 'none',
                color: 'white',
                background: styles.btnGradient,
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '12px 24px',
                fontFamily: '"Inter", sans-serif',
                boxShadow: `0 6px 20px ${styles.glowColor}`,
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  background: styles.btnGradient,
                  boxShadow: `0 8px 25px ${styles.glowColor}`,
                  transform: 'translateY(-1.5px)',
                }
              }}
            >
              {confirmText}
            </Button>
          </>
        ) : (
          // Single Button (Okay) - For Success/Error/Info
          <Button
            onClick={onClose}
            sx={{
              width: '100%',
              borderRadius: '40px',
              textTransform: 'none',
              color: 'white',
              background: styles.btnGradient,
              fontWeight: 700,
              fontSize: '0.98rem',
              padding: '12px 0',
              fontFamily: '"Inter", sans-serif',
              boxShadow: `0 6px 20px ${styles.glowColor}`,
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': {
                background: styles.btnGradient,
                boxShadow: `0 8px 25px ${styles.glowColor}`,
                transform: 'translateY(-1.5px)',
              }
            }}
          >
            {confirmText}
          </Button>
        )}
      </DialogActions>

      {/* Styled Animations */}
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1.0); opacity: 1; }
        }
      `}</style>
    </Dialog>
  );
};