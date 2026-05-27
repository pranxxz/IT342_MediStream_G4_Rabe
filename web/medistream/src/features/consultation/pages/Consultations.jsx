import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box, Typography, Container, Paper, Grid, TextField,
  MenuItem, Button, Autocomplete, FormControl, Select,
  Snackbar, Alert, List, ListItem, Chip
} from '@mui/material';
import API from '../../../shared/services/api';
import { queueService } from '../../patientqueue/services/queueService';
import { staffService } from '../../medicalstaff/service/staffService';
import { useAuth } from '../../authentication/hooks/useAuth';
import {
  PersonOutline as PersonOutlineIcon,
  Group as GroupIcon,
  LocalHospital as LocalHospitalIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  MedicalServices as MedicalServicesIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Cake as CakeIcon,
  Wc as WcIcon,
  Assignment as AssignmentIcon,
  Healing as HealingIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { COLORS } from '../../../shared/components/Sidebar';
import PageHeader from '../../../shared/components/PageHeader';

// ─── Design System ────────────────────────────────────────────────────────────
const M = COLORS.primary;
const M_DARK = COLORS.primaryDark;
const M_LIGHT = '#7a0017';
const BG = COLORS.bg;

const QUICK_TEMPLATES = {
  'Fever / Cold': {
    icon: '🤧',
    symptoms: 'Fever, cough, runny nose, sore throat',
    diagnosis: 'Acute upper respiratory infection',
    prescription: 'Paracetamol 500mg q4-6h PRN, increased fluid intake, rest',
    remarks: 'Follow up if fever persists more than 3 days',
  },
  'Headache': {
    icon: '🧠',
    symptoms: 'Throbbing headache, nausea, sensitivity to light',
    diagnosis: 'Migraine without aura',
    prescription: 'Ibuprofen 400mg, rest in dark quiet room',
    remarks: 'Avoid known triggers, consider prophylaxis if frequent',
  },
  'Hypertension': {
    icon: '❤️',
    symptoms: 'Asymptomatic, elevated BP reading',
    diagnosis: 'Essential hypertension',
    prescription: 'Amlodipine 5mg once daily, low sodium diet',
    remarks: 'Monitor BP weekly, return in 1 month for follow-up',
  },
  'Diabetes': {
    icon: '💉',
    symptoms: 'Polydipsia, polyuria, fatigue',
    diagnosis: 'Type 2 Diabetes Mellitus',
    prescription: 'Metformin 500mg twice daily with meals',
    remarks: 'Strict diet control, regular blood glucose monitoring',
  },
};

// ─── Reusable Sub-components ──────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <Typography
    sx={{
      fontSize: '0.7rem',
      fontWeight: 800,
      color: M,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      mb: 1,
    }}
  >
    {children}
  </Typography>
);

const FieldBox = ({ label, children }) => (
  <Box sx={{ mb: 2.5 }}>
    <SectionLabel>{label}</SectionLabel>
    {children}
  </Box>
);

