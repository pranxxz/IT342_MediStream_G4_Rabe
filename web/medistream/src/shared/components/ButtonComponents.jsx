import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

// Gradient Button Component (Styled like the 4th image "New Search" button)
const StyledGradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #7a0017 0%, #44000d 100%)',
  color: "#fff",
  fontWeight: 700,
  textTransform: "none",
  padding: "10px 28px",
  borderRadius: '40px',
  fontSize: "0.95rem",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 6px 18px rgba(122, 0, 23, 0.25)",
  minWidth: "160px",
  letterSpacing: "0.3px",
  "&:hover": {
    background: "linear-gradient(135deg, #7a0017 0%, #44000d 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(122, 0, 23, 0.35)",
  },
  "&:disabled": {
    opacity: 0.6,
    color: "rgba(255, 255, 255, 0.8)",
  }
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
  color: "#44000d",
  fontWeight: 700,
  textTransform: "none",
  padding: "10px 28px",
  borderRadius: '40px',
  border: "2px solid #44000d",
  backgroundColor: "transparent",
  fontSize: "0.95rem",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  minWidth: "160px",
  letterSpacing: "0.3px",
  "&:hover": {
    backgroundColor: "rgba(68, 0, 13, 0.05)",
    borderColor: "#7a0017",
    color: "#7a0017",
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
  borderRadius: '40px',
  padding: "8px 24px",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  width: "130px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "white",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.15)",
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