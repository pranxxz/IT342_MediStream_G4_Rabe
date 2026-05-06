import React, { useState, useEffect } from 'react';
import {
  Box, Typography, IconButton, Card, Avatar, Button, Menu, MenuItem, CardContent
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, People, Male, Female, MoreVert, FaUsers, FilterList } from "../lib";
import { FeedbackModal } from "../components/FeedbackModal";
import { patientService } from "../services/patientService";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const M = "#4a0e0e";
const M_DARK = "#3a0a0a";
const BORDER = "#e5e7eb";
const BG = "#f9fafb";
const TEXT = "#1f2937";
const MUTED = "#6b7280";
const ROW_HOVER = "#fdf8f8";
const ROW_BORDER = "#f0e8e8";

// ─── Right-side Stat Card (dark maroon, horizontal) ───────────────────────────
const MaroonStatCard = ({ label, value, icon }) => (
  <div style={{
    background: M,
    borderRadius: 12,
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        background: "rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <span style={{ color: "white", fontWeight: 600, fontSize: 16 }}>{label}</span>
    </div>
    <span style={{ color: "white", fontWeight: 800, fontSize: 32, lineHeight: 1 }}>{value}</span>
  </div>
);

// ─── Inline Patient Form Panel ────────────────────────────────────────────────
const PatientFormPanel = ({ initialData, onSubmit, onCancel, patientId }) => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', contactNumber: '', age: '', gender: '', address: '', lastVisit: '',
  });

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    setForm({ 
      firstName: initialData?.firstName || '', 
      lastName: initialData?.lastName || '', 
      contactNumber: initialData?.contactNumber || '', 
      age: initialData?.age || '', 
      gender: initialData?.gender || '', 
      address: initialData?.address || '', 
      lastVisit: formatDateForInput(initialData?.lastVisit)
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const inputStyle = {
    width: "100%", border: "none", borderBottom: `1.5px solid #d1d5db`,
    outline: "none", padding: "4px 0", fontSize: 13, background: "transparent",
    fontFamily: "inherit", color: TEXT, boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 11, color: MUTED, fontWeight: 600, display: "block", marginBottom: 2 };
  const fieldWrap = { flex: 1 };

  return (
    <div style={{
      background: "white", borderRadius: 12,
      border: `1.5px solid ${M}`,
      padding: "20px 22px",
      boxShadow: "0 2px 12px rgba(74,14,14,0.08)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>Patient Information</span>
        {patientId && (
          <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>ID: {patientId}</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <div style={fieldWrap}>
          <label style={labelStyle}>First Name*</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Last Name*</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Contact Number*</label>
        <input name="contactNumber" value={form.contactNumber} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Age*</label>
          <input name="age" type="number" value={form.age} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Gender*</label>
          <select name="gender" value={form.gender} onChange={handleChange}
            style={{ ...inputStyle, appearance: "none" }}>
            <option value=""></option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Address*</label>
        <input name="address" value={form.address} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Last Visit</label>
        <input name="lastVisit" type="date" value={form.lastVisit} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        {onCancel && (
          <button onClick={onCancel} style={{
            padding: "8px 18px", borderRadius: 7, border: `1px solid ${BORDER}`,
            background: "white", color: TEXT, fontWeight: 600, fontSize: 13,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Clear
          </button>
        )}
        <button onClick={() => onSubmit(form)} style={{
          padding: "8px 24px", borderRadius: 7, border: "none",
          background: M, color: "white", fontWeight: 700, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          Save Patient
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ gender: null });
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [patientMenuAnchorEl, setPatientMenuAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [formPanel, setFormPanel] = useState({ open: false, isEditing: false, data: null });
  const [feedbackModal, setFeedbackModal] = useState({ open: false, type: 'success', title: '', message: '', onConfirm: null });

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAllPatients();
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients from DB:", error);
      setPatients([]); 
    } finally {
      setLoading(false);
    }
  };

  const displayPatients = patients.filter(p => {
    const matchSearch = !searchTerm ||
      p.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contactNumber?.includes(searchTerm);
    const matchGender = !filters.gender || p.gender === filters.gender;
    return matchSearch && matchGender;
  });

  const handleFilterClick = (e) => setFilterAnchorEl(e.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleGenderFilter = (gender) => { setFilters({ gender: gender === 'all' ? null : gender }); handleFilterClose(); };

  const handlePatientMenuClick = (e, patient) => {
    e.stopPropagation(); 
    setPatientMenuAnchorEl(e.currentTarget);
    setSelectedPatient(patient);
    setSelectedPatientId(patient.patientId || patient.id);
  };
  const handlePatientMenuClose = () => { setPatientMenuAnchorEl(null); setSelectedPatient(null); };

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
    setSelectedPatientId(patient.patientId || patient.id);
    setFormPanel({ open: true, isEditing: true, data: { ...patient } });
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setSelectedPatientId(null);
    setFormPanel({ open: true, isEditing: false, data: null });
  };

  const handleEditPatient = () => {
    if (!selectedPatient) return;
    setFormPanel({ open: true, isEditing: true, data: { ...selectedPatient } });
    handlePatientMenuClose();
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formPanel.isEditing && selectedPatientId) {
        await patientService.updatePatient(selectedPatientId, formData);
        setFeedbackModal({ open: true, type: 'success', title: 'Updated Successfully', message: 'Patient record updated.' });
      } else {
        await patientService.addPatient(formData);
        setFeedbackModal({ open: true, type: 'success', title: 'Patient Added', message: 'Patient added to system.' });
      }
      setFormPanel({ open: false, isEditing: false, data: null });
      fetchPatients(); 
    } catch (error) {
      console.error(error);
      setFeedbackModal({ open: true, type: 'error', title: 'Operation Failed', message: 'Failed to save patient.' });
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedPatient) return;
    setFeedbackModal({
      open: true, type: 'delete', title: 'Delete Record?',
      message: 'Are you sure you want to delete this patient?',
      confirmText: 'Yes, Delete', onConfirm: performDelete,
    });
    handlePatientMenuClose();
  };

  const performDelete = async () => {
    try {
      await patientService.deletePatient(selectedPatientId);
      fetchPatients();
      setFormPanel({ open: false, isEditing: false, data: null }); 
      setFeedbackModal({ open: true, type: 'success', title: 'Deleted!', message: 'Patient removed.' });
    } catch {
      setFeedbackModal({ open: true, type: 'error', title: 'Delete Failed', message: 'Could not delete patient.' });
    }
  };

  const totalPatients  = patients.length;
  const femalePatients = patients.filter(p => p.gender === 'Female').length;
  const malePatients   = patients.filter(p => p.gender === 'Male').length;

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      <div style={{
        background: "white", borderBottom: `1px solid ${BORDER}`,
        padding: "18px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: M,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: TEXT, letterSpacing: "-0.3px" }}>Patient Management</div>
            <div style={{ fontSize: 13, color: MUTED }}>Add, edit, and manage patient records</div>
          </div>
        </div>
        <button onClick={handleAddPatient} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderRadius: 8, border: "none",
          background: M, color: "white", fontWeight: 700, fontSize: 14,
          cursor: "pointer", fontFamily: "inherit",
        }}
          onMouseEnter={e => e.currentTarget.style.background = M_DARK}
          onMouseLeave={e => e.currentTarget.style.background = M}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Patient
        </button>
      </div>

      <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

        <div style={{
          background: "white", borderRadius: 12,
          border: `1.5px solid ${M}`,
          boxShadow: "0 2px 12px rgba(74,14,14,0.08)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "18px 24px",
            borderBottom: `1.5px solid ${M}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: M }}>Patient Records</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{displayPatients.length} patients found</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={handleFilterClick} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 8,
                border: `1px solid ${BORDER}`, background: "white",
                color: TEXT, fontWeight: 500, fontSize: 13,
                cursor: "pointer", fontFamily: "inherit",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                {filters.gender || 'All Genders'}
              </button>
              <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
                <MenuItem onClick={() => handleGenderFilter('all')}>All Genders</MenuItem>
                <MenuItem onClick={() => handleGenderFilter('Male')}>Male</MenuItem>
                <MenuItem onClick={() => handleGenderFilter('Female')}>Female</MenuItem>
              </Menu>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                border: `1px solid ${BORDER}`, borderRadius: 8,
                padding: "7px 14px", background: "white",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search patients..."
                  style={{ border: "none", outline: "none", fontSize: 13, color: TEXT, fontFamily: "inherit", width: 180, background: "transparent" }}
                />
              </div>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "48px 2fr 72px 2fr 1.4fr 56px",
            padding: "12px 24px",
            background: "white",
            borderBottom: `1px solid #e8d5d5`,
          }}>
            {["#", "PATIENT", "AGE", "ADDRESS", "CONTACT", ""].map((h, i) => (
              <div key={i} style={{ fontSize: 11, fontWeight: 800, color: M, letterSpacing: "0.9px" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: MUTED }}>Loading patients from database...</div>
          ) : displayPatients.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: MUTED }}>No patient records found in the database.</div>
          ) : (
            displayPatients.map((p, i) => {
              const initials = ((p.firstName || '')[0] + (p.lastName || '')[0]).toUpperCase();
              const patientId = p.patientId || p.id;
              const isSelected = selectedPatientId === patientId;
              
              return (
                <div key={patientId || i}
                  onClick={() => handleRowClick(p)} 
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 2fr 72px 2fr 1.4fr 56px",
                    padding: "16px 24px",
                    borderBottom: `1px solid ${ROW_BORDER}`,
                    background: isSelected ? "#faf0f0" : "#fdf8f8",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = ROW_HOVER; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "#fdf8f8"; }}
                >
                  <div style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>{i + 1}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: M, color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{p.firstName} {p.lastName}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>ID: {patientId}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 13, color: TEXT }}>{p.age}</div>

                  <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.4 }}>{p.address || '—'}</div>

                  <div style={{ fontSize: 13, color: TEXT }}>{p.contactNumber || '—'}</div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={e => handlePatientMenuClick(e, p)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={MUTED}>
                        <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <MaroonStatCard
            label="Total Patients"
            value={totalPatients}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            }
          />
          <MaroonStatCard
            label="Female Patients"
            value={femalePatients}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="8" r="5"/>
                <line x1="12" y1="13" x2="12" y2="21"/>
                <line x1="9" y1="18" x2="15" y2="18"/>
              </svg>
            }
          />
          <MaroonStatCard
            label="Male Patients"
            value={malePatients}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="10" cy="14" r="5"/>
                <line x1="21" y1="3" x2="15" y2="9"/>
                <polyline points="16,3 21,3 21,8"/>
              </svg>
            }
          />

          <div style={{ marginTop: 4 }}>
            <PatientFormPanel
              initialData={formPanel.data}
              patientId={formPanel.isEditing ? selectedPatientId : null}
              onSubmit={handleFormSubmit}
              onCancel={formPanel.open ? () => {
                setFormPanel({ open: false, isEditing: false, data: null });
                setSelectedPatientId(null);
              } : null}
            />
          </div>
        </div>
      </div>

      <Menu anchorEl={patientMenuAnchorEl} open={Boolean(patientMenuAnchorEl)} onClose={handlePatientMenuClose}>
        <MenuItem onClick={handleEditPatient}>
          <EditIcon sx={{ fontSize: 16, mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleConfirmDelete} sx={{ color: '#ef4444' }}>
          <DeleteIcon sx={{ fontSize: 16, mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <FeedbackModal
        open={feedbackModal.open}
        onClose={() => setFeedbackModal({ ...feedbackModal, open: false })}
        onConfirm={feedbackModal.onConfirm}
        title={feedbackModal.title}
        message={feedbackModal.message}
        type={feedbackModal.type}
        confirmText={feedbackModal.confirmText}
      />
    </div>
  );
}

export default PatientPage;