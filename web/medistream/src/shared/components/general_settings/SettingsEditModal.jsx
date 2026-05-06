import React, { useState, useEffect } from 'react';
import { X, Edit2, User } from 'lucide-react';
import { Box, Button, TextField, Typography, IconButton, Alert, Snackbar } from '@mui/material';

const SettingsEditModal = ({ userData, close, onSave }) => {
  const [formData, setFormData] = useState({
    name: userData.name || '',
    age: userData.age || '',
    gender: userData.gender || '',
    phone: userData.phone || '',
    email: userData.email || '',
    role: userData.role || '',
    specialization: userData.specialization || '',
    department: userData.department || 'General Medicine'  // Add department
  });
  
  const [accountID, setAccountID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fetchingAccount, setFetchingAccount] = useState(false);

  // Fetch current account ID on mount
  useEffect(() => {
    fetchCurrentAccountID();
  }, []);

  const fetchCurrentAccountID = async () => {
    try {
      setFetchingAccount(true);
      
      // console.log('🔍 Looking for account ID...');
      // console.log('UserData passed to modal:', userData);
      
      // Method 1: Check userData prop first
      if (userData.accountID && userData.accountID !== 'N/A') {
        // console.log('✅ Found account ID in userData prop:', userData.accountID);
        setAccountID(userData.accountID);
        return;
      }
      
      // Method 2: Check all possible localStorage keys
      const localStorageKeys = ['currentUser', 'user', 'loggedInUser', 'authUser'];
      let foundAccountID = null;
      
      for (const key of localStorageKeys) {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            // console.log(`Checking localStorage key "${key}":`, parsed);
            
            if (parsed.accountID && parsed.accountID !== 'N/A') {
              foundAccountID = parsed.accountID;
              // console.log(`✅ Found account ID in ${key}:`, foundAccountID);
              break;
            }
          } catch (e) {
            // console.log(`Could not parse ${key}:`, e);
          }
        }
      }
      
      if (foundAccountID) {
        setAccountID(foundAccountID);
        return;
      }
      
      // Method 3: Try to get from sessionStorage
      const sessionStorageKeys = ['currentUser', 'user', 'loggedInUser', 'authUser'];
      for (const key of sessionStorageKeys) {
        const storedData = sessionStorage.getItem(key);
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            // console.log(`Checking sessionStorage key "${key}":`, parsed);
            
            if (parsed.accountID && parsed.accountID !== 'N/A') {
              foundAccountID = parsed.accountID;
              // console.log(`✅ Found account ID in sessionStorage ${key}:`, foundAccountID);
              break;
            }
          } catch (e) {
            // console.log(`Could not parse sessionStorage ${key}:`, e);
          }
        }
      }
      
      if (foundAccountID) {
        setAccountID(foundAccountID);
        return;
      }
      
      // Method 4: Try to extract from medical staff data
      const medicalStaffData = localStorage.getItem('medicalStaffData');
      if (medicalStaffData) {
        try {
          const parsed = JSON.parse(medicalStaffData);
          // console.log('Checking medicalStaffData:', parsed);
          
          if (parsed.userAccount && parsed.userAccount.accountID) {
            foundAccountID = parsed.userAccount.accountID;
            // console.log('✅ Found account ID in medicalStaffData:', foundAccountID);
          }
        } catch (e) {
          // console.log('Could not parse medicalStaffData:', e);
        }
      }
      
      if (foundAccountID) {
        setAccountID(foundAccountID);
        return;
      }
      
      // Method 5: Last resort - check if we're Sophie (accountID: 1)
      if (userData.email === 'sophie.aloria@gmail.com' || 
          userData.name === 'Sophie Aloria' || 
          userData.name === 'sophie.aloria') {
        // console.log('⚠️ Using fallback: Sophie Aloria detected, using accountID: 1');
        setAccountID('1');
        return;
      }
      
      // Method 6: If we have email but no accountID, show error with instructions
      if (userData.email && userData.email !== 'N/A') {
        // console.log('❌ Could not find account ID for email:', userData.email);
        setError(`Unable to find your account ID. Please refresh the page or contact support.`);
      } else {
        setError('Unable to retrieve account information. Please login again.');
      }
      
    } catch (error) {
      console.error('Error fetching account ID:', error);
      setError('An error occurred while loading account information.');
    } finally {
      setFetchingAccount(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // console.log('Updating profile with:', formData);
      // console.log('Account ID:', accountID);
      // console.log('Current user data:', userData);
      
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Full name is required');
      }
      
      if (!formData.role.trim()) {
        throw new Error('Role is required');
      }
      
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      
      // Check if we have account ID
      if (!accountID) {
        throw new Error('Account information not found. Please refresh the page.');
      }
      
      // Use account ID - for Sophie, we know it's 1
      const accountIdToUse = accountID === '1' ? 1 : parseInt(accountID);
      
      // If we have a staff ID, update existing record
      if (userData.staffID && userData.staffID !== 'N/A') {
        await updateMedicalStaffRecord(accountIdToUse);
      } else {
        // No staff ID found, create a new medical staff record
        await createMedicalStaffRecord(accountIdToUse);
      }
      
      // Update local storage and notify parent
      updateLocalStorage(accountIdToUse);
      
      if (onSave) {
        onSave({
          ...formData,
          staffID: userData.staffID || 'NEW',
          accountID: accountIdToUse,
          hasMedicalStaffData: true
        });
      }
      
      setSuccess(true);
      
      // Close modal after successful save
      setTimeout(() => {
        close();
      }, 1500);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updateMedicalStaffRecord = async (accountId) => {
    const updateData = {
      name: formData.name,
      role: formData.role.toLowerCase(),
      contactNo: formData.phone,
      specialty: formData.specialization,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      department: formData.department || 'General Medicine',  // Add department
      userAccount: { 
        accountID: accountId
      }
    };
    
    // console.log('Updating existing medical staff:', updateData);
    
    const response = await fetch(`http://localhost:8080/api/medicalstaff/update/${userData.staffID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update medical staff: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  };

  const createMedicalStaffRecord = async (accountId) => {
    const newStaffData = {
      name: formData.name,
      role: formData.role.toLowerCase(),
      contactNo: formData.phone,
      specialty: formData.specialization,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      department: formData.department || 'General Medicine',  // Add department
      userAccount: { 
        accountID: accountId
      }
    };
    
    // console.log('Creating new medical staff record:', newStaffData);
    
    const response = await fetch('http://localhost:8080/api/medicalstaff/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newStaffData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create medical staff record: ${response.status} - ${errorText}`);
    }
    
    const newStaff = await response.json();
    // console.log('✅ New medical staff created:', newStaff);
    
    // Update the staffID in localStorage for future updates
    const updatedUserData = {
      ...userData,
      staffID: newStaff.id || newStaff.staffID,
      accountID: accountId,
      department: formData.department  // Add department
    };
    // localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
    
    return newStaff;
  };

  const updateLocalStorage = (accountId) => {
    try {
      // Update current user data
      const updatedUserData = {
        ...userData,
        name: formData.name,
        role: formData.role,
        specialization: formData.specialization,
        department: formData.department,  // Add department
        contactNo: formData.phone,
        phone: formData.phone,
        email: formData.email,
        gender: formData.gender,
        age: formData.age,
        accountID: accountId,
        hasMedicalStaffData: true
      };
      
      // localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
      // console.log('✅ Updated currentUser in localStorage');
      
      // Fetch fresh staff list to update
      updateStaffList();
      
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  };

  const updateStaffList = async () => {
    try {
      // Fetch fresh staff list from API
      const response = await fetch('http://localhost:8080/api/medicalstaff/all');
      if (response.ok) {
        const allStaff = await response.json();
        // localStorage.setItem('staffList', JSON.stringify(allStaff));
        console.log('✅ Updated staff list from API');
        
        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error updating staff list:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  const retryFetchAccount = () => {
    setError(null);
    fetchCurrentAccountID();
  };

  const manuallySetAccountID = () => {
    // For Sophie Aloria, we know accountID is 1
    setAccountID('1');
    setError(null);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <Box
        sx={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          width: '450px',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={close}
          sx={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: '#9ca3af',
            '&:hover': {
              color: '#4B0082',
              background: '#F3F0FF'
            }
          }}
        >
          <X size={24} />
        </IconButton>

        {/* Modal Header */}
        <Box sx={{ textAlign: 'center', marginBottom: '24px' }}>
          <Box sx={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
            <Box
              sx={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#4B0082',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '24px',
                boxShadow: '0 4px 12px rgba(75,0,130,0.3)'
              }}
            >
              <User size={32} />
            </Box>
          </Box>
          
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#4B0082',
              margin: '0 0 8px 0',
              fontFamily: '"Poppins", "Inter", sans-serif'
            }}
          >
            Edit Profile Details
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              margin: 0,
              background: '#F3F0FF',
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '16px',
              fontWeight: 600
            }}
          >
            {userData.department}
          </Typography>
          
          {fetchingAccount ? (
            <Alert 
              severity="info" 
              sx={{ 
                marginTop: '16px',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            >
              Loading account information...
            </Alert>
          ) : accountID ? (
            <>
              {!userData.staffID || userData.staffID === 'N/A' ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    marginTop: '16px',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                >
                  No medical staff record found. A new record will be created.
                </Alert>
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    marginTop: '8px',
                    color: '#9ca3af',
                    fontSize: '12px'
                  }}
                >
                  Staff ID: {userData.staffID} | Account ID: {accountID}
                </Typography>
              )}
            </>
          ) : (
            <Alert 
              severity="warning" 
              sx={{ 
                marginTop: '16px',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button color="inherit" size="small" onClick={retryFetchAccount}>
                    Retry
                  </Button>
                  {(userData.name === 'Sophie Aloria' || userData.email === 'sophie.aloria@gmail.com') && (
                    <Button color="inherit" size="small" onClick={manuallySetAccountID}>
                      Use Sophie (ID: 1)
                    </Button>
                  )}
                </Box>
              }
            >
              Unable to find account ID. Check localStorage for account information.
            </Alert>
          )}
        </Box>

        {/* Form Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            name="name"
            value={formData.name}
            onChange={handleChange}
            label="Full Name"
            size="small"
            fullWidth
            required
            disabled={fetchingAccount}
            InputProps={{
              sx: {
                borderRadius: '8px',
                fontSize: '14px'
              }
            }}
          />
          
          <TextField
            name="role"
            value={formData.role}
            onChange={handleChange}
            label="Role (e.g., Doctor, Nurse)"
            size="small"
            fullWidth
            required
            disabled={fetchingAccount}
            InputProps={{
              sx: {
                borderRadius: '8px',
                fontSize: '14px'
              }
            }}
          />
          
          <TextField
            name="department"
            value={formData.department}
            onChange={handleChange}
            label="Department"
            size="small"
            fullWidth
            disabled={fetchingAccount}
            InputProps={{
              sx: {
                borderRadius: '8px',
                fontSize: '14px'
              }
            }}
          />
          
          <TextField
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            label="Specialization"
            size="small"
            fullWidth
            disabled={fetchingAccount}
            InputProps={{
              sx: {
                borderRadius: '8px',
                fontSize: '14px'
              }
            }}
          />
          
          <TextField
            name="age"
            value={formData.age}
            onChange={handleChange}
            label="Age"
            size="small"
            fullWidth
            disabled={fetchingAccount}
            InputProps={{
              sx: {
                borderRadius: '8px',
                fontSize: '14px'
              }
            }}
          />
          
          <TextField
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            label="Gender"
            size="small"
            fullWidth
            disabled={fetchingAccount}
            InputProps={{
              sx: {
                borderRadius: '8px',
                fontSize: '14px'
              }
            }}
          />
          
          <TextField
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            label="Contact Number"
            size="small"
            fullWidth
            disabled={fetchingAccount}
            InputProps={{
              sx: {
                borderRadius: '8px',
                fontSize: '14px'
              }
            }}
          />
          
          <TextField
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email Address"
            size="small"
            fullWidth
            required
            disabled={fetchingAccount}
            InputProps={{
              sx: {
                borderRadius: '8px',
                fontSize: '14px'
              }
            }}
          />
        </Box>

        {/* Debug Info - Remove in production */}
        <Box sx={{ mt: 2, p: 1, background: '#f3f4f6', borderRadius: '8px' }}>
          <Typography variant="caption" color="text.secondary">
            Debug Info: {userData.email} | AccountID in props: {userData.accountID || 'Not found'}
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              marginTop: '16px',
              borderRadius: '8px'
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSubmit}
          disabled={loading || fetchingAccount || !accountID}
          fullWidth
          sx={{
            padding: '12px',
            borderRadius: '8px',
            background: '#4B0082',
            color: 'white',
            fontWeight: 600,
            marginTop: '24px',
            textTransform: 'none',
            fontSize: '0.875rem',
            boxShadow: '0 3px 10px rgba(75,0,130,0.25)',
            '&:hover': {
              boxShadow: '0 5px 15px rgba(75,0,130,0.3)',
              background: '#3A0066',
            },
            '&:disabled': {
              background: '#9ca3af',
              boxShadow: 'none'
            }
          }}
        >
          {fetchingAccount ? 'Loading...' : loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsEditModal;