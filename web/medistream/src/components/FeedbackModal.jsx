import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button
} from '@mui/material';
import {
  CheckCircle,
  ErrorOutline,
  WarningAmber,
  Info
} from '@mui/icons-material';
import { GradientButton } from './ButtonComponents'; // Assuming you have this

// 1. Helper to get the Icon and Color based on type
const getTypeStyles = (type) => {
  switch (type) {
    case 'success':
      return {
        icon: <CheckCircle sx={{ fontSize: 60, color: '#10b981' }} />, // Green
        color: '#10b981',
        btnGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      };
    case 'error':
      return {
        icon: <ErrorOutline sx={{ fontSize: 60, color: '#ef4444' }} />, // Red
        color: '#ef4444',
        btnGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      };
    case 'delete':
    case 'warning':
      return {
        icon: <WarningAmber sx={{ fontSize: 60, color: '#f59e0b' }} />, // Orange/Amber
        color: '#d97706',
        btnGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' // Red button for delete
      };
    default: // 'info'
      return {
        icon: <Info sx={{ fontSize: 60, color: '#3b82f6' }} />, // Blue
        color: '#3b82f6',
        btnGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' // Your standard purple
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
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', pt: 2, pb: 1 }}>
        {/* Animated Icon Container */}
        <Box
          sx={{
            mb: 2,
            display: 'inline-flex',
            p: 2,
            borderRadius: '50%',
            backgroundColor: `${styles.color}15`, // 15% opacity background matches icon color
            animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {styles.icon}
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#1f2937',
            mb: 1,
            fontFamily: '"Arimo", sans-serif'
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#6b7280',
            lineHeight: 1.6,
            fontFamily: '"Inter", sans-serif'
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2, px: 3, gap: 2 }}>
        {isConfirmMode ? (
          // Two Buttons (Cancel & Confirm) - For Delete/Warning
          <>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                flex: 1,
                borderRadius: 2,
                textTransform: 'none',
                color: '#6b7280',
                borderColor: '#e5e7eb',
                fontWeight: 600,
                padding: '8px 0',
                '&:hover': {
                  borderColor: '#d1d5db',
                  backgroundColor: '#f9fafb'
                }
              }}
            >
              {cancelText}
            </Button>
            <GradientButton
              onClick={onConfirm}
              sx={{
                flex: 1,
                background: styles.btnGradient, // Dynamic color based on type
                padding: '8px 0',
                '&:hover': { background: styles.btnGradient, opacity: 0.9 }
              }}
            >
              {confirmText}
            </GradientButton>
          </>
        ) : (
          // Single Button (Okay) - For Success/Error/Info
          <GradientButton
            onClick={onClose}
            sx={{
              width: '100%',
              background: styles.btnGradient,
              padding: '10px 0',
              fontSize: '1rem',
              '&:hover': { background: styles.btnGradient, opacity: 0.9 }
            }}
          >
            {confirmText}
          </GradientButton>
        )}
      </DialogActions>
    </Dialog>
  );
};