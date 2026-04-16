import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid, // Note: If you fully migrated to Grid v2, this might be imported as Grid2 from '@mui/material/Unstable_Grid2'
  TextField,
  MenuItem,
  Button,
  Autocomplete,
  FormControl,
  Select,
  Snackbar,
  Alert,
  List,
  ListItem
} from '@mui/material';
import API from '../services/api';
import {
  PersonOutline as PersonOutlineIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { Sidebar } from './PatientQueue'; 

const MOCK_DOCTORS = ['Dr. Maria Cruz', 'Dr. John Santos', 'Dr. Anna Reyes'];

const QUICK_TEMPLATES = {
  'Fever / Common Cold': {
    symptoms: 'Fever, cough, runny nose',
    diagnosis: 'Acute upper respiratory infection',
    prescription: 'Paracetamol 500mg, rest, fluids',
    remarks: 'Follow up if fever persists >3 days',
  },
  Headache: {
    symptoms: 'Throbbing headache, nausea, sensitivity to light',
    diagnosis: 'Migraine without aura',
    prescription: 'Ibuprofen 400mg, dark room rest',
    remarks: 'Avoid triggers, consider prophylaxis if frequent',
  },
  Hypertension: {
    symptoms: 'Asymptomatic, elevated BP reading',
    diagnosis: 'Essential hypertension',
    prescription: 'Amlodipine 5mg daily, low sodium diet',
    remarks: 'Monitor BP weekly, return in 1 month',
  },
};

// ---------- Styling Constants ----------
const maroonColor = '#4E0B19'; 

export default function Consultation({ onLogout, activeItem = 'consult', setActiveItem }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Data state
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctor, setDoctor] = useState(''); // This will now store the doctor's ID
  const [consultDate, setConsultDate] = useState(new Date());
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [remarks, setRemarks] = useState('');

  const [todaysConsultations, setTodaysConsultations] = useState([]);

  const applyTemplate = (template) => {
    const data = QUICK_TEMPLATES[template];
    if (data) {
      setSymptoms(data.symptoms);
      setDiagnosis(data.diagnosis);
      setPrescription(data.prescription);
      setRemarks(data.remarks);
      setSnackbar({ open: true, message: `Template "${template}" applied`, severity: 'info' });
    }
  };

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await API.get('/api/patients');
      setPatients(response.data || []);
    } catch (error) {
      console.error('Failed to load patients', error);
      setSnackbar({ open: true, message: 'Unable to load patients', severity: 'error' });
    } finally {
      setLoadingPatients(false);
    }
  };

  const loadConsultations = async () => {
    setLoadingConsultations(true);
    try {
      const response = await API.get('/api/consultations');
      setConsultations(response.data || []);
    } catch (error) {
      console.error('Failed to load consultations', error);
      setSnackbar({ open: true, message: 'Unable to load consultation history', severity: 'error' });
    } finally {
      setLoadingConsultations(false);
    }
  };

  useEffect(() => {
    loadPatients();
    loadConsultations();
  }, []);

  const handleSave = async () => {
    if (!selectedPatient) {
      setSnackbar({ open: true, message: 'Please select a patient', severity: 'error' });
      return;
    }
    if (!doctor) {
      setSnackbar({ open: true, message: 'Please select a doctor', severity: 'error' });
      return;
    }
    if (!diagnosis.trim()) {
      setSnackbar({ open: true, message: 'Please enter a diagnosis', severity: 'error' });
      return;
    }

    const payload = {
      patient: { patientId: selectedPatient.patientId || selectedPatient.id },
      doctorName: doctor, 
      consultationDateTime: consultDate.toISOString(),
      symptoms,
      diagnosis,
      prescription,
      remarks,
      status: 'Completed',
    };

    console.log('Sending payload:', payload);
    console.log('Selected patient:', selectedPatient);
    console.log('All patients:', patients);

    setSaving(true);
    try {
      const response = await API.post('/api/consultations', payload);
      const savedConsult = response.data;

      setConsultations((prev) => [savedConsult, ...prev]);
      setTodaysConsultations((prev) => [
        {
          id: savedConsult.id || Date.now(),
          patientId: savedConsult.patient?.patientId || selectedPatient.patientId || selectedPatient.id,
          patientName: `${savedConsult.patient?.firstName || selectedPatient.firstName || selectedPatient.name} ${savedConsult.patient?.lastName || selectedPatient.lastName || ''}`.trim(),
          doctor: savedConsult.doctorName || doctor,
          date: new Date(savedConsult.consultationDateTime || consultDate).toISOString().split('T')[0],
          diagnosis: savedConsult.diagnosis || diagnosis,
          symptoms: savedConsult.symptoms || symptoms,
          prescription: savedConsult.prescription || prescription,
          remarks: savedConsult.remarks || remarks,
        },
        ...prev,
      ]);

      // Reset form
      setSymptoms('');
      setDiagnosis('');
      setPrescription('');
      setRemarks('');
      setDoctor('');
      setConsultDate(new Date());
      setSelectedPatient(null);
      setSnackbar({ open: true, message: 'Consultation saved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Failed to save consultation', error);
      setSnackbar({ open: true, message: 'Failed to save consultation. Check backend logs.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const pastConsults = useMemo(() => {
    if (!selectedPatient) return [];
    const patientId = selectedPatient.patientId || selectedPatient.id;
    return consultations.filter((c) => c.patient?.patientId === patientId || c.patientId === patientId);
  }, [selectedPatient, consultations]);

  const cardStyle = { 
    borderRadius: 3, 
    border: '1px solid #e0e0e0', 
    boxShadow: 'none', 
    mb: 3,
    overflow: 'hidden'
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ display: "flex", fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", backgroundColor: "#f5f5f7" }}>
        
        {/* REUSED SIDEBAR */}
        <Sidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          onLogout={onLogout}
        />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: 'calc(100% - 210px)'
          }}
        >
          <AppBar position="static" sx={{ bgcolor: 'transparent', boxShadow: 'none', color: maroonColor, pt: 4, px: { xs: 2, md: 5 } }}>
            <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <GroupIcon sx={{ fontSize: 32, display: { xs: 'none', sm: 'block' } }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>Consultation Notes</Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>Document patient consultations and prescriptions</Typography>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4, px: { xs: 2, md: 5 } }}>
            <Grid container spacing={4} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              
              {/* LEFT COLUMN */}
              <Grid xs={12} md={7} sx={{ minWidth: { md: '55%' } }}>
                <Paper sx={{ ...cardStyle, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <PersonOutlineIcon sx={{ color: '#555' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', fontSize: '1.1rem' }}>Patient Information</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Enter or select patient details</Typography>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>Patient Name</Typography>
                  <Autocomplete
                    options={patients}
                    getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || option.name || ''}`.trim()}
                    value={selectedPatient}
                    onChange={(event, newValue) => setSelectedPatient(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label={loadingPatients ? "Loading..." : ""} variant="outlined" size="small" fullWidth sx={{ mb: 3 }} />
                    )}
                  />
                  <Grid container spacing={3}>
                    <Grid xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>Age</Typography>
                      <TextField value={selectedPatient?.age || ''} size="small" InputProps={{ readOnly: true }} fullWidth variant="outlined" />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>Gender</Typography>
                      <TextField value={selectedPatient?.gender || ''} size="small" InputProps={{ readOnly: true }} fullWidth variant="outlined" />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>Doctor</Typography>
                      <FormControl fullWidth size="small">
                        <Select value={doctor} onChange={(e) => setDoctor(e.target.value)}>
                            {MOCK_DOCTORS.map((d) => (
                            <MenuItem key={d} value={d}>{d}</MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>Date</Typography>
                      {/* UPDATED DatePicker (Removed renderInput for MUI v6) */}
                      <DatePicker
                        value={consultDate}
                        onChange={(newDate) => setConsultDate(newDate)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                <Paper sx={{ ...cardStyle, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <PersonOutlineIcon sx={{ color: '#555' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', fontSize: '1.1rem' }}>Consultation Details</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Document symptoms, diagnosis, and treatment</Typography>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>Symptoms</Typography>
                  <TextField multiline rows={2} fullWidth value={symptoms} onChange={(e) => setSymptoms(e.target.value)} sx={{ mb: 3 }} />
                  
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>Diagnosis</Typography>
                  <TextField fullWidth value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} sx={{ mb: 3 }} />
                  
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>Prescription</Typography>
                  <TextField multiline rows={2} fullWidth value={prescription} onChange={(e) => setPrescription(e.target.value)} sx={{ mb: 3 }} />
                  
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>Remarks</Typography>
                  <TextField multiline rows={2} fullWidth value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                </Paper>
              </Grid>

              {/* RIGHT COLUMN */}
              <Grid xs={12} md={5} sx={{ minWidth: { md: '40%' } }}>
                
                <Paper sx={{ ...cardStyle }}>
                  <Box sx={{ p: 2.5, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                     <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', fontSize: '1.1rem' }}>Past Consultations</Typography>
                     <GroupIcon sx={{ color: '#888' }} />
                  </Box>
                  {selectedPatient && pastConsults.length > 0 ? (
                    <>
                      <Box sx={{ bgcolor: maroonColor, color: '#fff', px: 3, py: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                           {`${selectedPatient.firstName || ''} ${selectedPatient.lastName || selectedPatient.name || ''}`.trim()}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>ID: {selectedPatient.patientId || selectedPatient.id}</Typography>
                      </Box>
                      <List sx={{ pt: 0 }}>
                        {pastConsults.map((consult, index) => (
                          <ListItem key={index} divider={index !== pastConsults.length - 1} sx={{ px: 3, py: 2 }}>
                            <Grid container sx={{ width: '100%' }}>
                              <Grid xs={6}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#222' }}>{consult.doctorName || consult.doctor}</Typography>
                              </Grid>
                              <Grid xs={6} sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                  {consult.consultationDateTime ? new Date(consult.consultationDateTime).toISOString().split('T')[0] : consult.date}
                                </Typography>
                              </Grid>
                            </Grid>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  ) : (
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Typography variant="body2" color="text.secondary">No past consultations for this patient.</Typography>
                    </Box>
                  )}
                </Paper>

                <Paper sx={{ ...cardStyle, p: 2.5 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#222', fontSize: '1.1rem', mb: 2 }}>Quick Templates</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {Object.keys(QUICK_TEMPLATES).map((template) => (
                      <Box
                        key={template}
                        onClick={() => applyTemplate(template)}
                        sx={{
                          border: '1px solid #ddd',
                          borderRadius: 1.5,
                          p: 1.5,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#f9f9f9' }
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#444' }}>{template}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                <Paper sx={{ ...cardStyle, p: 2.5, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', fontSize: '1.1rem', textAlign: 'left', mb: 2 }}>Today's Consultations</Typography>
                  <Typography variant="h1" sx={{ fontWeight: 800, color: maroonColor, my: 2 }}>
                    {todaysConsultations.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Consultations saved today</Typography>
                </Paper>

                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: 'lowercase', 
                    color: '#888', 
                    borderColor: '#ccc', 
                    py: 1.5,
                    '&:hover': { borderColor: '#999', bgcolor: '#f5f5f5' }
                  }}
                >
                  {saving ? 'saving...' : 'save button'}
                </Button>
              </Grid>

            </Grid>
          </Container>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </LocalizationProvider>
  );
}