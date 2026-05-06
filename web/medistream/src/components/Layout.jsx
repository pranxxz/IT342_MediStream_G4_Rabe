import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useLayout } from '../hooks/useLayout_Items';
import { Sidebar } from './Sidebar'; // Change this import
import { MainContent } from './MainContent';

const Layout = () => {
  const { mobileOpen, handleDrawerToggle, isMobile, menuItems, currentPath } = useLayout();

  const handleMenuItemClick = (item) => {
    console.log('Menu item clicked:', item);
    // You can add additional logic here if needed
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
        menuItems={menuItems}
        currentPath={currentPath}
        onItemClick={handleMenuItemClick}
      />
      
      <MainContent isMobile={isMobile}>
        <Outlet />
      </MainContent>
    </Box>
  );
};

export default Layout;