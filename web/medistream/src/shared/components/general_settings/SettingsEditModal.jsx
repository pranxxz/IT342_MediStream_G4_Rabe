import React, { useState, useEffect } from 'react';
import { X, User, Loader2 } from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { FormTextField, FormSelectField } from './FormComponents';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT     = '#44000d';
const ACCENT_ALT = '#5a0011';
const BG_TINT    = '#fdf2f4';
const BORDER     = '#f3e6e8';

const GENDER_OPTIONS = [
  { value: 'Male',              label: 'Male'              },
  { value: 'Female',            label: 'Female'            },
  { value: 'Other',             label: 'Other'             },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
];

const REQUIRED_FIELDS = [
  { key: 'name',  label: 'Full Name'     },
  { key: 'role',  label: 'Role'          },
  { key: 'email', label: 'Email Address' },
];

const LS_KEYS = ['currentUser', 'user', 'loggedInUser', 'authUser'];

// ─── Error message parser ─────────────────────────────────────────────────────
// Converts raw backend errors into short, user-friendly messages.

const FIELD_LABEL_MAP = {
  gender:        'Gender',
  name:          'Full Name',
  role:          'Role',
  email:         'Email',
  contactNo:     'Contact Number',
  specialty:     'Specialization',
  department:    'Department',
  age:           'Age',
};

const parseFriendlyError = (rawMessage) => {
  if (!rawMessage) return 'Something went wrong. Please try again.';

  const lower = rawMessage.toLowerCase();

  // Gender validation — backend says: "Gender must be Male, Female, Other, or Prefer not to say"
  if (lower.includes('gender')) {
    return 'Please select a valid gender option.';
  }

  // Field-specific "must not be blank / required" errors
  for (const [field, label] of Object.entries(FIELD_LABEL_MAP)) {
    if (lower.includes(field) && (lower.includes('blank') || lower.includes('null') || lower.includes('required'))) {
      return label + ' is required.';
    }
  }

  // HTTP status hints
  if (lower.includes('400')) return 'Some information is invalid. Please review your details and try again.';
  if (lower.includes('401') || lower.includes('403')) return 'You do not have permission to perform this action.';
  if (lower.includes('404')) return 'Staff record not found. Please refresh and try again.';
  if (lower.includes('409')) return 'A record with this information already exists.';
  if (lower.includes('500')) return 'The server encountered an error. Please try again later.';

  // Network failure
  if (lower.includes('failed to fetch') || lower.includes('networkerror')) {
    return 'Could not connect to the server. Check your network connection.';
  }

  return 'Failed to save changes. Please check your details and try again.';
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const readParsed = (storage, keys) => {
  for (const key of keys) {
    try {
      const raw = storage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.accountID && parsed.accountID !== 'N/A') return parsed.accountID;
    } catch (_) { /* ignore */ }
  }
  return null;
};

const resolveAccountID = (userData) => {
  if (userData && userData.accountID && userData.accountID !== 'N/A') return userData.accountID;
  const fromLS = readParsed(localStorage, LS_KEYS);
  if (fromLS) return fromLS;
  const fromSS = readParsed(sessionStorage, LS_KEYS);
  if (fromSS) return fromSS;
  try {
    const raw = localStorage.getItem('medicalStaffData');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.userAccount && parsed.userAccount.accountID) {
        return parsed.userAccount.accountID;
      }
    }
  } catch (_) { /* ignore */ }
  return null;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const HRule = () => (
  <Box sx={{ height: '1px', background: BORDER, my: 2.5 }} />
);

const ModalHeader = ({ userData, accountID, fetchingAccount }) => (
  <Box sx={{ textAlign: 'center', mb: 3 }}>
    <Box
      sx={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'linear-gradient(135deg, #44000d 0%, #7a0018 100%)',
        margin: '0 auto 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 20px rgba(68,0,13,0.3)',
      }}
    >
      <User size={30} color="white" />
    </Box>

    <Typography
      variant="h6"
      sx={{
        fontWeight: 700, color: ACCENT, mb: 0.5,
        fontFamily: '"Poppins", "Arimo", sans-serif',
        fontSize: '1.125rem', letterSpacing: '-0.01em',
      }}
    >
      Edit Profile
    </Typography>

    <Typography
      variant="caption"
      sx={{
        display: 'inline-block', px: 1.5, py: 0.5,
        background: BG_TINT, color: ACCENT,
        borderRadius: '20px', fontWeight: 600,
        fontSize: '0.75rem', border: '1px solid ' + BORDER,
      }}
    >
      {userData.department || 'General Medicine'}
    </Typography>

    {fetchingAccount ? (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1.5 }}>
        <Loader2 size={14} color={ACCENT} style={{ animation: 'spin 1s linear infinite' }} />
        <Typography variant="caption" color="text.secondary">
          Loading account info...
        </Typography>
      </Box>
    ) : accountID ? (
      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#9ca3af', fontSize: '11px' }}>
        {userData.staffID && userData.staffID !== 'N/A'
          ? 'Staff ID: ' + userData.staffID + ' · Account ID: ' + accountID
          : 'No staff record found — a new one will be created on save.'}
      </Typography>
    ) : null}
  </Box>
);

