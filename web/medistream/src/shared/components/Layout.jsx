import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useLayout } from '../hooks/useLayout_Items';
import { Sidebar, COLORS } from './Sidebar';
import { MainContent } from './MainContent';

const Layout = () => {
  const { mobileOpen, handleDrawerToggle, isMobile, menuItems, currentPath } = useLayout();

  return (
    <Box sx={{
      display: 'flex',
      bgcolor: COLORS.primary,
      minHeight: '100vh',
      // overflow: 'hidden'  ← removed (no longer needed)
    }}>
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
        menuItems={menuItems}
        currentPath={currentPath}
      />

      {/* The outer wrapper now just holds MainContent – no extra overflow */}
      <Box sx={{
        flexGrow: 1,
        p: { xs: 0, sm: "20px 0 20px 0" },
        bgcolor: COLORS.primary,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <MainContent isMobile={isMobile}>
          <Outlet />
        </MainContent>
      </Box>
    </Box>
  );
};

export default Layout;