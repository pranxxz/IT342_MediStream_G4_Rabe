import React, { useState } from 'react';
import useFilter from '../../../shared/hooks/useFilter';
import { useStaff } from '../hooks/useStaff';
import { useRole } from '../../../shared/hooks/useRole';
import { COLORS } from '../../../shared/components/Sidebar';
import PageHeader, { HeaderSearch } from '../../../shared/components/PageHeader';
import BadgeIcon from '@mui/icons-material/Badge';
import staffService from '../service/staffService';
import { FeedbackModal } from '../../../shared/components/FeedbackModal';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const M       = COLORS.primary;
const BG      = COLORS.bg;
const WHITE   = COLORS.white;
const BORDER  = COLORS.border;
const TEXT    = COLORS.text;
const MUTED   = COLORS.textMuted;
const ROW_BG  = "#ffffff";
const ROW_HOV = "#faf0f0";
const ROW_DIV = "#f3f4f6";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconStaffGroup = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={M}>
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);
const IconPerson = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);
const IconDots = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={MUTED}>
    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
  </svg>
);

// ─── Custom Components ────────────────────────────────────────────────────────
const StatCard = ({ label, value, last }) => (
  <div style={{
    flex: 1, background: M, borderRadius: 10, padding: "18px 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginRight: last ? 0 : 16, boxShadow: "0 8px 25px rgba(68,0,13,0.15)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <IconPerson />
      <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>{label}</span>
    </div>
    <span style={{ color: "white", fontWeight: 800, fontSize: 32, lineHeight: 1 }}>{value}</span>
  </div>
);

const Avatar = ({ name }) => {
  const parts = (name || '').split(' ');
  const initials = ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
  return (
    <div style={{
      width: 38, height: 38, borderRadius: "50%",
      background: M, color: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 700, flexShrink: 0,
    }}>
      {initials || '?'}
    </div>
  );
};

const RoleBadge = ({ role, roleColor }) => {
  const bg = roleColor ? `${roleColor}15` : '#fee2e2';
  const text = roleColor || '#dc2626';
  return (
    <span style={{
      display: "inline-block", padding: "4px 14px", borderRadius: 20,
      background: bg, color: text, border: `1px solid ${text}30`,
      fontSize: 12, fontWeight: 600, textTransform: "capitalize"
    }}>
      {role}
    </span>
  );
};

// ─── Main Staff Component ─────────────────────────────────────────────────────
const Staff = () => {
  const {
    staffMembers,
    staffStats,
    searchQuery,
    roleFilter,
    statusFilter,
    loading,
    error,
    hasActiveFilters,
    getRoleColor,
    getStatusColor,
    getStatusBgColor,
    handleSearch,
    handleRoleFilter,
    handleStatusFilter,
    clearFilters,
    refreshStaffData,
  } = useStaff();

  const { isAdmin } = useRole();

  // Dropdown States
  const [roleDropOpen, setRoleDropOpen] = useState(false);
  const [statusDropOpen, setStatusDropOpen] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [modalState, setModalState] = useState({
    open: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: undefined,
    confirmText: 'Okay'
  });

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, open: false }));
  };

  // Add Staff Form States
  const [newStaffData, setNewStaffData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    contactNo: '',
  });
  const [addStaffLoading, setAddStaffLoading] = useState(false);
  const [addStaffError, setAddStaffError] = useState('');

  // Edit Staff Form States
  const [isEditing, setIsEditing] = useState(false);
  const [editStaffData, setEditStaffData] = useState({
    name: '',
    role: '',
    specialty: '',
    contactNo: '',
    age: '',
    gender: '',
    department: 'General Medicine',
  });
  const [editStaffLoading, setEditStaffLoading] = useState(false);
  const [editStaffError, setEditStaffError] = useState('');

  // Handle Add Staff Submission (CREATE)
  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    setAddStaffError('');

    if (!newStaffData.firstName.trim() || !newStaffData.lastName.trim() || !newStaffData.email.trim() || !newStaffData.role || !newStaffData.password) {
      setAddStaffError('Please fill out all required fields (First Name, Last Name, Email, Password, and Role).');
      return;
    }

    setAddStaffLoading(true);
    try {
      const payload = {
        firstName: newStaffData.firstName.trim(),
        lastName: newStaffData.lastName.trim(),
        email: newStaffData.email.trim(),
        password: newStaffData.password,
        role: newStaffData.role.toLowerCase(),
        idNumber: parseInt(Date.now().toString().slice(-6), 10),
        contactNo: newStaffData.contactNo.trim(),
      };

      await staffService.addStaff(payload);
      
      setNewStaffData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
        contactNo: '',
      });
      setShowAddStaffModal(false);
      refreshStaffData();
    } catch (err) {
      console.error('❌ Failed to add staff:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to add staff member. Please check backend logs.';
      setAddStaffError(msg);
    } finally {
      setAddStaffLoading(false);
    }
  };

  // Handle Edit Staff Submission (UPDATE)
  const handleEditStaffSubmit = async (e) => {
    e.preventDefault();
    setEditStaffError('');

    if (!editStaffData.name.trim() || !editStaffData.role) {
      setEditStaffError('Name and Role are required.');
      return;
    }

    setEditStaffLoading(true);
    try {
      const payload = {
        name: editStaffData.name.trim(),
        role: editStaffData.role,
        specialty: editStaffData.specialty.trim(),
        contactNo: editStaffData.contactNo.trim(),
        age: editStaffData.age ? parseInt(editStaffData.age) : null,
        gender: editStaffData.gender,
        department: editStaffData.department,
      };

      const updated = await staffService.updateStaff(selectedStaff.id, payload);
      
      setSelectedStaff(prev => ({
        ...prev,
        name: updated.name,
        role: updated.role,
        specialty: updated.specialty,
        contact: updated.contactNo,
        age: updated.age,
        gender: updated.gender,
        department: updated.department,
      }));
      
      setIsEditing(false);
      refreshStaffData();
    } catch (err) {
      console.error('❌ Failed to update staff:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to update staff details.';
      setEditStaffError(msg);
    } finally {
      setEditStaffLoading(false);
    }
  };

  // Handle Delete Staff Member (DELETE)
  const handleDeleteStaffClick = (id) => {
    setModalState({
      open: true,
      type: 'warning',
      title: 'Delete Staff Member?',
      message: '⚠️ WARNING: Are you sure you want to delete this staff member? This will permanently delete both their profile and their user login account credentials.',
      confirmText: 'Yes, Delete',
      onConfirm: () => executeDeleteStaff(id)
    });
  };

  const executeDeleteStaff = async (id) => {
    try {
      await staffService.deleteStaff(id);
      setSelectedStaff(null);
      refreshStaffData();
      handleCloseModal();
    } catch (err) {
      console.error('❌ Failed to delete staff:', err);
      setModalState({
        open: true,
        type: 'error',
        title: 'Delete Failed',
        message: err.response?.data?.message || err.message || 'Failed to delete staff member.',
        confirmText: 'Close',
        onConfirm: handleCloseModal
      });
    }
  };

  // Initialize edit form with staff values
  const startEditing = (staff) => {
    setEditStaffData({
      name: staff.name || '',
      role: staff.role || 'Staff',
      specialty: staff.specialty || '',
      contactNo: staff.contact || '',
      age: staff.age || '',
      gender: staff.gender || '',
      department: staff.department || 'General Medicine',
    });
    setEditStaffError('');
    setIsEditing(true);
  };

  // Dropdown Helper Component
  const Dropdown = ({ open, setOpen, value, setValue, options, label }) => (
    <div style={{ position: "relative" }}>
      <button
        onClick={(e) => { 
          e.stopPropagation(); 
          setOpen(o => !o); 
          if(label === 'All Roles') setStatusDropOpen(false);
          else setRoleDropOpen(false);
        }}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: 8,
          border: `1px solid ${BORDER}`, background: WHITE,
          color: TEXT, fontWeight: 500, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
        }}
      >
        <IconFilter /> {value === 'all' ? label : value}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 20,
          background: WHITE, borderRadius: 8, minWidth: 160,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: `1px solid ${BORDER}`,
          overflow: "hidden",
        }}>
          {options.map(opt => (
            <div key={opt.value}
              onClick={() => { setValue(opt.value); setOpen(false); }}
              style={{
                padding: "10px 16px", fontSize: 13, cursor: "pointer",
                color: value === opt.value ? M : TEXT,
                fontWeight: value === opt.value ? 700 : 400,
                background: value === opt.value ? "#fdf0f0" : WHITE,
              }}
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.background = BG; }}
              onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.background = WHITE; }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div 
      style={{ background: BG, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      onClick={() => { setRoleDropOpen(false); setStatusDropOpen(false); }}
    >
      {/* ── Content Header ── */}
      <PageHeader
        title="Medical Staff"
        subtitle="Manage doctors and nurses"
        icon={BadgeIcon}
        right={<HeaderSearch value={searchQuery} onChange={handleSearch} placeholder="Search staff..." />}
      />

      <div style={{ padding: "0 40px 40px" }}>

        {/* ── Horizontal Stat Cards ── */}
        <div style={{ display: "flex", marginBottom: 28 }}>
          {staffStats && staffStats.length > 0 ? (
            staffStats.map((stat, index) => (
              <StatCard 
                key={stat.id} 
                label={stat.title} 
                value={stat.value} 
                last={index === staffStats.length - 1} 
              />
            ))
          ) : (
            <>
              <StatCard label="Total Staff" value={staffMembers.length} />
              <StatCard label="Doctors" value={staffMembers.filter(s => s.role?.toLowerCase() === 'doctor').length} />
              <StatCard label="Nurses" value={staffMembers.filter(s => s.role?.toLowerCase() === 'nurse').length} />
              <StatCard label="Staff" value={staffMembers.filter(s => s.role?.toLowerCase() === 'staff').length} last />
            </>
          )}
        </div>

        {/* ── Table Card ── */}
        <div style={{
          background: WHITE, borderRadius: 12,
          border: `1px solid ${M}`,
          boxShadow: "0 4px 20px rgba(74,14,14,0.06)",
          overflow: "hidden",
        }}>
          {/* Toolbar */}
          <div style={{
            padding: "20px 24px",
            borderBottom: `1px solid #e8d5d5`,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: M }}>Staff Directory</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{staffMembers.length} staff members found</div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {isAdmin() && (
                <button 
                  onClick={() => setShowAddStaffModal(true)}
                  style={{
                    padding: "8px 16px", 
                    borderRadius: 8,
                    border: `1px solid ${M}`,
                    background: M,
                    color: WHITE,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  + Add Staff
                </button>
              )}

              {hasActiveFilters && (
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: MUTED, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  Clear Filters
                </button>
              )}

              <Dropdown 
                open={roleDropOpen} setOpen={setRoleDropOpen} 
                value={roleFilter} setValue={handleRoleFilter} 
                options={[
                  { label: 'All Roles', value: 'all' },
                  { label: 'Doctor', value: 'Doctor' },
                  { label: 'Nurse', value: 'Nurse' },
                  { label: 'Staff', value: 'Staff' }
                ]} 
                label="All Roles" 
              />
              
              <Dropdown 
                open={statusDropOpen} setOpen={setStatusDropOpen} 
                value={statusFilter} setValue={handleStatusFilter} 
                options={[
                  { label: 'All Status', value: 'all' },
                  { label: 'Available', value: 'Available' },
                  { label: 'Busy', value: 'Busy' },
                  { label: 'Off Duty', value: 'Off Duty' }
                ]} 
                label="All Status" 
              />

              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                border: `1px solid ${BORDER}`, borderRadius: 8,
                padding: "8px 14px", background: WHITE,
              }}>
                <IconSearch />
                <input
                  value={searchQuery} onChange={e => handleSearch(e.target.value)}
                  placeholder="Search staff..."
                  style={{ border: "none", outline: "none", fontSize: 13, color: TEXT, fontFamily: "inherit", width: 200 }}
                />
              </div>
            </div>
          </div>

          {/* Column Headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "48px 2fr 1.2fr 1.5fr 2.2fr 1.2fr",
            padding: "16px 24px",
            borderBottom: `1px solid #e8d5d5`,
            background: BG
          }}>
            {["#", "STAFF", "ROLE", "SPECIALIZATION", "EMAIL", "CONTACT"].map((h, i) => (
              <div key={i} style={{ fontSize: 11, fontWeight: 800, color: M, letterSpacing: "0.5px" }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: MUTED }}>Loading records...</div>
          ) : error ? (
            <div style={{ padding: "24px", color: "#ef4444", textAlign: "center", background: "#fef2f2" }}>{error}</div>
          ) : staffMembers.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: MUTED }}>No staff members found matching your criteria.</div>
          ) : (
            staffMembers.map((staff, i) => (
              <div key={staff.id}
                onClick={() => setSelectedStaff(staff)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 2fr 1.2fr 1.5fr 2.2fr 1.2fr",
                  padding: "16px 24px",
                  borderBottom: i === staffMembers.length - 1 ? 'none' : `1px solid ${ROW_DIV}`,
                  background: ROW_BG,
                  alignItems: "center",
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.background = ROW_HOV}
                onMouseLeave={e => e.currentTarget.style.background = ROW_BG}
              >
                <div style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>{i + 1}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={staff.name} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{staff.name || 'Unknown Name'}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>ID: {staff.id || 'N/A'}</div>
                  </div>
                </div>
                <div>
                  <RoleBadge role={staff.role || 'Staff'} roleColor={getRoleColor(staff.role)} />
                </div>
                <div style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>
                  {staff.specialty || 'General'}
                </div>
                <div style={{ fontSize: 13, color: TEXT }}>
                  {staff.email || 'No email provided'}
                </div>
                <div style={{ fontSize: 13, color: TEXT }}>
                  {staff.contact || 'N/A'}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Staff Modal - Only for Admin */}
        {showAddStaffModal && isAdmin() && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>
            <div style={{
              background: WHITE,
              borderRadius: 16,
              padding: '32px',
              maxWidth: 500,
              width: '90%',
              boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
              border: `2px solid ${M}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ color: M, fontSize: 20, fontWeight: 700, margin: 0 }}>Add New Staff Member</h2>
                <button 
                  onClick={() => setShowAddStaffModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 28,
                    cursor: 'pointer',
                    color: MUTED,
                    lineHeight: 1,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = M}
                  onMouseLeave={e => e.currentTarget.style.color = MUTED}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {addStaffError && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: '#fef2f2',
                    color: '#ef4444',
                    fontSize: 12,
                    fontWeight: 600,
                    border: '1px solid #fca5a5'
                  }}>
                    ⚠️ {addStaffError}
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>FIRST NAME *</label>
                  <input 
                    type="text" 
                    placeholder="Enter first name"
                    value={newStaffData.firstName}
                    onChange={e => setNewStaffData({ ...newStaffData, firstName: e.target.value })}
                    disabled={addStaffLoading}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 6,
                      border: `1px solid ${BORDER}`,
                      fontSize: 13,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>LAST NAME *</label>
                  <input 
                    type="text" 
                    placeholder="Enter last name"
                    value={newStaffData.lastName}
                    onChange={e => setNewStaffData({ ...newStaffData, lastName: e.target.value })}
                    disabled={addStaffLoading}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 6,
                      border: `1px solid ${BORDER}`,
                      fontSize: 13,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>EMAIL ADDRESS *</label>
                  <input 
                    type="email" 
                    placeholder="Enter email address"
                    value={newStaffData.email}
                    onChange={e => setNewStaffData({ ...newStaffData, email: e.target.value })}
                    disabled={addStaffLoading}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 6,
                      border: `1px solid ${BORDER}`,
                      fontSize: 13,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>PASSWORD *</label>
                  <input 
                    type="password" 
                    placeholder="Enter default login password"
                    value={newStaffData.password}
                    onChange={e => setNewStaffData({ ...newStaffData, password: e.target.value })}
                    disabled={addStaffLoading}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 6,
                      border: `1px solid ${BORDER}`,
                      fontSize: 13,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>ROLE *</label>
                  <select 
                    value={newStaffData.role}
                    onChange={e => setNewStaffData({ ...newStaffData, role: e.target.value })}
                    disabled={addStaffLoading}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 6,
                      border: `1px solid ${BORDER}`,
                      fontSize: 13,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      background: WHITE,
                    }}
                  >
                    <option value="">Select a role</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>CONTACT NUMBER</label>
                  <input 
                    type="tel" 
                    placeholder="Enter contact number (e.g. 09123456789)"
                    value={newStaffData.contactNo}
                    onChange={e => setNewStaffData({ ...newStaffData, contactNo: e.target.value })}
                    disabled={addStaffLoading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 6,
                      border: `1px solid ${BORDER}`,
                      fontSize: 13,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button 
                    type="button"
                    onClick={() => {
                      setNewStaffData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        role: '',
                        contactNo: '',
                      });
                      setAddStaffError('');
                      setShowAddStaffModal(false);
                    }}
                    disabled={addStaffLoading}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      borderRadius: 8,
                      border: `1px solid ${BORDER}`,
                      background: WHITE,
                      color: TEXT,
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = BG}
                    onMouseLeave={e => e.currentTarget.style.background = WHITE}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={addStaffLoading}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: M,
                      color: WHITE,
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      opacity: addStaffLoading ? 0.7 : 1,
                    }}
                    onMouseEnter={e => !addStaffLoading && (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={e => !addStaffLoading && (e.currentTarget.style.opacity = '1')}
                  >
                    {addStaffLoading ? 'Adding...' : 'Add Staff'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Staff Detail Pop-up Modal (Redesigned) ── */}
        {selectedStaff && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(240, 240, 240, 0.10)', 
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.25s ease-out',
          }}
          onClick={() => !isEditing && setSelectedStaff(null)}
          >
            <div style={{
              background: WHITE,
              borderRadius: 16,
              padding: '36px',
              maxWidth: 560,
              width: '90%',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.15)',
              border: `1px solid ${M}`,
              position: 'relative',
              boxSizing: 'border-box',
            }}
            onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setSelectedStaff(null);
                }}
                disabled={editStaffLoading}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: 'none',
                  border: 'none',
                  fontSize: 28,
                  cursor: 'pointer',
                  color: MUTED,
                  transition: 'color 0.2s',
                  lineHeight: 1,
                }}
                onMouseEnter={e => !editStaffLoading && (e.currentTarget.style.color = M)}
                onMouseLeave={e => !editStaffLoading && (e.currentTarget.style.color = MUTED)}
              >
                ×
              </button>

              {/* Header: Avatar + Name + Role/Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, borderBottom: `1px solid #eaeaea`, paddingBottom: 20 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: M, color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, fontWeight: 700, boxShadow: '0 4px 12px rgba(68,0,13,0.2)',
                }}>
                  {(() => {
                    const parts = (selectedStaff.name || '').split(' ');
                    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
                  })()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT, marginBottom: 8 }}>{selectedStaff.name || 'Unknown Name'}</h3>
                    <RoleBadge role={selectedStaff.role} roleColor={getRoleColor(selectedStaff.role)} />
                </div>
              </div>

              {!isEditing ? (
                // VIEW MODE
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Row 1: Staff ID & Department as badges */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>STAFF ID</label>
                        <span style={{
                          display: "inline-block", padding: "4px 12px", borderRadius: 6,
                          background: "#fdecea", color: M, border: `1px solid #f5c6c6`,
                          fontSize: 12, fontWeight: 600,
                        }}>
                          #{selectedStaff.id || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>DEPARTMENT</label>
                        <span style={{
                          display: "inline-block", padding: "4px 12px", borderRadius: 6,
                          background: "#fdecea", color: M, border: `1px solid #f5c6c6`,
                          fontSize: 12, fontWeight: 600,
                        }}>
                          {selectedStaff.department || 'General Medicine'}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Specialization & Age/Gender (plain text) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>SPECIALIZATION</label>
                        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{selectedStaff.specialty || 'General Practice'}</div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>AGE & GENDER</label>
                        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>
                          {selectedStaff.age ? `${selectedStaff.age} yrs` : 'N/A'} • {selectedStaff.gender || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Email & Contact Number – side by side */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: `1px solid #eaeaea`, paddingTop: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>EMAIL ADDRESS</label>
                        <a href={selectedStaff.email ? `mailto:${selectedStaff.email}` : '#'} onClick={e => !selectedStaff.email && e.preventDefault()} style={{ fontSize: 14, fontWeight: 600, color: TEXT, textDecoration: 'none', borderBottom: selectedStaff.email ? `1px dashed ${MUTED}` : 'none' }}>
                          {selectedStaff.email || 'No email provided'}
                        </a>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>CONTACT NUMBER</label>
                        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{selectedStaff.contact || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: isAdmin() ? '1fr 1fr' : '1fr', gap: 12, marginTop: 32 }}>
                    {isAdmin() && (
                      <>
                        <button 
                          onClick={() => startEditing(selectedStaff)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: 8,
                            border: `1.5px solid ${M}`,
                            background: WHITE,
                            color: M,
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                            textAlign: 'center',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = M;
                            e.currentTarget.style.color = WHITE;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = WHITE;
                            e.currentTarget.style.color = M;
                          }}
                        >
                          Edit Profile
                        </button>
                        <button 
                          onClick={() => handleDeleteStaffClick(selectedStaff.id)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: 8,
                            border: `1.5px solid #ef4444`,
                            background: '#fef2f2',
                            color: '#ef4444',
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                            textAlign: 'center',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#ef4444';
                            e.currentTarget.style.color = WHITE;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = '#fef2f2';
                            e.currentTarget.style.color = '#ef4444';
                          }}
                        >
                          Delete Member
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                // EDIT MODE (unchanged, kept as originally working)
                <form onSubmit={handleEditStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {editStaffError && (
                    <div style={{
                      padding: '10px 12px',
                      borderRadius: 6,
                      background: '#fef2f2',
                      color: '#ef4444',
                      fontSize: 12,
                      fontWeight: 600,
                      border: '1px solid #fca5a5'
                    }}>
                      ⚠️ {editStaffError}
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>STAFF NAME</label>
                    <input 
                      type="text" 
                      value={editStaffData.name}
                      onChange={e => setEditStaffData({ ...editStaffData, name: e.target.value })}
                      disabled={editStaffLoading}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: `1px solid ${BORDER}`,
                        fontSize: 13,
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>ROLE</label>
                      <select 
                        value={editStaffData.role}
                        onChange={e => setEditStaffData({ ...editStaffData, role: e.target.value })}
                        disabled={editStaffLoading}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: `1px solid ${BORDER}`,
                          fontSize: 13,
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          background: WHITE,
                        }}
                      >
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>DEPARTMENT</label>
                      <select 
                        value={editStaffData.department}
                        onChange={e => setEditStaffData({ ...editStaffData, department: e.target.value })}
                        disabled={editStaffLoading}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: `1px solid ${BORDER}`,
                          fontSize: 13,
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          background: WHITE,
                        }}
                      >
                        <option value="General Medicine">General Medicine</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Neurology">Neurology</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>SPECIALIZATION</label>
                      <input 
                        type="text" 
                        value={editStaffData.specialty}
                        onChange={e => setEditStaffData({ ...editStaffData, specialty: e.target.value })}
                        disabled={editStaffLoading}
                        placeholder="e.g. Pediatrics, Cardiology"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: `1px solid ${BORDER}`,
                          fontSize: 13,
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>AGE</label>
                        <input 
                          type="number" 
                          value={editStaffData.age}
                          onChange={e => setEditStaffData({ ...editStaffData, age: e.target.value })}
                          disabled={editStaffLoading}
                          min="18"
                          max="120"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: 8,
                            border: `1px solid ${BORDER}`,
                            fontSize: 13,
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>GENDER</label>
                        <select 
                          value={editStaffData.gender}
                          onChange={e => setEditStaffData({ ...editStaffData, gender: e.target.value })}
                          disabled={editStaffLoading}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: 8,
                            border: `1px solid ${BORDER}`,
                            fontSize: 13,
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                            background: WHITE,
                          }}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>CONTACT NUMBER</label>
                    <input 
                      type="text" 
                      value={editStaffData.contactNo}
                      onChange={e => setEditStaffData({ ...editStaffData, contactNo: e.target.value })}
                      disabled={editStaffLoading}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: `1px solid ${BORDER}`,
                        fontSize: 13,
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={editStaffLoading}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: `1px solid ${BORDER}`,
                        background: WHITE,
                        color: TEXT,
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = BG}
                      onMouseLeave={e => e.currentTarget.style.background = WHITE}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={editStaffLoading}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: 'none',
                        background: M,
                        color: WHITE,
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        opacity: editStaffLoading ? 0.7 : 1,
                      }}
                      onMouseEnter={e => !editStaffLoading && (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={e => !editStaffLoading && (e.currentTarget.style.opacity = '1')}
                    >
                      {editStaffLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        
        {/* Feedback Modal for warnings and deletions */}
        <FeedbackModal
          open={modalState.open}
          onClose={handleCloseModal}
          title={modalState.title}
          message={modalState.message}
          type={modalState.type}
          confirmText={modalState.confirmText}
          onConfirm={modalState.onConfirm}
        />
      </div>
    </div>
  );
};

export default Staff;