import React, { useState, useEffect } from 'react';
import { User, Shield, Home, Settings, Edit2 } from 'lucide-react';
import { Box, Button, Typography, Container, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  HeaderPaper,
  HeaderIcon,
  HeaderTitle,
  HeaderSubText,
  SettingsProfileView,
  SettingsPasswordView,
  SettingsEditModal
} from '../components';

const GeneralSettings = () => {
  const [currentView, setCurrentView] = useState('profile');
  const [availability, setAvailability] = useState('available');
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Starting user data fetch...');
        
        // Get user from localStorage (from login)
        const storedUser = localStorage.getItem('user') || 
                          sessionStorage.getItem('user') ||
                          localStorage.getItem('currentUser') ||
                          sessionStorage.getItem('currentUser');
        
        if (!storedUser) {
          console.log('No user found in storage, using empty data');
          setUserData(getEmptyUserData());
          return;
        }
        
        let parsedUser;
        try {
          parsedUser = JSON.parse(storedUser);
          // console.log('📋 User from storage:', parsedUser);
        } catch (e) {
          console.error('Failed to parse stored user:', e);
          setUserData(getEmptyUserData());
          return;
        }
        
        // Fetch medical staff data
        try {
          console.log('🔍 Fetching medical staff data...');
          const allStaffResponse = await fetch('http://localhost:8080/api/medicalstaff/all', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!allStaffResponse.ok) {
            throw new Error(`Failed to fetch medical staff: ${allStaffResponse.status}`);
          }
          
          const allStaff = await allStaffResponse.json();
          // console.log('✅ All medical staff:', allStaff);
          
          // Find medical staff for current user
          let medicalStaff = null;
          
          // Try to match by account ID
          if (parsedUser.accountID) {
            medicalStaff = allStaff.find(staff => 
              staff.userAccount && staff.userAccount.accountID === parseInt(parsedUser.accountID)
            );
          }
          
          // Try to match by username/email
          if (!medicalStaff && parsedUser.username) {
            medicalStaff = allStaff.find(staff => 
              staff.userAccount && staff.userAccount.username === parsedUser.username
            );
          }
          
          // Try to match by email (if stored as email)
          if (!medicalStaff && parsedUser.email) {
            medicalStaff = allStaff.find(staff => 
              staff.userAccount && staff.userAccount.username === parsedUser.email
            );
          }
          
          if (medicalStaff) {
            // console.log('✅ Found medical staff record:', medicalStaff);
            // // Log specific fields for debugging
            // console.log('Medical staff age:', medicalStaff.age);
            // console.log('Medical staff gender:', medicalStaff.gender);
            // console.log('Medical staff department:', medicalStaff.department);
            // console.log('Medical staff availability:', medicalStaff.availability);
            // console.log('Medical staff fields:', Object.keys(medicalStaff));
            
            // Set availability from medical staff data if available
            if (medicalStaff.availability) {
              setAvailability(medicalStaff.availability);
            }
          } else {
            console.log('⚠️ No medical staff record found for user');
          }
          
          // Map the data
          const mappedData = mapApiData(parsedUser, medicalStaff);
          // console.log('📝 Final mapped data:', mappedData);
          
          setUserData(mappedData);
          
          // Cache for future use
          // localStorage.setItem('currentUser', JSON.stringify(mappedData));
          if (medicalStaff) {
            // localStorage.setItem('medicalStaffData', JSON.stringify(medicalStaff));
          }
          
        } catch (staffError) {
          console.error('Error fetching medical staff:', staffError);
          // Use just the stored user data
          const mappedData = mapApiData(parsedUser, null);
          setUserData(mappedData);
          // localStorage.setItem('currentUser', JSON.stringify(mappedData));
        }
        
      } catch (error) {
        console.error('❌ Error in fetchUserData:', error);
        setError('Failed to load user data');
        setUserData(getEmptyUserData());
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Map API response to user data format
  const mapApiData = (storedUser, medicalStaffData) => {
    // console.log('🔧 Mapping data...');
    // console.log('Stored user:', storedUser);
    // console.log('Medical staff:', medicalStaffData);
    
    const getValue = (value, defaultValue = 'N/A') => {
      if (value === null || 
          value === undefined || 
          value === '' || 
          value === 'null' ||
          (typeof value === 'string' && value.trim() === '')) {
        return defaultValue;
      }
      return value;
    };
    
    // Start with stored user data
    let name = getValue(storedUser.name);
    let role = getValue(storedUser.role);
    let email = getValue(storedUser.email || storedUser.username);
    let accountID = getValue(storedUser.accountID);
    
    // Default values
    let specialization = 'N/A';
    let contactNo = 'N/A';
    let staffID = 'N/A';
    let department = 'General Medicine';
    let gender = 'N/A';
    let age = 'N/A';
    let availability = 'available'; // Default to 'available'
    
    // Override with medical staff data if available
    if (medicalStaffData) {
      console.log('Processing medical staff data...');
      
      // Name
      const staffName = getValue(medicalStaffData.name);
      if (staffName !== 'N/A') {
        name = staffName;
        // console.log('Name from medical staff:', name);
      }
      
      // Role (capitalize first letter)
      const staffRole = getValue(medicalStaffData.role);
      if (staffRole !== 'N/A') {
        role = staffRole.charAt(0).toUpperCase() + staffRole.slice(1);
        // console.log('Role from medical staff:', role);
      }
      
      // Specialty
      const staffSpecialty = getValue(medicalStaffData.specialty);
      if (staffSpecialty !== 'N/A') {
        specialization = staffSpecialty;
        // console.log('Specialty from medical staff:', specialization);
      }
      
      // Contact
      const staffContact = getValue(medicalStaffData.contactNo);
      if (staffContact !== 'N/A') {
        contactNo = staffContact;
        // console.log('Contact from medical staff:', contactNo);
      }
      
      // Staff ID
      staffID = getValue(medicalStaffData.staffID || medicalStaffData.id);
      // console.log('Staff ID:', staffID);
      
      // AGE
      const staffAge = getValue(medicalStaffData.age);
      if (staffAge !== 'N/A') {
        age = staffAge;
        // console.log('Age from medical staff:', age);
      }
      
      // GENDER
      const staffGender = getValue(medicalStaffData.gender);
      if (staffGender !== 'N/A') {
        gender = staffGender;
        // console.log('Gender from medical staff:', gender);
      }
      
      // DEPARTMENT
      const staffDepartment = getValue(medicalStaffData.department, 'General Medicine');
      if (staffDepartment !== 'N/A') {
        department = staffDepartment;
        // console.log('Department from medical staff:', department);
      }
      
      // AVAILABILITY
      const staffAvailability = getValue(medicalStaffData.availability, 'available');
      if (staffAvailability !== 'N/A') {
        availability = staffAvailability;
        // console.log('Availability from medical staff:', availability);
      }
      
      // Use user account data from relation if available
      if (medicalStaffData.userAccount) {
        // console.log('Medical staff has userAccount relation');
        
        if (!accountID || accountID === 'N/A') {
          accountID = getValue(medicalStaffData.userAccount.accountID);
          // console.log('Account ID from relation:', accountID);
        }
        
        if (!email || email === 'N/A') {
          email = getValue(medicalStaffData.userAccount.username);
          // console.log('Email from relation:', email);
        }
        
        if (!role || role === 'N/A') {
          const relationRole = getValue(medicalStaffData.userAccount.role);
          if (relationRole !== 'N/A') {
            role = relationRole.charAt(0).toUpperCase() + relationRole.slice(1);
            // console.log('Role from relation:', role);
          }
        }
      }
    }
    
    // If no name from medical staff, try to extract from email
    if ((!name || name === 'N/A') && email && email !== 'N/A') {
      const emailParts = email.split('@')[0];
      if (emailParts) {
        name = emailParts.split(/[._]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
        console.log('Name extracted from email:', name);
      }
    }
    
    const mappedData = {
      name: name,
      role: role,
      specialization: specialization,
      department: department,
      contactNo: contactNo,
      gender: gender,
      age: age,
      email: email,
      accountID: accountID,
      staffID: staffID,
      username: email,
      title: role,
      phone: contactNo,
      availability: availability, // Include availability
      hasMedicalStaffData: !!medicalStaffData,
      source: medicalStaffData ? 'Medical Staff Table' : 'User Storage'
    };
    
    // console.log('📋 Final mapped data structure:', mappedData);
    return mappedData;
  };

  // Get empty user data
  const getEmptyUserData = () => {
    return {
      name: 'N/A',
      role: 'N/A',
      specialization: 'N/A',
      department: 'General Medicine',
      contactNo: 'N/A',
      gender: 'N/A',
      age: 'N/A',
      email: 'N/A',
      accountID: 'N/A',
      staffID: 'N/A',
      username: 'N/A',
      title: 'N/A',
      phone: 'N/A',
      availability: 'available',
      hasMedicalStaffData: false,
      source: 'No Data'
    };
  };

  // Generate avatar initials
  const getAvatarInitials = (name) => {
    if (!name || name === 'N/A') return '?';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Update availability in database
  const updateAvailabilityInDatabase = async (newAvailability) => {
    try {
      if (!userData?.staffID || userData.staffID === 'N/A') {
        console.log('No staff ID found, cannot update availability in database');
        return;
      }

      console.log('Updating availability to:', newAvailability);
      
      const response = await fetch(`http://localhost:8080/api/medicalstaff/${userData.staffID}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability: newAvailability })
      });

      if (response.ok) {
        const updatedStaff = await response.json();
        console.log('✅ Availability updated in database:', updatedStaff);
        
        // Update local state
        const updatedUserData = { ...userData, availability: newAvailability };
        setUserData(updatedUserData);
        setAvailability(newAvailability);
        
        // Update localStorage
        // localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        // localStorage.setItem('medicalStaffData', JSON.stringify(updatedStaff));
        
        // Update staff list in localStorage if it exists
        updateStaffAvailabilityInLocalStorage(updatedStaff, newAvailability);
        
        // Dispatch event to notify other components
        dispatchStorageEvent();
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to update availability:', errorText);
      }
    } catch (error) {
      console.error('❌ Error updating availability:', error);
    }
  };

  // Helper to update staff list in localStorage
  const updateStaffAvailabilityInLocalStorage = (updatedStaff, newAvailability) => {
    try {
      const staffListStr = localStorage.getItem('staffList');
      if (staffListStr) {
        const staffList = JSON.parse(staffListStr);
        const updatedStaffList = staffList.map(staff => {
          if (staff.id === updatedStaff.id || 
              staff.staffID === updatedStaff.staffID ||
              (staff.userAccount && staff.userAccount.accountID === parseInt(userData.accountID))) {
            return { ...staff, availability: newAvailability };
          }
          return staff;
        });
        // localStorage.setItem('staffList', JSON.stringify(updatedStaffList));
        console.log('✅ Updated staff list availability in localStorage');
      }
    } catch (error) {
      console.error('Error updating staff list in localStorage:', error);
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'profile': return 'Personal Profile';
      case 'security': return 'Security Center';
      default: return 'Settings';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'profile': return 'Manage your personal information and preferences';
      case 'security': return 'Secure your account and data';
      default: return 'Customize your experience';
    }
  };

  const navigationItems = [
    { id: 'home', icon: <Home size={16} />, label: 'Home', color: '#374151' },
    { id: 'profile', icon: <User size={16} />, label: 'Profile', color: '#374151' },
    { id: 'security', icon: <Shield size={16} />, label: 'Security', color: '#374151' },
  ];

  const handleHomeClick = () => {
    navigate('/PatientQueue');
  };

  // Handle profile update
  const handleProfileUpdate = async (updatedData) => {
    setError(null);
    
    // 1. Validation: Check if we have a valid ID to update
    if (!userData?.staffID || userData.staffID === 'N/A') {
      console.error('⚠️ No valid staff ID found, cannot update database');
      setError("Cannot update profile: No valid Staff ID associated with this account.");
      return;
    }

    try {
      // console.log('🔄 Sending profile update to Backend:', updatedData);

      // 2. Prepare the payload for the Backend
      // Ensure we format the data exactly how the API expects it
      const backendPayload = {
        name: updatedData.name,
        role: updatedData.role ? updatedData.role.toLowerCase() : null, // Backend likely expects lowercase
        contactNo: updatedData.phone, // Map 'phone' from modal to 'contactNo' for DB
        specialty: updatedData.specialization, // Map 'specialization' to 'specialty'
        age: updatedData.age ? parseInt(updatedData.age) : null,
        gender: updatedData.gender || null,
        department: updatedData.department || 'General Medicine',
        availability: availability, // Keep existing availability
        // Important: Include the UserAccount relation if required by your entity Update DTO
        userAccount: { 
          accountID: parseInt(userData.accountID) 
        }
      };

      // 3. Perform the API Call
      const response = await fetch(`http://localhost:8080/api/medicalstaff/update/${userData.staffID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backendPayload)
      });

      // 4. Check for API Errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      // 5. Success! Get the updated object from the backend
      const updatedBackendData = await response.json();
      // console.log('✅ Backend update successful:', updatedBackendData);

      // 6. NOW update Local State (UI) using the data we sent + existing data
      const newData = { 
        ...userData, 
        ...updatedData,
        // Ensure we keep consistent casing for the UI
        role: updatedData.role || userData.role, 
        age: updatedData.age || userData.age,
        gender: updatedData.gender || userData.gender,
        department: updatedData.department || userData.department
      };

      setUserData(newData);

      // 7. Update Local Storage helpers
      // Note: We use updatedBackendData here to ensure we sync with what the DB actually has
      // updateStaffListInLocalStorage(updatedBackendData, newData);

      // 8. Close the modal
      setShowEditModal(false);

      // 9. Force refresh other components
      dispatchStorageEvent();

    } catch (error) {
      console.error('❌ Error in handleProfileUpdate:', error);
      setError(`Failed to save changes: ${error.message}`);
      // Do NOT update local state if backend failed
    }
  };
  // Helper function to update staff list in localStorage for staff.jsx
  const updateStaffListInLocalStorage = (updatedStaff, newUserData) => {
    try {
      // Get current staff list from localStorage
      const staffListStr = localStorage.getItem('staffList');
      
      if (staffListStr) {
        const staffList = JSON.parse(staffListStr);
        
        // Find and update the specific staff member
        const updatedStaffList = staffList.map(staff => {
          // Match by staff ID or other identifiers
          if (staff.id === updatedStaff.id || 
              staff.staffID === updatedStaff.id || 
              staff.staffID === updatedStaff.staffID ||
              (staff.userAccount && staff.userAccount.accountID === parseInt(newUserData.accountID))) {
            
            return {
              ...staff,
              name: newUserData.name,
              role: newUserData.role.toLowerCase(),
              specialty: newUserData.specialization,
              contactNo: newUserData.phone,
              age: newUserData.age,
              gender: newUserData.gender,
              department: newUserData.department,
              availability: availability, // Include availability
              // Keep other properties intact
            };
          }
          return staff;
        });
        
        // Save updated staff list back to localStorage
        // localStorage.setItem('staffList', JSON.stringify(updatedStaffList));
        console.log('✅ Updated staff list in localStorage');
        
        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event('storage'));
      } else {
        console.log('No staffList found in localStorage');
      }
    } catch (error) {
      console.error('Error updating staff list in localStorage:', error);
    }
  };

  // Helper function to dispatch storage event for other components
  const dispatchStorageEvent = () => {
    try {
      // Create and dispatch a storage event
      const event = new Event('storage');
      window.dispatchEvent(event);
      
      // Also dispatch a custom event for more specific handling
      const customEvent = new CustomEvent('userProfileUpdated', { 
        detail: { userData: userData }
      });
      window.dispatchEvent(customEvent);
      
      console.log('✅ Storage events dispatched');
    } catch (error) {
      console.error('Error dispatching storage event:', error);
    }
  };

  // Add event listener in useEffect to refresh when other components update data
  useEffect(() => {
    const handleUserProfileUpdated = (event) => {
      // console.log('User profile updated event received:', event.detail);
      // Optionally refresh data here
    };

    const handleStorageChange = () => {
      console.log('Storage changed, refreshing user data...');
      // Refresh user data from localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          // Update availability from stored data
          if (parsedUser.availability) {
            setAvailability(parsedUser.availability);
          }
        } catch (e) {
          console.error('Failed to parse stored user:', e);
        }
      }
    };

    window.addEventListener('userProfileUpdated', handleUserProfileUpdated);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('userProfileUpdated', handleUserProfileUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Main Header */}
      <HeaderPaper sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Container maxWidth="1400px">
          <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
            <Box display="flex" alignItems="center" gap={3}>
              <HeaderIcon sx={{ 
                background: '#4B0082',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Settings size={20} color="white" />
              </HeaderIcon>
              <Box>
                <HeaderTitle>Account Settings</HeaderTitle>
                <HeaderSubText>Manage your account preferences and security</HeaderSubText>
              </Box>
            </Box>

            {/* Top Navigation */}
            <Box display="flex" alignItems="center" gap={3}>
              <Box display="flex" gap={1}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => item.id === 'home' ? handleHomeClick() : setCurrentView(item.id)}
                    startIcon={item.icon}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      fontWeight: currentView === item.id ? 600 : 400,
                      color: currentView === item.id ? '#4B0082' : '#6b7280',
                      borderRadius: '8px',
                      px: 2,
                      py: 1,
                      '&:hover': {
                        background: currentView === item.id ? '#F3F0FF' : '#f9fafb',
                        color: currentView === item.id ? '#4B0082' : '#374151',
                      },
                      background: currentView === item.id ? '#F3F0FF' : 'transparent',
                      border: currentView === item.id ? '1px solid #E0D4FC' : '1px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderPaper>

      {/* Error Alert */}
      {error && (
        <Container maxWidth="1400px" sx={{ py: 2 }}>
          <Alert severity="error" sx={{ borderRadius: '8px' }}>
            {error}
          </Alert>
        </Container>
      )}

      {/* Page Title */}
      <Container maxWidth="1400px" sx={{ py: 4 }}>
        <Box sx={{ px: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            color: '#4B0082',
            fontSize: '1.5rem',
            mb: 0.5 
          }}>
            {getTitle()}
          </Typography>
            <Typography variant="body2" sx={{ 
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              {getSubtitle()}
              {userData?.hasMedicalStaffData && (
                <span style={{ marginLeft: '10px', color: '#4B0082', fontWeight: 'bold' }}>
                  ✓ Medical Staff Data Loaded
                </span>
              )}
            </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ px: 3 }}>
          {loading ? (
            <Box sx={{ 
              background: 'white', 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #e5e7eb',
              p: 4,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
              <CircularProgress size={40} />
              <Typography>Loading user data...</Typography>
            </Box>
          ) : currentView === 'profile' ? (
            <Box sx={{ 
              background: 'white', 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              {/* Profile Header */}
              <Box sx={{ 
                p: 3, 
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Avatar */}
                  <Box sx={{ 
                    width: 60, 
                    height: 60,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e5e7eb'
                  }}>
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData?.name || 'user')}`} 
                      alt="Profile" 
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'cover'
                      }} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = '#f3f4f6';
                        e.target.parentElement.style.display = 'flex';
                        e.target.parentElement.style.alignItems = 'center';
                        e.target.parentElement.style.justifyContent = 'center';
                        const initials = getAvatarInitials(userData?.name);
                        e.target.parentElement.innerHTML = 
                          `<div style="color: #6b7280; font-weight: bold; font-size: 18px;">${initials}</div>`;
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700, 
                      color: '#1f2937',
                      fontSize: '1.25rem',
                      lineHeight: 1.2
                    }}>
                      {userData?.name || 'N/A'}
                      {userData?.hasMedicalStaffData && (
                        <span style={{ 
                          marginLeft: '8px', 
                          fontSize: '12px', 
                          background: '#4B0082', // Purple theme
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          Medical Staff
                        </span>
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      mb: 0.5
                    }}>
                      {userData?.role || 'N/A'} • {userData?.department || 'General Medicine'}
                      {userData?.staffID && userData.staffID !== 'N/A' && (
                        <span style={{ 
                          marginLeft: '12px', 
                          fontSize: '12px', 
                          color: '#9ca3af' 
                        }}>
                          Staff ID: {userData.staffID}
                        </span>
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: availability === 'available' ? '#10b981' : 
                                   availability === 'busy' ? '#f59e0b' : '#6b7280'
                      }} />
                      <Typography variant="caption" sx={{ 
                        color: availability === 'available' ? '#10b981' : 
                               availability === 'busy' ? '#f59e0b' : '#6b7280',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase'
                      }}>
                        {availability === 'available' ? 'Available' : 
                         availability === 'busy' ? 'Busy' : 'Offline'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* Edit Profile Button */}
                <Button
                  onClick={() => setShowEditModal(true)}
                  startIcon={<Edit2 size={16} />}
                  sx={{
                    background: '#4B0082',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    px: 3,
                    py: 1,
                    boxShadow: '0 3px 10px rgba(75,0,130,0.25)',
                    textTransform: 'none',
                    height: '40px',
                    alignSelf: 'center',
                    '&:hover': {
                      background: '#3A0066',
                      boxShadow: '0 5px 15px rgba(75,0,130,0.3)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
              
              {/* Profile Information Section */}
              <Box sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600, 
                  color: '#4B0082',
                  fontSize: '1rem',
                  mb: 2
                }}>
                  PROFILE INFORMATION
                  <Typography variant="caption" sx={{ ml: 1, color: '#6b7280' }}>
                    ({userData?.source || 'Loading...'})
                  </Typography>
                </Typography>
                {userData ? (
                  <SettingsProfileView 
                    userData={userData} 
                    availability={availability} 
                    setAvailability={(newAvailability) => {
                      setAvailability(newAvailability);
                      updateAvailabilityInDatabase(newAvailability);
                    }} 
                  />
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>No profile information available</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ) : currentView === 'security' ? (
            <Box sx={{ 
              background: 'white', 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                p: 3, 
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb'
              }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600, 
                  color: '#4B0082',
                  fontSize: '1rem'
                }}>
                  SECURITY SETTINGS
                </Typography>
              </Box>
              <SettingsPasswordView />
            </Box>
          ) : null}
        </Box>
      </Container>

      {/* Edit Profile Modal */}
      {showEditModal && userData && (
        <SettingsEditModal
          userData={userData}
          close={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </Box>
  );
};

export default GeneralSettings;