const SectionLabel = ({ children }) => (
  <Typography
    variant="overline"
    sx={{
      display: 'block', color: ACCENT,
      fontWeight: 700, fontSize: '0.6875rem',
      letterSpacing: '0.08em', mb: 1.5, mt: 0.5,
      fontFamily: '"Poppins", "Arimo", sans-serif',
    }}
  >
    {children}
  </Typography>
);

// ─── Main component ───────────────────────────────────────────────────────────

const SettingsEditModal = ({ userData, close, onSave }) => {
  const [formData, setFormData] = useState({
    name:           userData.name           || '',
    age:            userData.age            || '',
    gender:         userData.gender         || '',
    phone:          userData.phone          || '',
    email:          userData.email          || '',
    role:           userData.role           || '',
    specialization: userData.specialization || '',
    department:     userData.department     || 'General Medicine',
  });

  const [accountID,       setAccountID]       = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [fetchingAccount, setFetchingAccount] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'warning' });
  const showSnackbar  = (message, severity = 'warning') => setSnackbar({ open: true, message, severity });
  const closeSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  // ── Account ID resolution ──────────────────────────────────────────────────

  useEffect(() => {
    setFetchingAccount(true);
    const id = resolveAccountID(userData);
    if (id) {
      setAccountID(id);
    } else {
      showSnackbar('Could not load your account. Please refresh the page.', 'error');
    }
    setFetchingAccount(false);
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    for (var i = 0; i < REQUIRED_FIELDS.length; i++) {
      var field = REQUIRED_FIELDS[i];
      if (!formData[field.key] || !formData[field.key].trim()) {
        showSnackbar(field.label + ' is required.', 'warning');
        return false;
      }
    }
    if (!accountID) {
      showSnackbar('Account information not found. Please refresh the page.', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const numericID = typeof accountID === 'string' ? parseInt(accountID, 10) : accountID;

      if (userData.staffID && userData.staffID !== 'N/A') {
        await updateMedicalStaffRecord(numericID);
      } else {
        await createMedicalStaffRecord(numericID);
      }

      await refreshStaffList();

      if (onSave) {
        onSave({ ...formData, staffID: userData.staffID || 'NEW', accountID: numericID, hasMedicalStaffData: true });
      }

      showSnackbar('Profile updated successfully!', 'success');
      setTimeout(close, 1600);
    } catch (err) {
      console.error('Error updating profile:', err);
      // Parse the raw backend/network error into a user-friendly message
      showSnackbar(parseFriendlyError(err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── API calls ──────────────────────────────────────────────────────────────

  const buildPayload = (accountId) => ({
    name:        formData.name,
    role:        formData.role.toLowerCase(),
    contactNo:   formData.phone,
    specialty:   formData.specialization,
    age:         formData.age ? parseInt(formData.age, 10) : null,
    gender:      formData.gender || null,
    department:  formData.department || 'General Medicine',
    userAccount: { accountID: accountId },
  });

  const updateMedicalStaffRecord = async (accountId) => {
    const res = await fetch('http://localhost:8080/api/medicalstaff/update/' + userData.staffID, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(accountId)),
    });
    if (!res.ok) {
      const body = await res.text();
      // Try to parse JSON error body for a message field
      try {
        const parsed = JSON.parse(body);
        throw new Error(parsed.message || parsed.error || ('HTTP ' + res.status));
      } catch (_) {
        throw new Error('HTTP ' + res.status + ' ' + body);
      }
    }
    return res.json();
  };

  const createMedicalStaffRecord = async (accountId) => {
    const res = await fetch('http://localhost:8080/api/medicalstaff/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(accountId)),
    });
    if (!res.ok) {
      const body = await res.text();
      try {
        const parsed = JSON.parse(body);
        throw new Error(parsed.message || parsed.error || ('HTTP ' + res.status));
      } catch (_) {
        throw new Error('HTTP ' + res.status + ' ' + body);
      }
    }
    return res.json();
  };

  const refreshStaffList = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/medicalstaff/all');
      if (res.ok) window.dispatchEvent(new Event('storage'));
    } catch (_) { /* non-critical */ }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const isDisabled = fetchingAccount || loading;

  const btnLabel = fetchingAccount
    ? 'Loading account...'
    : loading
    ? 'Saving...'
    : 'Save Changes';

  return (
    <React.Fragment>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Backdrop */}
      <Box
        onClick={close}
        sx={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 1000,
        }}
      />

      {/* Modal */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1001,
          background: 'white',
          borderRadius: '16px',
          width: { xs: '92vw', sm: '460px' },
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(68,0,13,0.18), 0 8px 24px rgba(0,0,0,0.1)',
          border: '1px solid ' + BORDER,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: BORDER, borderRadius: '4px' },
        }}
      >
        {/* Top accent bar */}
        <Box
          sx={{
            height: '4px',
            background: 'linear-gradient(90deg, #44000d 0%, #7a0018 50%, #b30026 100%)',
            borderRadius: '16px 16px 0 0',
          }}
        />

        <Box sx={{ p: '28px 32px 32px' }}>
          {/* Close button */}
          <IconButton
            onClick={close}
            size="small"
            sx={{
              position: 'absolute', top: 16, right: 16,
              color: '#9ca3af',
              '&:hover': { color: ACCENT, background: BG_TINT },
            }}
          >
            <X size={20} />
          </IconButton>

          <ModalHeader
            userData={userData}
            accountID={accountID}
            fetchingAccount={fetchingAccount}
          />

          <HRule />

          {/* Personal Info */}
          <SectionLabel>Personal Information</SectionLabel>

          <FormTextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Maria Santos"
            required
            disabled={isDisabled}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormTextField
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 35"
              type="number"
              disabled={isDisabled}
              mb={0}
            />
            <FormSelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={GENDER_OPTIONS}
              disabled={isDisabled}
              mb={0}
            />
          </Box>

          <Box sx={{ mb: 2.5 }} />

          <FormTextField
            label="Contact Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 09171234567"
            disabled={isDisabled}
          />

          <FormTextField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. maria@medistream.ph"
            type="email"
            required
            disabled={isDisabled}
          />

          <HRule />

          {/* Professional Details */}
          <SectionLabel>Professional Details</SectionLabel>

          <FormTextField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Doctor, Nurse, Admin"
            required
            disabled={isDisabled}
          />

          <FormTextField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g. General Medicine"
            disabled={isDisabled}
          />

          <FormTextField
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="e.g. Cardiology"
            disabled={isDisabled}
            mb={0}
          />

          {/* Save Button */}
          <Button
            onClick={handleSubmit}
            disabled={isDisabled || !accountID}
            fullWidth
            disableElevation
            sx={{
              mt: 3, py: 1.4,
              borderRadius: '40px',
              background: 'linear-gradient(135deg, #7a0017 0%, #44000d 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.875rem',
              fontFamily: '"Poppins", "Arimo", sans-serif',
              letterSpacing: '0.02em',
              textTransform: 'none',
              transition: 'all 0.25s ease',
              boxShadow: '0 8px 25px rgba(122, 0, 23, 0.25)',
              '&:hover:not(:disabled)': {
                background: 'linear-gradient(135deg, #7a0017 0%, #44000d 100%)',
                boxShadow: '0 10px 30px rgba(122, 0, 23, 0.35)',
                transform: 'translateY(-2px)',
              },
              '&:active:not(:disabled)': { transform: 'translateY(0)' },
              '&.Mui-disabled': {
                background: '#e5e7eb',
                color: '#9ca3af',
                boxShadow: 'none',
              },
            }}
          >
            {btnLabel}
          </Button>
        </Box>
      </Box>

      {/* Snackbar — all user feedback goes here, never raw errors */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'success' ? 2500 : 4500}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            fontFamily: '"Arimo", "Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            borderRadius: '10px',
            ...(snackbar.severity === 'warning' && {
              background: '#92400e',
              color: 'white',
              '& .MuiAlert-icon': { color: '#fde68a' },
            }),
            ...(snackbar.severity === 'success' && { background: '#166534' }),
            ...(snackbar.severity === 'error'   && { background: ACCENT }),
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default SettingsEditModal;