import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Container,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  MedicalServices as StaffIcon,
  Description as ConsultIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// ---------- Sidebar width (match Consultation) ----------
const drawerWidth = 260;

export default function MedicalHistory({ onLogout, activeItem, setActiveItem }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch consultations from backend (replace with your actual API)
  const fetchConsultations = async () => {
    setLoading(true);
    try {
      // --- MOCK API CALL ---
      // Replace this with your real endpoint, e.g.:
      // const response = await fetch('/api/consultations', {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      // const data = await response.json();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data (matches the screenshot example)
      const mockData = [
        { id: 1, patientId: 1, patientName: 'Jungwon Yang', age: 22, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Maria Cruz', diagnosis: 'Hypertension - Stage 2' },
        { id: 2, patientId: 2, patientName: 'Evan Lee', age: 24, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Roberto Santos', diagnosis: 'Acute Asthma Exacerbation' },
        { id: 3, patientId: 3, patientName: 'Jake Sim', age: 23, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Maria Cruz', diagnosis: 'Migraine with Aura' },
        { id: 4, patientId: 4, patientName: 'Jay Park', age: 23, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Roberto Santos', diagnosis: 'Fever' },
        { id: 5, patientId: 5, patientName: 'Sunghoon Park', age: 23, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Maria Cruz', diagnosis: 'Fever' },
        { id: 6, patientId: 6, patientName: 'Sunoo Kim', age: 22, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Maria Cruz', diagnosis: 'Acute Asthma Exacerbation' },
        { id: 7, patientId: 7, patientName: 'Riki Nishimura', age: 20, dateTime: '2025-01-05 09:30 AM', doctor: 'Dr. Maria Cruz', diagnosis: 'Migraine with Aura' },
      ];
      
      setConsultations(mockData);
      setFilteredConsultations(mockData);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load consultation history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // Filter consultations based on search term
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    if (!term) {
      setFilteredConsultations(consultations);
    } else {
      const filtered = consultations.filter(
        (c) =>
          c.patientName.toLowerCase().includes(term) ||
          c.doctor.toLowerCase().includes(term) ||
          c.diagnosis.toLowerCase().includes(term)
      );
      setFilteredConsultations(filtered);
    }
    setPage(0); // reset to first page when search changes
  }, [searchTerm, consultations]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { key: 'queue', label: 'Patient Queue', icon: <PeopleIcon /> },
    { key: 'patients', label: 'Patients', icon: <PeopleIcon /> },
    { key: 'staff', label: 'Medical Staff', icon: <StaffIcon /> },
    { key: 'consult', label: 'Consultation', icon: <ConsultIcon /> },
    { key: 'history', label: 'Medical History', icon: <HistoryIcon /> },
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#44000D' }}>
          MediStream
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={activeItem === item.key}
              onClick={() => setActiveItem(item.key)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#44000D20',
                  borderRight: `3px solid #44000D`,
                },
                '&:hover': { backgroundColor: '#44000D10' },
              }}
            >
              <ListItemIcon sx={{ color: activeItem === item.key ? '#44000D' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={onLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar for mobile */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#fff',
          color: '#44000D',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            Medical History
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 0 },
          bgcolor: '#f5f5f7',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a1a2e', mb: 1 }}>
            Medical History
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            View past consultations and patient records
          </Typography>

          <Paper sx={{ p: 3 }} elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#44000D' }}>
                Consultation History
              </Typography>
              <TextField
                placeholder="Search patients, doctor, diagnosis..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: { xs: '100%', sm: 300 } }}
              />
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#44000D' }} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {filteredConsultations.length} {filteredConsultations.length === 1 ? 'patient found' : 'patients found'}
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell width={50}>#</TableCell>
                        <TableCell>PATIENT</TableCell>
                        <TableCell>AGE</TableCell>
                        <TableCell>DATE & TIME</TableCell>
                        <TableCell>DOCTOR</TableCell>
                        <TableCell>DIAGNOSIS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredConsultations
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((consult, index) => (
                          <TableRow key={consult.id} hover>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>
                              {consult.patientName} <Chip label={`ID: ${consult.patientId}`} size="small" variant="outlined" sx={{ ml: 1 }} />
                            </TableCell>
                            <TableCell>{consult.age}</TableCell>
                            <TableCell>{consult.dateTime}</TableCell>
                            <TableCell>{consult.doctor}</TableCell>
                            <TableCell>{consult.diagnosis}</TableCell>
                          </TableRow>
                        ))}
                      {filteredConsultations.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No consultations found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredConsultations.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                />
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}