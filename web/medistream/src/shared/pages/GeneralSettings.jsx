import React, { useState, useEffect, useRef } from 'react';
import { User, Edit2, Phone, Mail, Calendar, Users, Briefcase, Building2, BadgeCheck, Lock, Eye, EyeOff, Camera, Check, X } from 'lucide-react';
import { Box, Button, Typography, Container, CircularProgress, Alert, Snackbar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation } from 'react-router-dom';
import SettingsEditModal from '../components/general_settings/SettingsEditModal';
import PageHeader from '../components/PageHeader';
import { COLORS } from '../components/Sidebar';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';

const M = COLORS.primary;
const M_LIGHT = '#7a0017';

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: 2,
    py: 1.5, px: 2,
    borderRadius: '10px',
    '&:hover': { background: '#f9fafb' },
    transition: 'background 0.15s',
  }}>
    <Box sx={{
      width: 34, height: 34, borderRadius: '8px',
      background: `${M}12`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={15} color={M} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', mb: '1px' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value || '—'}
      </Typography>
    </Box>
  </Box>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    pb: 2, mb: 3,
    borderBottom: '1px solid #f3f4f6',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{
        width: 36, height: 36, borderRadius: '10px',
        background: `linear-gradient(135deg, ${M} 0%, ${M_LIGHT} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={17} color="white" />
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', letterSpacing: '-0.2px' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: '1px' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
    {action}
  </Box>
);

// ─── Compact Availability Selector ────────────────────────────────────────────
const AvailabilitySelector = ({ availability, setAvailability, updating }) => {
  const options = [
    { value: 'available', label: 'Available', color: '#10b981', bg: '#d1fae5' },
    { value: 'busy', label: 'Busy', color: '#f59e0b', bg: '#fef3c7' },
    { value: 'offline', label: 'Offline', color: '#6b7280', bg: '#f3f4f6' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {options.map(opt => (
        <Button
          key={opt.value}
          onClick={() => setAvailability(opt.value)}
          disabled={updating}
          sx={{
            flex: '1 1 auto',
            minWidth: '100px',
            borderRadius: '12px',
            py: 1.5,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: '1px solid',
            borderColor: availability === opt.value ? opt.color : '#e5e7eb',
            background: availability === opt.value ? `${opt.bg}` : 'white',
            color: availability === opt.value ? opt.color : '#4b5563',
            '&:hover': {
              background: availability === opt.value ? opt.bg : '#f9fafb',
              borderColor: opt.color,
            },
            transition: 'all 0.15s',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: opt.color }} />
            {opt.label}
          </Box>
        </Button>
      ))}
    </Box>
  );
};

// ─── Password Change Form (fixed overlapping + right-aligned button) ──────────
const ChangePasswordForm = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!storedUser) throw new Error('No user session found');
      const user = JSON.parse(storedUser);
      const response = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username || user.email,
          oldPassword,
          newPassword,
        }),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to change password');
      }
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Old Password */}
        <Box>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', mb: 0.5 }}>
            Current Password
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <input
              type={showOld ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 40px 10px 14px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',  // prevent overflow
              }}
              onFocus={(e) => e.target.style.borderColor = M}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {showOld ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
            </button>
          </Box>
        </Box>

        {/* New Password */}
        <Box>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', mb: 0.5 }}>
            New Password
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 40px 10px 14px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = M}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showNew ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
            </button>
          </Box>
        </Box>

        {/* Confirm Password */}
        <Box>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', mb: 0.5 }}>
            Confirm New Password
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 40px 10px 14px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = M}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showConfirm ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
            </button>
          </Box>
        </Box>

        {message.text && (
          <Alert severity={message.type} sx={{ borderRadius: '10px', fontSize: '0.75rem' }}>
            {message.text}
          </Alert>
        )}

        {/* Button aligned to the right, not full width */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            disabled={loading}
            sx={{
              background: M,
              color: 'white',
              fontWeight: 700,
              borderRadius: '10px',
              px: 3,
              py: 1.2,
              textTransform: 'none',
              minWidth: '140px',
              '&:hover': { background: M_LIGHT },
            }}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const GeneralSettings = () => {
  const [availability, setAvailability] = useState('available');
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const location = useLocation();

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only JPEG, PNG, and WEBP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.');
      return;
    }

    setUploadError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userData?.accountID) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/${userData.accountID}/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = response.data;
      const relativePath = data.path;
      
      const updatedUser = { ...userData, profilePicturePath: relativePath };
      setUserData(updatedUser);
      setAvatarTimestamp(Date.now());

      const sessionKeys = ['user', 'currentUser'];
      sessionKeys.forEach(key => {
        const storedStr = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (storedStr) {
          try {
            const parsed = JSON.parse(storedStr);
            parsed.profilePicturePath = relativePath;
            parsed.profilePictureUrl = `/api/users/${userData.accountID}/profile-picture`;
            localStorage.setItem(key, JSON.stringify(parsed));
            sessionStorage.setItem(key, JSON.stringify(parsed));
          } catch (e) {
            console.error('Failed to update storage key', key, e);
          }
        }
      });

      setUploadSuccess('Profile picture updated successfully!');
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      dispatchStorageEvent();

    } catch (err) {
      console.error('Upload failed', err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to upload profile picture.';
      setUploadError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setUploadError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // ── Data Fetching (unchanged) ───────────────────────────────────────────────
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const storedUser = localStorage.getItem('user') ||
          sessionStorage.getItem('user') ||
          localStorage.getItem('currentUser') ||
          sessionStorage.getItem('currentUser');
        if (!storedUser) { setUserData(getEmptyUserData()); return; }
        let parsedUser;
        try { parsedUser = JSON.parse(storedUser); } catch { setUserData(getEmptyUserData()); return; }
        try {
          const allStaffResponse = await fetch('http://localhost:8080/api/medicalstaff/all', {
            method: 'GET', headers: { 'Content-Type': 'application/json' }
          });
          if (!allStaffResponse.ok) throw new Error(`Failed to fetch medical staff: ${allStaffResponse.status}`);
          const allStaff = await allStaffResponse.json();
          let medicalStaff = null;
          if (parsedUser.staffID) medicalStaff = allStaff.find(s => s.id === parseInt(parsedUser.staffID) || s.staffID === parseInt(parsedUser.staffID));
          if (!medicalStaff && parsedUser.accountID) medicalStaff = allStaff.find(s => s.userAccount && s.userAccount.accountID === parseInt(parsedUser.accountID));
          if (!medicalStaff && parsedUser.username) medicalStaff = allStaff.find(s => s.userAccount && s.userAccount.username === parsedUser.username);
          if (!medicalStaff && parsedUser.email) medicalStaff = allStaff.find(s => s.userAccount && s.userAccount.username === parsedUser.email);
          if (medicalStaff?.availability) setAvailability(medicalStaff.availability);
          setUserData(mapApiData(parsedUser, medicalStaff));
        } catch {
          setUserData(mapApiData(parsedUser, null));
        }
      } catch {
        setError('Failed to load user data');
        setUserData(getEmptyUserData());
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const mapApiData = (storedUser, medicalStaffData) => {
    const getValue = (value, defaultValue = 'N/A') => {
      if (value === null || value === undefined || value === '' || value === 'null' || (typeof value === 'string' && value.trim() === '')) return defaultValue;
      return value;
    };
    let name = getValue(storedUser.name), role = getValue(storedUser.role), email = getValue(storedUser.email || storedUser.username), accountID = getValue(storedUser.accountID || storedUser.id);
    let profilePicturePath = storedUser.profilePicturePath || null;
    let specialization = 'N/A', contactNo = 'N/A', staffID = 'N/A', department = 'General Medicine', gender = 'N/A', age = 'N/A', availability = 'available';
    if (medicalStaffData) {
      const sv = (v) => getValue(v);
      if (sv(medicalStaffData.name) !== 'N/A') name = sv(medicalStaffData.name);
      if (sv(medicalStaffData.role) !== 'N/A') role = sv(medicalStaffData.role).charAt(0).toUpperCase() + sv(medicalStaffData.role).slice(1);
      if (sv(medicalStaffData.specialty) !== 'N/A') specialization = sv(medicalStaffData.specialty);
      if (sv(medicalStaffData.contactNo) !== 'N/A') contactNo = sv(medicalStaffData.contactNo);
      staffID = sv(medicalStaffData.staffID || medicalStaffData.id);
      if (sv(medicalStaffData.age) !== 'N/A') age = sv(medicalStaffData.age);
      if (sv(medicalStaffData.gender) !== 'N/A') gender = sv(medicalStaffData.gender);
      if (sv(medicalStaffData.department, 'General Medicine') !== 'N/A') department = sv(medicalStaffData.department, 'General Medicine');
      if (sv(medicalStaffData.availability, 'available') !== 'N/A') availability = sv(medicalStaffData.availability, 'available');
      if (medicalStaffData.userAccount) {
        if (!accountID || accountID === 'N/A') accountID = getValue(medicalStaffData.userAccount.accountID);
        if (!email || email === 'N/A') email = getValue(medicalStaffData.userAccount.username);
        if (medicalStaffData.userAccount.profilePicturePath) {
          profilePicturePath = medicalStaffData.userAccount.profilePicturePath;
        }
        if (!role || role === 'N/A') {
          const r = getValue(medicalStaffData.userAccount.role);
          if (r !== 'N/A') role = r.charAt(0).toUpperCase() + r.slice(1);
        }
      }
    }
    if ((!name || name === 'N/A') && email && email !== 'N/A') {
      name = email.split('@')[0].split(/[._]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    return { name, role, specialization, department, contactNo, gender, age, email, accountID, staffID, username: email, title: role, phone: contactNo, availability, hasMedicalStaffData: !!medicalStaffData, source: medicalStaffData ? 'Medical Staff Table' : 'User Storage', profilePicturePath };
  };

  const getEmptyUserData = () => ({
    name: 'N/A', role: 'N/A', specialization: 'N/A', department: 'General Medicine',
    contactNo: 'N/A', gender: 'N/A', age: 'N/A', email: 'N/A', accountID: 'N/A',
    staffID: 'N/A', username: 'N/A', title: 'N/A', phone: 'N/A', availability: 'available',
    hasMedicalStaffData: false, source: 'No Data', profilePicturePath: null
  });

  const getAvatarInitials = (name) => {
    if (!name || name === 'N/A') return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const updateAvailabilityInDatabase = async (newAvailability) => {
    try {
      if (!userData?.staffID || userData.staffID === 'N/A') return;
      setUpdatingAvailability(true);
      const response = await fetch(`http://localhost:8080/api/medicalstaff/${userData.staffID}/availability`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: newAvailability })
      });
      if (response.ok) {
        setUserData({ ...userData, availability: newAvailability });
        setAvailability(newAvailability);
        dispatchStorageEvent();
      }
    } catch (err) { console.error(err); }
    finally { setUpdatingAvailability(false); }
  };

  const handleProfileUpdate = async (updatedData) => {
    setError(null);
    if (!userData?.staffID || userData.staffID === 'N/A') { setError("Cannot update profile: No valid Staff ID."); return; }
    try {
      const backendPayload = {
        name: updatedData.name, role: updatedData.role?.toLowerCase() || null,
        contactNo: updatedData.phone, specialty: updatedData.specialization,
        age: updatedData.age ? parseInt(updatedData.age) : null,
        gender: updatedData.gender || null, department: updatedData.department || 'General Medicine',
        availability, userAccount: { accountID: parseInt(userData.accountID) }
      };
      const response = await fetch(`http://localhost:8080/api/medicalstaff/update/${userData.staffID}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(backendPayload)
      });
      if (!response.ok) { const t = await response.text(); throw new Error(`Server responded with ${response.status}: ${t}`); }
      const newData = { ...userData, ...updatedData, role: updatedData.role || userData.role, age: updatedData.age || userData.age, gender: updatedData.gender || userData.gender, department: updatedData.department || userData.department };
      setUserData(newData);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const currentUser = JSON.parse(userStr);
        currentUser.name = newData.name; currentUser.role = newData.role;
        if (!currentUser.medicalStaff) currentUser.medicalStaff = {};
        currentUser.medicalStaff.name = newData.name; currentUser.medicalStaff.role = newData.role;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
      setShowEditModal(false);
      dispatchStorageEvent();
    } catch (err) { setError(`Failed to save changes: ${err.message}`); }
  };

  const dispatchStorageEvent = () => {
    try {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { userData } }));
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const p = JSON.parse(storedUser);
          setUserData(p);
          if (p.availability) setAvailability(p.availability);
        } catch { }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (location.state?.showUpdateSnackbar) {
      setShowSnackbar(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: '100vh', background: COLORS.bg, pb: 6 }}>

      <PageHeader
        title="Settings"
        subtitle="Manage your account preferences and security"
        icon={SettingsIcon}
      />

      {error && (
        <Container maxWidth="lg" sx={{ pt: 2 }}>
          <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>
        </Container>
      )}

      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        {loading ? (
          <Box sx={{
            background: 'white', borderRadius: '16px',
            border: '1px solid #e5e7eb',
            p: 6, textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <CircularProgress size={36} sx={{ color: M }} />
            <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>Loading your profile...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* ── HERO IDENTITY CARD (with MUI icon) ──────────────────────────── */}
            <Box sx={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(68,0,13,0.04)',
            }}>
              <Box sx={{ height: 4, background: `linear-gradient(90deg, ${M} 0%, ${M_LIGHT} 100%)` }} />
              <Box sx={{
                p: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 2,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  {/* Interactive Premium Avatar Upload */}
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      onClick={() => !uploading && fileInputRef.current?.click()}
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '16px',
                        border: `2px solid ${M}25`,
                        background: '#f9fafb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(68,0,13,0.06)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: uploading ? 'none' : 'scale(1.03)',
                          boxShadow: '0 6px 16px rgba(68,0,13,0.12)',
                          '& .avatar-overlay': { opacity: 1 },
                        },
                      }}
                    >
                      {previewUrl || (userData?.profilePicturePath ? `http://localhost:8080/api/users/${userData.accountID}/profile-picture?t=${avatarTimestamp}` : null) ? (
                        <img
                          src={previewUrl || (userData?.profilePicturePath ? `http://localhost:8080/api/users/${userData.accountID}/profile-picture?t=${avatarTimestamp}` : null)}
                          alt="Profile"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: M }}>
                          {getAvatarInitials(userData?.name)}
                        </Typography>
                      )}

                      {/* Hover Overlay */}
                      {!uploading && (
                        <Box
                          className="avatar-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(68, 0, 13, 0.65)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s ease',
                            color: 'white',
                            gap: 0.5,
                            zIndex: 3
                          }}
                        >
                          <Camera size={16} color="white" />
                          <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Upload
                          </Typography>
                        </Box>
                      )}

                      {/* Loading Overlay */}
                      {uploading && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(255, 255, 255, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 4,
                          }}
                        >
                          <CircularProgress size={20} sx={{ color: M }} />
                        </Box>
                      )}
                    </Box>

                    {/* Action buttons shown once preview is active */}
                    {previewUrl && !uploading && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          zIndex: 10,
                        }}
                      >
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                          sx={{
                            minWidth: 0,
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            p: 0,
                            background: '#10b981',
                            color: 'white',
                            boxShadow: '0 2px 6px rgba(16,185,129,0.4)',
                            '&:hover': { background: '#059669' },
                          }}
                        >
                          <Check size={12} />
                        </Button>
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleCancelSelection(); }}
                          sx={{
                            minWidth: 0,
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            p: 0,
                            background: '#ef4444',
                            color: 'white',
                            boxShadow: '0 2px 6px rgba(239,68,68,0.4)',
                            '&:hover': { background: '#dc2626' },
                          }}
                        >
                          <X size={12} />
                        </Button>
                      </Box>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#111827', lineHeight: 1.2 }}>
                        {userData?.name || 'N/A'}
                      </Typography>
                      {userData?.hasMedicalStaffData && (
                        <Box sx={{
                          px: 1, py: 0.25, borderRadius: '4px',
                          background: M, color: 'white',
                          fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.3px',
                        }}>
                          Medical Staff
                        </Box>
                      )}
                    </Box>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.85rem', mb: 0.75 }}>
                      {userData?.role || 'N/A'} &nbsp;·&nbsp; {userData?.department || 'General Medicine'}
                      {userData?.staffID && userData.staffID !== 'N/A' && (
                        <span style={{ marginLeft: 12, color: '#d1d5db', fontSize: '0.78rem' }}>
                          Staff ID: {userData.staffID}
                        </span>
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: availability === 'available' ? '#10b981' : availability === 'busy' ? '#f59e0b' : '#6b7280'
                      }} />
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                        {availability === 'available' ? 'Available' : availability === 'busy' ? 'Busy' : 'Offline'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Button
                  onClick={() => setShowEditModal(true)}
                  startIcon={<Edit2 size={15} />}
                  sx={{
                    background: '#44000d',
                    color: 'white', fontWeight: 700, fontSize: '0.825rem',
                    borderRadius: '10px', px: 2.5, py: 1,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(68,0,13,0.25)',
                    '&:hover': {
                      background: '#5a0011',
                      boxShadow: '0 6px 20px rgba(68,0,13,0.35)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>

            {/* ── PERSONAL INFORMATION ─────────────────────────────────────────*/}
            <Box sx={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #e5e7eb', p: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <SectionHeader icon={User} title="Personal Information" subtitle="Your basic contact and personal details" />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
                <InfoRow icon={Mail} label="Email" value={userData?.email} />
                <InfoRow icon={Phone} label="Phone" value={userData?.phone} />
                <InfoRow icon={Calendar} label="Age" value={userData?.age} />
                <InfoRow icon={Users} label="Gender" value={userData?.gender} />
              </Box>
            </Box>

            {/* ── PROFESSIONAL INFORMATION ─────────────────────────────────────*/}
            <Box sx={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #e5e7eb', p: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <SectionHeader icon={Briefcase} title="Professional Information" subtitle="Your role and clinical details" />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
                <InfoRow icon={BadgeCheck} label="Role" value={userData?.role} />
                <InfoRow icon={Building2} label="Department" value={userData?.department} />
                <InfoRow icon={Briefcase} label="Specialization" value={userData?.specialization} />
                <InfoRow icon={User} label="Staff ID" value={userData?.staffID !== 'N/A' ? userData?.staffID : null} />
              </Box>
            </Box>

            {/* ── AVAILABILITY STATUS ─────────────────────────────────────────*/}
            <Box sx={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #e5e7eb', p: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <SectionHeader icon={BadgeCheck} title="Availability Status" subtitle="Let patients know if you're ready to consult" />
              <AvailabilitySelector
                availability={availability}
                setAvailability={updateAvailabilityInDatabase}
                updating={updatingAvailability}
              />
            </Box>

            {/* ── CHANGE PASSWORD (button right-aligned) ───────────────────────*/}
            <Box sx={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #e5e7eb', p: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <SectionHeader icon={Lock} title="Change Password" subtitle="Keep your account secure with a strong password" />
              <ChangePasswordForm />
            </Box>

          </Box>
        )}
      </Container>

      {/* Edit Modal */}
      {showEditModal && userData && (
        <SettingsEditModal
          userData={userData}
          close={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="info" sx={{ width: '100%', borderRadius: '10px' }}>
          Please update your profile information first.
        </Alert>
      </Snackbar>

      {/* Upload Toast */}
      <Snackbar
        open={!!uploadSuccess || !!uploadError}
        autoHideDuration={4000}
        onClose={() => { setUploadSuccess(null); setUploadError(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => { setUploadSuccess(null); setUploadError(null); }}
          severity={uploadSuccess ? 'success' : 'error'}
          sx={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          {uploadSuccess || uploadError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GeneralSettings;