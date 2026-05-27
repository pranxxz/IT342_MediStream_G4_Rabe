import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import { MdQueue } from 'react-icons/md';
import { FaUsers, FaUserMd, FaCalendarCheck, FaClipboardList } from 'react-icons/fa';
import { useRole } from './useRole';

export const useLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { getCurrentRole } = useRole();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const allMenuItems = [
    { text: "Patient Queue", icon: <MdQueue size={22} />, path: "/PatientQueue", roles: ['nurse', 'staff', 'doctor', 'admin'] },
    { text: "Patients", icon: <FaUsers size={20} />, path: "/Patient", roles: ['nurse', 'staff', 'doctor', 'admin'] },
    { text: "Medical Staff", icon: <FaUserMd size={20} />, path: "/Staff", roles: ['nurse', 'staff', 'doctor', 'admin'] },
    { text: "Appointments", icon: <FaCalendarCheck size={20} />, path: "/Consultations", roles: ['doctor', 'admin'] },
    { text: "Medical History", icon: <FaClipboardList size={20} />, path: "/MedicalHistory", roles: ['nurse', 'staff', 'doctor', 'admin'] },
  ];

  const userRole = getCurrentRole();
  
  // Filter menu items based on user's role
  const menuItems = allMenuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return {
    mobileOpen,
    isMobile,
    menuItems,
    currentPath: location.pathname,
    handleDrawerToggle
  };
};