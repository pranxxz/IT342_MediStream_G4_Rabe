import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

// Gradient Button Component
const StyledGradientButton = styled(Button)(({ theme }) => ({
  background: '#6A0DAD',
  color: "#fff",
  fontWeight: 600,
  textTransform: "none",
  padding: "4px 20px",
  borderRadius: 8,
  fontSize: "0.9rem",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 15px rgba(106, 13, 173, 0.4)",
  minWidth: "160px",
  "&:hover": {
    background: "linear-gradient(135deg, #4B0082 0%, #6A0DAD 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(106, 13, 173, 0.6)",
  },
}));

export function GradientButton({ children, sx = {}, ...props }) {
  return (
    <StyledGradientButton
      variant="contained"
      sx={sx}
      {...props}
    >
      {children}
    </StyledGradientButton>
  );
}

// Outline Button Component
const StyledOutlineButton = styled(Button)(({ theme }) => ({
  color: "#6A0DAD",
  fontWeight: 600,
  textTransform: "none",
  padding: "8px 32px",
  borderRadius: 8,
  border: "2px solid #6A0DAD",
  backgroundColor: "transparent",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  minWidth: "160px",
  "&:hover": {
    backgroundColor: "rgba(106, 13, 173, 0.1)",
    borderColor: "#4B0082",
    color: "#4B0082",
    transform: "translateY(-2px)",
  },
}));

export function OutlineButton({ children, sx = {}, ...props }) {
  return (
    <StyledOutlineButton
      variant="outlined"
      sx={sx}
      {...props}
    >
      {children}
    </StyledOutlineButton>
  );
}

// Nav Button Component
const StyledNavButton = styled(Button)(({ theme }) => ({
  color: "inherit",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "1rem",
  position: "relative",
  padding: "8px 16px",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "0%",
    height: "2px",
    backgroundColor: "white",
    transition: "width 0.3s ease",
  },
  "&:hover::after": {
    width: "80%",
  },
}));

export function NavButton({ children, sx = {}, ...props }) {
  return (
    <StyledNavButton
      sx={sx}
      {...props}
    >
      {children}
    </StyledNavButton>
  );
}

// Nav Side Button Component (for Login/Get Started in navbar)
const StyledNavSideButton = styled(Button)(({ theme }) => ({
  borderColor: "rgba(255, 255, 255, 0.3)",
  color: "white",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: '8px',
  padding: "8px",
  transition: "all 0.3s ease",
  width: "130px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "white",
    transform: "translateY(-2px)",
  },
}));

export function NavSideButton({ children, sx = {}, ...props }) {
  return (
    <StyledNavSideButton
      variant="outlined"
      sx={sx}
      {...props}
    >
      {children}
    </StyledNavSideButton>
  );
}