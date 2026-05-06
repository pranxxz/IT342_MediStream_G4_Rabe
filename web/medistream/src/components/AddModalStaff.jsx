// components/AddStaffModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import { Search, PersonAdd, Check, Warning, Block, Email } from '@mui/icons-material';

const AddStaffModal = ({ 
  open, 
  onClose, 
  onAddStaff, 
  autocompleteResults = [], 
  autocompleteLoading = false,
  onSearchExisting,
  existingStaff = [] // Pass existing staff list to check duplicates
}) => {
  const [staffEmail, setStaffEmail] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateStaff, setDuplicateStaff] = useState(null);

  // Check if staff email already exists in current staff list
  const checkDuplicate = (email) => {
    if (!email.trim()) {
      setIsDuplicate(false);
      setDuplicateStaff(null);
      return;
    }

    const emailLower = email.toLowerCase().trim();
    const existing = existingStaff.find(staff => 
      staff.email && staff.email.toLowerCase().trim() === emailLower
    );

    if (existing) {
      setIsDuplicate(true);
      setDuplicateStaff(existing);
    } else {
      setIsDuplicate(false);
      setDuplicateStaff(null);
    }
  };

  // Debounced search
  useEffect(() => {
    if (staffEmail.length > 2 && isValidEmail(staffEmail)) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        onSearchExisting(staffEmail);
        setShowResults(true);
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowResults(false);
      setSelectedStaff(null);
      setIsSearching(false);
    }
  }, [staffEmail, onSearchExisting]);

  useEffect(() => {
    checkDuplicate(staffEmail);
  }, [staffEmail, existingStaff]);

  // Simple email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setStaffEmail(value);
  };

  const handleSelectStaff = (staff) => {
    setSelectedStaff(staff);
    setStaffEmail(staff.email || '');
    setShowResults(false);
  };

  const handleSubmit = () => {
    if (isDuplicate) {
      // Cannot add duplicate staff
      return;
    }

    if (!isValidEmail(staffEmail)) {
      return;
    }

    if (selectedStaff) {
      // If staff exists in userAccount, add them to staff table
      onAddStaff({
        name: selectedStaff.name,
        email: selectedStaff.email,
        role: 'Doctor', // Default role, can be changed later
        accountId: selectedStaff.accountId
      });
    } else if (staffEmail.trim() && !isDuplicate && isValidEmail(staffEmail)) {
      // If new staff not in userAccount, add as new staff (name will be asked later or default to email username)
      const emailUsername = staffEmail.split('@')[0];
      const formattedName = emailUsername
        .split('.')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      onAddStaff({
        name: formattedName || staffEmail,
        email: staffEmail.trim(),
        role: 'Doctor' // Default role
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setStaffEmail('');
    setSelectedStaff(null);
    setShowResults(false);
    setIsSearching(false);
    setIsDuplicate(false);
    setDuplicateStaff(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4B0082' }}>
        <PersonAdd />
        Add Staff Member
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter the staff member's email address. The system will check if they already exist in the staff directory.
          </Typography>
          
          <TextField
            fullWidth
            label="Staff Email Address"
            type="email"
            value={staffEmail}
            onChange={handleEmailChange}
            placeholder="e.g., john.smith@hospital.com"
            autoFocus
            sx={{ mb: 3 }}
            error={isDuplicate || (staffEmail && !isValidEmail(staffEmail))}
            helperText={
              isDuplicate 
                ? "This email is already registered in the system" 
                : staffEmail && !isValidEmail(staffEmail) 
                  ? "Please enter a valid email address"
                  : ""
            }
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: isDuplicate ? '#ef4444' : 'action.active' }} />
            }}
          />

          {isDuplicate && duplicateStaff && (
            <Alert 
              severity="error" 
              icon={<Block />}
              sx={{ mt: 2, mb: 2 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {duplicateStaff.email} is already registered!
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                Staff Name: {duplicateStaff.name} • Role: {duplicateStaff.role}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                Cannot add duplicate email address.
              </Typography>
            </Alert>
          )}

          {isSearching && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Searching by email...
              </Typography>
            </Box>
          )}

          {showResults && autocompleteResults.length > 0 && !selectedStaff && !isDuplicate && (
            <Box sx={{ mt: 2, border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
                  Users Found by Email
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Select a user to add as staff member
                </Typography>
              </Box>
              <List>
                {autocompleteResults.map((staff, index) => (
                  <React.Fragment key={staff.id || staff.accountId}>
                    <ListItem 
                      button 
                      onClick={() => handleSelectStaff(staff)}
                      sx={{
                        '&:hover': { bgcolor: '#f9fafb' },
                        py: 2
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#4B0082' }}>
                          {staff.name ? staff.name.split(' ').map(n => n[0]).join('') : 
                           staff.email ? staff.email.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {staff.name || staff.email}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                            {staff.email && (
                              <Chip 
                                label={staff.email} 
                                size="small" 
                                sx={{ 
                                  bgcolor: '#f3f4f6', 
                                  color: '#4B5563',
                                  fontSize: '0.75rem'
                                }}
                              />
                            )}
                            {staff.name && (
                              <Chip 
                                label="Name Available" 
                                size="small" 
                                sx={{ 
                                  bgcolor: '#e8f5e9', 
                                  color: '#2e7d32',
                                  fontSize: '0.75rem'
                                }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < autocompleteResults.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}

          {showResults && autocompleteResults.length === 0 && staffEmail.length > 2 && !isSearching && !isDuplicate && isValidEmail(staffEmail) && (
            <Alert 
              severity="info" 
              icon={<Warning />}
              sx={{ mt: 2 }}
            >
              <Typography variant="body2">
                No user found with email "{staffEmail}" in the database.
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                You can add them as a new staff member.
              </Typography>
            </Alert>
          )}

          {selectedStaff && !isDuplicate && (
            <Alert 
              severity="success" 
              icon={<Check />}
              sx={{ mt: 2 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {selectedStaff.email} found in database!
              </Typography>
              {selectedStaff.name && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  Name: {selectedStaff.name}
                </Typography>
              )}
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                Ready to add as staff member. Click "Add Staff" to confirm.
              </Typography>
            </Alert>
          )}

          {staffEmail && !isDuplicate && !selectedStaff && isValidEmail(staffEmail) && (
            <Alert 
              severity="info" 
              icon={<PersonAdd />}
              sx={{ mt: 2 }}
            >
              <Typography variant="body2">
                Will add as new staff member
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                Email: {staffEmail}
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!staffEmail.trim() || isDuplicate || !isValidEmail(staffEmail)}
          startIcon={<PersonAdd />}
          sx={{
            background: isDuplicate ? '#ef4444' : '#4B0082',
            '&:hover': { 
              background: isDuplicate ? '#dc2626' : '#3a0069' 
            },
            '&.Mui-disabled': {
              background: isDuplicate ? '#fca5a5' : '#9ca3af'
            }
          }}
        >
          {isDuplicate ? 'Email Already Exists' : selectedStaff ? 'Add Selected Staff' : 'Add New Staff'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStaffModal;