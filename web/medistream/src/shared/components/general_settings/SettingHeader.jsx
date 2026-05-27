import React from 'react';
import { ChevronLeft, User, Shield, Bell } from 'lucide-react';
import { Box, Typography, Button } from '@mui/material';

// Exact colors from your sidebar
const sidebarColors = {
  iconRailBg: '#4B0082',    // Main purple (icon rail background)
  navRailBg: '#4B0082',     // Main purple (nav rail background)
  activeBg: '#F3F4F6',      // Active background
  activeText: '#4B0082',    // Active text color (purple)
  inactiveText: '#E0D4FC',  // Inactive text color (light purple)
  white: '#FFFFFF',
  hover: 'rgba(255, 255, 255, 0.08)'
};

// Fonts from your sidebar
const fonts = {
  primary: '"Poppins", "Inter", sans-serif',
  secondary: '"Arimo", "Poppins", "Inter", sans-serif'
};

const SettingHeader = ({ currentView, showSidebar, toggleSidebar, setShowEditModal }) => {

  const getTitle = () => {
    switch (currentView) {
      case 'profile': return 'Personal Profile';
      case 'security': return 'Security Center';
      case 'professional': return 'Professional Details';
      default: return 'Settings';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'profile': return 'Manage your personal information and preferences';
      case 'security': return 'Secure your account and data';
      case 'professional': return 'Update your professional credentials';
      default: return 'Customize your experience';
    }
  };

  const getIcon = () => {
    switch (currentView) {
      case 'profile': return <User size={20} />;
      case 'security': return <Shield size={20} />;
      case 'professional': return <Bell size={20} />;
      default: return <User size={20} />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: sidebarColors.white,
        py: 2,
        px: 3,
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      {/* Left side */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {!showSidebar && (
          <Button
            onClick={toggleSidebar}
            sx={{
              minWidth: 0,
              width: 36,
              height: 36,
              borderRadius: 2,
              background: sidebarColors.iconRailBg,
              color: 'white',
              p: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                background: sidebarColors.iconRailBg,
                opacity: 0.9,
              }
            }}
          >
            <ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} />
          </Button>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: 'rgba(75,0,130,0.2)', // 20% opacity of #4B0082
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${sidebarColors.iconRailBg}33` // 20% opacity border
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: sidebarColors.iconRailBg
              }}
            >
              {getIcon()}
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.25rem',
                color: sidebarColors.activeText,
                fontFamily: fonts.primary,
                lineHeight: 1.2
              }}
            >
              {getTitle()}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: sidebarColors.inactiveText,
                mt: 0.5,
                fontFamily: fonts.secondary,
                fontWeight: 500,
                opacity: 0.8
              }}
            >
              {getSubtitle()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right side: Edit Profile Button */}
      {currentView === 'profile' && (
        <Button
          onClick={() => setShowEditModal(true)}
          sx={{
            background: sidebarColors.iconRailBg,
            color: sidebarColors.white,
            fontWeight: 700,
            fontSize: '0.85rem',
            borderRadius: '8px',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontFamily: fonts.secondary,
            '&:hover': {
              background: sidebarColors.iconRailBg,
              opacity: 0.9,
            },
            boxShadow: '0 2px 4px rgba(75,0,130,0.2)'
          }}
        >
          Edit Profile
        </Button>
      )}
    </Box>
  );
};

export default SettingHeader;