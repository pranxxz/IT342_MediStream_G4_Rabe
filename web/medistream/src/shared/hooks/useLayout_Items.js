import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import { MdQueue } from 'react-icons/md';
import { FaUsers, FaUserMd, FaCalendarCheck, FaClipboardList } from 'react-icons/fa';

export const useLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Patient Queue", icon: <MdQueue size={22} />, path: "/PatientQueue" },
    { text: "Patients", icon: <FaUsers size={20} />, path: "/Patient" },
    { text: "Medical Staff", icon: <FaUserMd size={20} />, path: "/Staff" },
    { text: "Appointments", icon: <FaCalendarCheck size={20} />, path: "/Consultations" },
    { text: "Medical History", icon: <FaClipboardList size={20} />, path: "/PatientHistory" },
  ];

  return {
    mobileOpen,
    isMobile,
    menuItems,
    currentPath: location.pathname,
    handleDrawerToggle
  };
};