const modernInput = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    background: '#ffffff',
    fontSize: '0.875rem',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: M,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: M,
      borderWidth: '2px',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e5e7eb',
  },
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Consultation() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { getCurrentUser } = useAuth();

  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctor, setDoctor] = useState('');
  const [consultDate, setConsultDate] = useState(new Date());
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [remarks, setRemarks] = useState('');
  const [currentDoctorId, setCurrentDoctorId] = useState(null);
  const [todaysConsultations, setTodaysConsultations] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);

  const selectedPatientRef = useRef(null);

  const applyTemplate = (key) => {
    const data = QUICK_TEMPLATES[key];
    if (data) {
      setSymptoms(data.symptoms);
      setDiagnosis(data.diagnosis);
      setPrescription(data.prescription);
      setRemarks(data.remarks);
      setActiveTemplate(key);
      setSnackbar({ open: true, message: `Template "${key}" applied`, severity: 'info' });
    }
  };

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const resp = await API.get('/api/queue');
      const queues = resp.data || [];
      const patientsFromQueue = queues
        .filter((q) => q.patient != null)
        .map((q) => ({
          patientId: q.patient.patientId,
          firstName: q.patient.firstName,
          lastName: q.patient.lastName,
          age: q.patient.age,
          gender: q.patient.gender,
          contactNumber: q.patient.contactNumber,
          address: q.patient.address,
          queueId: q.id || q.queueID || q.queueId,
          queueStatus: q.status,
          queueNumber: q.queueNumber,
        }));
      setPatients(patientsFromQueue);
    } catch {
      setSnackbar({ open: true, message: 'Unable to load patients', severity: 'error' });
    } finally {
      setLoadingPatients(false);
    }
  };

  const loadStaff = async () => {
    setLoadingStaff(true);
    try {
      const data = await staffService.getAllStaff();
      setStaff(data || []);
    } catch {
      setSnackbar({ open: true, message: 'Unable to load staff list', severity: 'error' });
    } finally {
      setLoadingStaff(false);
    }
  };

  const loadConsultations = async () => {
    try {
      const response = await API.get('/api/consultations/all');
      setConsultations(response.data || []);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (staff.length > 0 && !doctor) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        const matchedStaff = staff.find((s) =>
          s.email === currentUser.email ||
          (currentUser.firstName && s.name && s.name.includes(currentUser.firstName))
        );
        if (matchedStaff) {
          setCurrentDoctorId(matchedStaff.id);
          setDoctor(matchedStaff.id);
        }
      }
    }
  }, [staff]);

  useEffect(() => {
    loadPatients();
    loadStaff();
    loadConsultations();
    return () => {
      const currentPatient = selectedPatientRef.current;
      if (currentPatient && (currentPatient.queueId || currentPatient.queueID)) {
        const qid = currentPatient.queueId || currentPatient.queueID;
        queueService.updateQueueItem(qid, { status: 'WAITING' }).catch(() => {});
      }
    };
  }, []);

  const handlePatientSelect = async (event, newValue) => {
    if (selectedPatient && (selectedPatient.queueId || selectedPatient.queueID)) {
      try {
        await queueService.updateQueueItem(selectedPatient.queueId || selectedPatient.queueID, { status: 'WAITING' });
      } catch {}
    }
    // Immediately reflect CONSULTING status in local state
    const patientWithStatus = newValue ? { ...newValue, queueStatus: 'CONSULTING' } : null;
    setSelectedPatient(patientWithStatus);
    selectedPatientRef.current = patientWithStatus;
    if (newValue && (newValue.queueId || newValue.queueID)) {
      try {
        await queueService.updateQueueItem(newValue.queueId || newValue.queueID, { status: 'CONSULTING' });
      } catch {
        setSnackbar({ open: true, message: 'Could not update queue status', severity: 'warning' });
      }
    }
    loadPatients();
  };

  const handleSave = async () => {
    if (!selectedPatient) { setSnackbar({ open: true, message: 'Please select a patient', severity: 'error' }); return; }
    if (!doctor) { setSnackbar({ open: true, message: 'Please select a doctor', severity: 'error' }); return; }
    if (!diagnosis.trim()) { setSnackbar({ open: true, message: 'Please enter a diagnosis', severity: 'error' }); return; }

    const payload = {
      patientId: selectedPatient.patientId || selectedPatient.id,
      staffId: doctor,
      symptoms, diagnosis,
      medicinePrescribed: prescription,
      remarks,
      consultationDate: consultDate.toISOString(),
    };

    setSaving(true);
    try {
      const response = await API.post('/api/consultations/add', payload);
      const savedConsult = response.data;
      setConsultations((prev) => [savedConsult, ...prev]);
      setTodaysConsultations((prev) => [
        {
          id: savedConsult.id || Date.now(),
          patientName: `${savedConsult.patient?.firstName || selectedPatient.firstName || ''} ${savedConsult.patient?.lastName || selectedPatient.lastName || ''}`.trim(),
          doctor: savedConsult.medicalStaff?.name || staff.find((s) => s.id === doctor)?.name || '',
          diagnosis: savedConsult.diagnosis || diagnosis,
        },
        ...prev,
      ]);
      try {
        const qid = selectedPatient?.queueId || selectedPatient?.queueID;
        if (qid) await queueService.updateQueueItem(qid, { status: 'COMPLETED' });
      } catch {}
      setSymptoms(''); setDiagnosis(''); setPrescription(''); setRemarks('');
      setConsultDate(new Date()); setSelectedPatient(null); selectedPatientRef.current = null;
      setActiveTemplate(null);
      loadPatients();
      setSnackbar({ open: true, message: 'Consultation saved successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to save consultation.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const pastConsults = useMemo(() => {
    if (!selectedPatient) return [];
    const patientId = selectedPatient.patientId || selectedPatient.id;
    return consultations.filter((c) => c.patient?.patientId === patientId || c.patientId === patientId);
  }, [selectedPatient, consultations]);

  const selectedDoctorName = staff.find((s) => s.id === doctor)?.name || '';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: BG, pb: 6 }}>

        {/* ── Page Header ── */}
        <PageHeader
          title="Consultation"
          subtitle="Document patient consultations and prescriptions"
          icon={MedicalServicesIcon}
        />

        <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, md: '40px' } }}>
          <Grid container spacing={3} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>

            {/* ── LEFT COLUMN ── */}
            <Grid item xs={12} md={7} sx={{ minWidth: { md: '68%' } }}>

              {/* Patient Card */}
              <Paper elevation={0} sx={{
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                mb: 3, overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(68,0,13,0.12)',
              }}>
                {/* Card header */}
                <Box sx={{
                  px: 3, py: 2,
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  background: '#ffffff',
                }}>
                  <Box sx={{
                    width: 34, height: 34, borderRadius: '10px',
                    background: `linear-gradient(135deg, ${M} 0%, ${M_LIGHT} 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <PersonOutlineIcon sx={{ color: 'white', fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
                      Patient Information
                    </Typography>
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                      Select from the active queue
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                  <FieldBox label="Select Patient">
                    <Autocomplete
                      options={patients}
                      getOptionLabel={(option) =>
                        `${option.firstName || ''} ${option.lastName || ''}`.trim()
                      }
                      value={selectedPatient}
                      onChange={handlePatientSelect}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                          <Box sx={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${M} 0%, ${M_LIGHT} 100%)`,
                            color: 'white', fontSize: '0.72rem', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {(option.firstName?.[0] || '') + (option.lastName?.[0] || '')}
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#111' }}>
                              {option.firstName} {option.lastName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                              {option.queueNumber && `${option.queueNumber} · `}Age {option.age} · {option.gender || '—'}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={loadingPatients ? 'Loading queue...' : 'Search patients in queue...'}
                          variant="outlined"
                          size="small"
                          sx={modernInput}
                        />
                      )}
                    />
                  </FieldBox>

                  {/* Patient info — enhanced display */}
                  {selectedPatient ? (
                    <Box sx={{
                      borderRadius: '14px',
                      border: '1px solid #fce7eb',
                      background: 'linear-gradient(135deg, #fdf2f4 0%, #fff8f8 100%)',
                      overflow: 'hidden',
                    }}>
                      {/* Patient name row */}
                      <Box sx={{
                        px: 2.5, py: 1.75,
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        borderBottom: '1px solid #fce7eb',
                        background: 'rgba(255,255,255,0.6)',
                      }}>
                        <Box sx={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: '#44000d',
                          color: 'white', fontSize: '0.85rem', fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 8px 25px rgba(68,0,13,0.2)',
                        }}>
                          {(selectedPatient.firstName?.[0] || '') + (selectedPatient.lastName?.[0] || '')}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', lineHeight: 1.2 }}>
                            {selectedPatient.firstName} {selectedPatient.lastName}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: '2px' }}>
                            Patient ID: {selectedPatient.patientId || '—'}
                          </Typography>
                        </Box>
                        <Box sx={{
                          px: 1.5, py: 0.4,
                          borderRadius: '20px',
                          background: selectedPatient.queueStatus === 'CONSULTING' ? '#dcfce7' : '#fef3c7',
                          border: `1px solid ${selectedPatient.queueStatus === 'CONSULTING' ? '#bbf7d0' : '#fde68a'}`,
                        }}>
                          <Typography sx={{
                            fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.5px',
                            color: selectedPatient.queueStatus === 'CONSULTING' ? '#15803d' : '#b45309',
                            textTransform: 'uppercase',
                          }}>
                            {selectedPatient.queueStatus || 'WAITING'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Stats grid — Age, Gender, Contact Number, Address (2x2) */}
                      <Box sx={{
                        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                        px: 2, py: 1.5, gap: 1,
                      }}>
                        {[
                          { label: 'Age', value: selectedPatient.age || '—', Icon: CakeIcon },
                          { label: 'Gender', value: selectedPatient.gender || '—', Icon: WcIcon },
                          { label: 'Contact Number', value: selectedPatient.contactNumber || '—', Icon: PhoneIcon },
                          { label: 'Address', value: selectedPatient.address || '—', Icon: LocationOnIcon },
                        ].map(({ label, value, Icon }) => (
                          <Box key={label} sx={{
                            display: 'flex', alignItems: 'center', gap: 1.25,
                            py: 1, px: 1.5,
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.7)',
                            border: '1px solid #f3e6e8',
                          }}>
                            <Icon sx={{ fontSize: 18, color: M, flexShrink: 0 }} />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: M, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {label}
                              </Typography>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {value}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{
                      p: 2, borderRadius: '10px', textAlign: 'center',
                      background: '#f9fafb', border: '1.5px dashed #e5e7eb',
                    }}>
                      <Typography sx={{ color: '#9ca3af', fontSize: '0.825rem' }}>
                        Select a patient to view their details
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, mt: 3.5, mb: -2 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <FieldBox label="Attending Doctor">
                        <FormControl fullWidth size="small">
                          <Select
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            disabled={!!currentDoctorId}
                            sx={{
                              borderRadius: '10px',
                              fontSize: '0.875rem',
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: M },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: M },
                            }}
                          >
                            {loadingStaff ? (
                              <MenuItem value="">Loading...</MenuItem>
                            ) : (
                              staff.map((person) => (
                                <MenuItem key={person.id} value={person.id}>
                                  {person.name}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                      </FieldBox>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <FieldBox label="Consultation Date">
                        <DatePicker
                          value={consultDate}
                          onChange={(newDate) => setConsultDate(newDate)}
                          slotProps={{
                            textField: {
                              size: 'small', fullWidth: true,
                              sx: modernInput,
                            }
                          }}
                        />
                      </FieldBox>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Consultation Details Card */}
              <Paper elevation={0} sx={{
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(68,0,13,0.12)',
              }}>
                <Box sx={{
                  px: 3, py: 2,
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  background: '#ffffff',
                }}>
                  <Box sx={{
                    width: 34, height: 34, borderRadius: '10px',
                    background: `linear-gradient(135deg, ${M} 0%, ${M_LIGHT} 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <LocalHospitalIcon sx={{ color: 'white', fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
                      Consultation Details
                    </Typography>
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                      Document symptoms, diagnosis, and treatment
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                  <FieldBox label="Symptoms">
                    <TextField
                      multiline rows={3}
                      fullWidth size="small"
                      placeholder="Describe patient symptoms..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      sx={modernInput}
                    />
                  </FieldBox>

                  <FieldBox label="Diagnosis">
                    <TextField
                      fullWidth size="small"
                      placeholder="Enter diagnosis..."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      sx={modernInput}
                    />
                  </FieldBox>

                  <FieldBox label="Medicine Prescribed">
                    <TextField
                      multiline rows={2}
                      fullWidth size="small"
                      placeholder="Medication, dosage, frequency..."
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      sx={modernInput}
                    />
                  </FieldBox>

                  <FieldBox label="Remarks / Clinical Notes">
                    <TextField
                      multiline rows={2}
                      fullWidth size="small"
                      placeholder="Additional notes, follow-up instructions..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      sx={{ ...modernInput, mb: 0 }}
                    />
                  </FieldBox>
                </Box>
              </Paper>
            </Grid>

            {/* ── RIGHT COLUMN ── */}
            <Grid item xs={12} md={5} sx={{ minWidth: { md: '30%' } }}>

              {/* Save Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleSave}
                disabled={saving}
                startIcon={saving ? null : <CheckCircleIcon />}
                sx={{
                  mb: 2.5,
                  borderRadius: '14px',
                  background: saving ? '#9ca3af' : '#44000d',
                  color: 'white',
                  py: 1.4,
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  letterSpacing: '1px',
                  boxShadow: saving ? 'none' : `0 8px 25px rgba(68,0,13,0.3)`,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    background: '#5a0011',
                    boxShadow: `0 12px 32px rgba(68,0,13,0.4)`,
                    transform: 'translateY(-2px)',
                  },
                  '&:active': { transform: 'translateY(0)' },
                }}
              >
                {saving ? 'Saving Consultation...' : 'Save Consultation'}
              </Button>

              {/* Today's Count Card */}
              <Paper elevation={0} sx={{
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                mb: 2.5, overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(68,0,13,0.12)',
              }}>
                <Box sx={{
                  px: 3, py: 2,
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#ffffff',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 34, height: 34, borderRadius: '10px',
                      background: `linear-gradient(135deg, ${M} 0%, ${M_LIGHT} 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <AccessTimeIcon sx={{ color: 'white', fontSize: 18 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
                      Today's Consultations
                    </Typography>
                  </Box>
                  <Box sx={{
                    background: `${M}15`,
                    border: `1px solid ${M}30`,
                    borderRadius: '20px', px: 1.5, py: 0.4,
                  }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: M }}>
                      {todaysConsultations.length} saved
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 2.5 }}>
                  {todaysConsultations.length === 0 ? (
                    <Box sx={{
                      textAlign: 'center', py: 3,
                      background: '#f9fafb', borderRadius: '10px',
                      border: '1.5px dashed #e5e7eb',
                    }}>
                      <HealingIcon sx={{ fontSize: 32, color: '#d1d5db', mb: 0.5 }} />
                      <Typography sx={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 500 }}>
                        No consultations saved yet today
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {todaysConsultations.slice(0, 5).map((c, i) => (
                        <Box key={c.id || i} sx={{
                          display: 'flex', alignItems: 'center', gap: 1.5,
                          p: 1.5, borderRadius: '10px',
                          background: i === 0 ? `${M}08` : '#f9fafb',
                          border: `1px solid ${i === 0 ? `${M}20` : '#f3f4f6'}`,
                        }}>
                          <Box sx={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${M} 0%, ${M_LIGHT} 100%)`,
                            color: 'white', fontSize: '0.7rem', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {c.patientName?.[0] || '?'}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {c.patientName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                              {c.diagnosis}
                            </Typography>
                          </Box>
                          {i === 0 && (
                            <Chip label="Latest" size="small" sx={{
                              height: 20, fontSize: '0.65rem', fontWeight: 700,
                              bgcolor: `${M}15`, color: M, border: `1px solid ${M}30`,
                            }} />
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Paper>

              {/* Past Consultations */}
              <Paper elevation={0} sx={{
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(61,8,11,0.06)',
              }}>
                <Box sx={{
                  px: 3, py: 2,
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#ffffff',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 34, height: 34, borderRadius: '10px',
                      background: `linear-gradient(135deg, ${M} 0%, ${M_LIGHT} 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <GroupIcon sx={{ color: 'white', fontSize: 18 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
                        Past Consultations
                      </Typography>
                      <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                        {selectedPatient
                          ? `${pastConsults.length} record${pastConsults.length !== 1 ? 's' : ''} found`
                          : 'Select a patient first'
                        }
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ p: 2.5 }}>
                  {!selectedPatient ? (
                    <Box sx={{
                      textAlign: 'center', py: 3,
                      background: '#f9fafb', borderRadius: '10px',
                      border: '1.5px dashed #e5e7eb',
                    }}>
                      <Typography sx={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                        Select a patient to view their history
                      </Typography>
                    </Box>
                  ) : pastConsults.length === 0 ? (
                    <Box sx={{
                      textAlign: 'center', py: 3,
                      background: '#f9fafb', borderRadius: '10px',
                      border: '1.5px dashed #e5e7eb',
                    }}>
                      <AssignmentIcon sx={{ fontSize: 32, color: '#d1d5db', mb: 0.5 }} />
                      <Typography sx={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 500 }}>
                        No past consultations for this patient
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {/* Patient name banner */}
                      <Box sx={{
                        p: 1.5, borderRadius: '10px',
                        background: `linear-gradient(135deg, ${M_DARK} 0%, ${M} 100%)`,
                        display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5,
                      }}>
                        <Box sx={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)',
                          color: 'white', fontSize: '0.8rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {(selectedPatient.firstName?.[0] || '') + (selectedPatient.lastName?.[0] || '')}
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>
                            {selectedPatient.firstName} {selectedPatient.lastName}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
                            ID: {selectedPatient.patientId}
                          </Typography>
                        </Box>
                      </Box>

                      {pastConsults.map((consult, index) => (
                        <Box key={index} sx={{
                          display: 'flex', gap: 2,
                          p: 1.5, borderRadius: '10px',
                          border: '1px solid #f3f4f6',
                          background: '#fafafa',
                          transition: 'background 0.15s',
                          '&:hover': { background: `${M}06`, border: `1px solid ${M}20` },
                        }}>
                          {/* Timeline dot */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                            <Box sx={{
                              width: 10, height: 10, borderRadius: '50%',
                              background: index === 0 ? M : '#d1d5db',
                              mt: '4px',
                            }} />
                            {index < pastConsults.length - 1 && (
                              <Box sx={{ width: 1, flex: 1, background: '#e5e7eb', mt: 0.5 }} />
                            )}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: M }}>
                                {consult.doctorName || consult.medicalStaff?.name || consult.doctor || 'Unknown Doctor'}
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                                {consult.consultationDateTime
                                  ? new Date(consult.consultationDateTime).toLocaleDateString()
                                  : consult.date || '—'}
                              </Typography>
                            </Box>
                            {consult.diagnosis && (
                              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {consult.diagnosis}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity={snackbar.severity}
            sx={{
              width: '100%', borderRadius: '12px',
              fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}