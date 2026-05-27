import React from 'react';
import { Box, Typography, Fade, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MAROON, MAROON_LIGHT, MAUVE } from './AuthStyledComp';

// Decorative Card Component
export const DecorativeCard = () => {
  const navigate = useNavigate();
  return (
    <Fade in={true} timeout={1000}>
      <Box 
        onClick={() => navigate('/')}
        sx={{
          width: '80%',
          height: '180px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 5,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
          boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
          '&:hover': {
            transform: 'scale(1.02) translateY(-2px)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
            background: 'rgba(255,255,255,0.15)',
          }
        }}
      >
        <Box
          sx={{
            width: 54,
            height: 54,
            bgcolor: '#44000d',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(68, 0, 13, 0.3)',
            mb: 2,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h5l2-7 3 14 3-10 2 3h5" />
          </svg>
        </Box>
        <Typography variant="h4" sx={{ opacity: 0.9, fontWeight: 900, letterSpacing: -1, textAlign: 'center' }}>
          MediStream
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.6, mt: 1, fontWeight: 600, textAlign: 'center' }}>
          Streamlined Healthcare
        </Typography>
      </Box>
    </Fade>
  );
};

// Success Snackbar Component
export const SuccessSnackbar = ({ open, message, onClose, autoHideDuration = 2000 }) => (
  <Snackbar 
    open={open} 
    autoHideDuration={autoHideDuration} 
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert severity="success" sx={{ width: '100%', borderRadius: '10px', bgcolor: '#4caf50', color: 'white' }}>
      {message}
    </Alert>
  </Snackbar>
);

// CSS for floating shapes
export const FloatingShapesCSS = () => (
  <style>{`
    .bg-shape {
      position: absolute;
      border-radius: 50%;
      z-index: 1; 
      opacity: 0.2; 
      animation: float 12s infinite ease-in-out;
    }

    .shape-1 {
      top: -10%;
      left: -10%;
      width: 500px;
      height: 500px;
      background: ${MAUVE}; 
      animation-delay: 0s;
    }

    .shape-2 {
      bottom: -10%;
      right: -10%;
      width: 600px;
      height: 600px;
      background: ${MAUVE}; 
      animation-delay: 5s;
    }
    
    .shape-3 {
      top: 20%;
      right: 15%;
      width: 250px;
      height: 250px;
      background: ${MAROON}; 
      opacity: 0.1;
      animation-delay: 2s;
      animation-duration: 15s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-40px) translateX(30px); }
    }
  `}</style>
);

// Background Shapes Component
export const BackgroundShapes = () => (
  <>
    <div className="bg-shape shape-1"></div>
    <div className="bg-shape shape-2"></div>
    <div className="bg-shape shape-3"></div>
  </>
);

// Toggle Container CSS
export const ToggleContainerCSS = () => (
  <style>{`
    .container {
      background-color: #fff;
      border-radius: 35px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
      width: 1000px;
      max-width: 95vw;
      min-height: 620px;
      z-index: 100; 
      display: flex;
    }

    .form-box {
      position: absolute;
      top: 0;
      height: 100%;
      transition: all 0.6s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .form-box.login {
      left: 0;
      width: 50%;
      z-index: 2;
    }

    .form-box.register {
      left: 0;
      width: 50%;
      z-index: 1;
      opacity: 0;
    }

    .container.active .form-box.login {
      transform: translateX(100%);
      opacity: 0; 
    }

    .container.active .form-box.register {
      transform: translateX(100%);
      opacity: 1; 
      z-index: 5;
    }

    .toggle-container {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 100%;
      overflow: hidden;
      transition: all 0.6s ease-in-out;
      border-radius: 200px 0 0 150px;
      z-index: 1000;
    }

    .container.active .toggle-container {
      transform: translateX(-100%);
      border-radius: 0 200px 150px 0;
    }

    .toggle {
      background: linear-gradient(to right, ${MAROON}, ${MAROON_LIGHT});
      height: 100%;
      color: #fff;
      position: relative;
      left: -100%;
      height: 100%;
      width: 200%;
      transform: translateX(0);
      transition: all 0.6s ease-in-out;
    }

    .container.active .toggle {
      transform: translateX(50%);
    }

    .toggle-panel {
      position: absolute;
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      top: 0;
      transform: translateX(0);
      transition: all 0.6s ease-in-out;
    }

    .toggle-panel.toggle-right {
      right: 0;
      transform: translateX(0);
    }

    .toggle-panel.toggle-left {
      transform: translateX(-200%);
    }

    .container.active .toggle-panel.toggle-right {
      transform: translateX(200%);
    }

    .container.active .toggle-panel.toggle-left {
      transform: translateX(0);
    }

    @media (max-width: 900px) {
      .container {
        min-height: 100vh;
        border-radius: 0;
        flex-direction: column;
      }
      .form-box {
        width: 100% !important;
        left: 0 !important;
        position: relative;
        opacity: 1 !important;
        transform: none !important;
      }
      .toggle-container {
        display: none;
      }
      .bg-shape {
        display: none; 
      }
    }
  `}</style>
);