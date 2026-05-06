import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Chip,
  Typography,
  Avatar,
  Stack,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';

import {
  People,
  Schedule,
  MedicalServices,
  CheckCircle,
  Refresh,
  LocalHospital,
  FilterList
} from '@mui/icons-material';

// Assuming your custom components are in a folder named 'components'
// Adjust the path if they are in '../lib' or elsewhere based on your project structure
import {
  StatCard,
  StatTitle,
  StatNumber,
  SubText,
  StatIcon,
  HeaderPaper,
  HeaderTitle,
  HeaderSubText,
  Caption,
  SubCaption
} from "../components";

// --- HELPER FUNCTIONS ---
const getStatusColor = (status) => {
  switch (status) {
    case 'WAITING': return '#f59e0b';
    case 'CONSULTING': return '#8b5cf6'; // Purple for consulting
    case 'COMPLETED': return '#10b981';
    default: return '#6b7280';
  }
};

const getStatusBgColor = (status) => {
  switch (status) {
    case 'WAITING': return '#fef3c7';
    case 'CONSULTING': return '#ede9fe';
    case 'COMPLETED': return '#d1fae5';
    default: return '#f3f4f6';
  }
};

// --- MAIN COMPONENT ---
const QueueDashboard = () => {
  const location = useLocation();
  const [queueList, setQueueList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const isFilterOpen = Boolean(filterAnchorEl);

  // Data passed from the QueueModal
  const myQueueData = location.state || {}; 

  const fetchQueueData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/queue');
      if (response.ok) {
        const data = await response.json();
        setQueueList(data);
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- FILTERING LOGIC ---
  const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    handleFilterClose();
  };

  // Filter the list based on Search Term AND Status
  const filteredQueue = queueList.filter((item) => {
    const fullName = `${item.patient?.firstName} ${item.patient?.lastName}`.toLowerCase();
    const doctorName = (item.assignedDoctor || '').toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) || 
      doctorName.includes(searchTerm.toLowerCase()) ||
      item.queueNumber?.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // --- STATS CALCULATION ---
  const stats = {
    total: queueList.length,
    waiting: queueList.filter(q => q.status === 'WAITING').length,
    consulting: queueList.filter(q => q.status === 'CONSULTING').length,
    completed: queueList.filter(q => q.status === 'COMPLETED').length,
  };

  const patientStats = [
    { id: 1, title: 'Total Patients', value: stats.total, subText: 'Registered today', color: '#6366f1', icon: People },
    { id: 2, title: 'Waiting', value: stats.waiting, subText: 'In queue', color: '#f59e0b', icon: Schedule },
    { id: 3, title: 'Consulting', value: stats.consulting, subText: 'In progress', color: '#8b5cf6', icon: MedicalServices },
    { id: 4, title: 'Completed', value: stats.completed, subText: 'Discharged', color: '#10b981', icon: CheckCircle },
  ];

  // Logic for "Now Consulting"
  const currentServing = queueList.find(q => q.status === 'CONSULTING') || queueList.find(q => q.status === 'WAITING');
  const servingNumber = currentServing ? currentServing.queueNumber : '--';


  return (
    <Box sx={{ minHeight: '100vh', background: '#f9fafb', fontFamily: '"Arimo", sans-serif' }}>
      
      {/* --- HEADER --- */}
      <HeaderPaper>
        <Box display="flex" justifyContent="space-between" alignItems="center" maxWidth="1400px" mx="auto">
          <Box display="flex" alignItems="center" gap={2}>
            <LocalHospital sx={{ 
              fontSize: 40, 
              color: 'white',
              background: '#4B0082', 
              borderRadius: '8px',
              p: 1.3,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} />
            <Box>
              <HeaderTitle>Patient Queue</HeaderTitle>
              <HeaderSubText>Real-time patient monitoring | {new Date().toLocaleDateString()}</HeaderSubText>
            </Box>
          </Box>
          
          <Box display="flex" gap={2}>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: '1px solid #e5e7eb',
                outline: 'none',
                padding: '8px 16px',
                fontSize: '0.875rem',
                borderRadius: '8px',
                width: '280px',
                backgroundColor: 'white',
              }}
            />
             <Button 
                variant="contained" 
                startIcon={<Refresh />} 
                onClick={fetchQueueData}
                sx={{ background: '#4B0082', '&:hover': { background: '#5a67d8' }, textTransform: 'none' }}
             >
              Refresh
            </Button>
          </Box>
        </Box>
      </HeaderPaper>

      <Box sx={{ maxWidth: '1400px', mx: 'auto', p: 4 }}>
        
        {/* --- STATS GRID --- */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
          {patientStats.map((stat) => (
            <StatCardItem key={stat.id} stat={stat} />
          ))}
        </Box>

        {/* --- YOUR NUMBER & SERVING (Custom Requirement) --- */}
        <QueueNumber 
            myNumber={myQueueData.queueNumber || "N/A"} 
            servingNumber={servingNumber} 
        />
        
        {/* --- PATIENT LIST CARD (New Layout) --- */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          
          {/* Card Header & Filter */}
          <Box sx={{ p: 3, borderBottom: "1px solid #e5e7eb" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
                  Patient Queue
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  {filteredQueue.length} patient{filteredQueue.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
              <Button
                startIcon={<FilterList />}
                variant="outlined"
                size="small"
                onClick={handleFilterClick}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  borderColor: '#e5e7eb',
                  color: '#374151',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#d1d5db', background: '#f9fafb' }
                }}
              >
                {filterStatus !== 'all' ? filterStatus : 'All Status'}
              </Button>
            </Box>
          </Box>

          {/* Filter Menu Dropdown */}
          <Menu
            anchorEl={filterAnchorEl}
            open={isFilterOpen}
            onClose={handleFilterClose}
            PaperProps={{ sx: { mt: 1, minWidth: 150 } }}
          >
            <MenuItem onClick={() => handleStatusFilter('all')}>All Status</MenuItem>
            <MenuItem onClick={() => handleStatusFilter('WAITING')}>Waiting</MenuItem>
            <MenuItem onClick={() => handleStatusFilter('CONSULTING')}>Consulting</MenuItem>
            <MenuItem onClick={() => handleStatusFilter('COMPLETED')}>Completed</MenuItem>
          </Menu>

          {/* Table Header Row */}
          <Box sx={{ px: 3, py: 2, background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <Box display="grid" gridTemplateColumns="60px 2fr 1fr 1.5fr 1.5fr 1fr 60px" gap={2} alignItems="center">
              <SubCaption>#</SubCaption>
              <SubCaption>PATIENT</SubCaption>
              <SubCaption>AGE</SubCaption>
              <SubCaption>STATUS</SubCaption>
              <SubCaption>DOCTOR</SubCaption>
              <SubCaption>TIME</SubCaption>
              <Box />
            </Box>
          </Box>

          {/* Table Rows (Mapped Data) */}
          <Box>
            {filteredQueue.length > 0 ? (
              filteredQueue.map((queueItem, index) => (
                <PatientRow key={queueItem.id} queueItem={queueItem} index={index} />
              ))
            ) : (
               <Box sx={{ textAlign: 'center', py: 8 }}>
                 <Typography variant="body1" sx={{ color: '#6b7280' }}>
                   No patients found
                 </Typography>
               </Box>
            )}
          </Box>
        </Card>

      </Box>
    </Box>
  );
};

// --- SUB-COMPONENTS ---

const StatCardItem = ({ stat }) => {
    const IconComponent = stat.icon;
    return (
      <StatCard>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <StatTitle>{stat.title}</StatTitle>
              <StatNumber sx={{color: stat.color}}>{stat.value}</StatNumber>
              <SubText>{stat.subText}</SubText>
            </Box>
            <StatIcon sx={{ background: 'transparent' }}>
              <IconComponent sx={{ fontSize: 38, color: stat.color }} />
            </StatIcon>
          </Box>
        </CardContent>
      </StatCard>
    );
};

const QueueNumber = ({ myNumber, servingNumber }) => {
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #4B0082 0%, #764ba2 100%)',
      borderRadius: 3,
      boxShadow: '0 4px 25px rgba(0,0,0,0.08)',
      p: 0,
      mb: 4,
      overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <StatNumber sx={{ fontSize: "44px", color:"white"}}>{myNumber}</StatNumber>
              <StatTitle sx={{ mt:1, color:"white", opacity: 0.9}}>Your Number</StatTitle>
            </Box>

            <Box sx={{ width: '1px', height: '80px', background: 'rgba(255,255,255,0.2)' }} />

            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <StatNumber sx={{ fontSize: "44px", color:"white" }}>{servingNumber}</StatNumber>
              <StatTitle sx={{ mt:1, color:"white", opacity: 0.9 }}>Now Serving</StatTitle>
            </Box>
          </Box>
        </CardContent>
    </Box>
  );
};

const PatientRow = ({ queueItem, index }) => {
  const { patient, status, queueNumber, assignedDoctor, arrivalTime } = queueItem;
  const initials = (patient?.firstName?.[0] || '') + (patient?.lastName?.[0] || '');
  const fullName = `${patient?.firstName} ${patient?.lastName}`;

  return (
    <Box sx={{ 
        px: 3, 
        py: 2.5, 
        borderBottom: '1px solid #f3f4f6',
        '&:hover': { background: '#f9fafb' },
        transition: 'background 0.2s'
      }}>
      <Box display="grid" gridTemplateColumns="60px 2fr 1fr 1.5fr 1.5fr 1fr 60px" gap={2} alignItems="center">
        {/* 1. Queue Number / Index */}
        <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>{queueNumber}</Typography>
        
        {/* 2. Patient Info */}
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ width: 40, height: 40, background: '#4B0082', fontWeight: 700, fontSize: '0.875rem' }}>
            {initials}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
              {fullName}
            </Typography>
            <Caption>ID: {patient?.patientId}</Caption>
          </Box>
        </Box>
        
        {/* 3. Age */}
        <Typography variant="body2" sx={{ color: '#374151' }}>{patient?.age} yrs</Typography>
        
        {/* 4. Status */}
        <Box>
          <Chip 
            label={status} 
            size="small"
            sx={{ 
              backgroundColor: getStatusBgColor(status), 
              color: getStatusColor(status), 
              fontWeight: 600, 
              fontSize: '0.75rem',
              height: '24px',
              borderRadius: '6px',
            }} 
          />
        </Box>
        
        {/* 5. Assigned Doctor (New Field) */}
        <Typography variant="body2" sx={{ color: '#4B0082', fontWeight: 500 }}>
             {assignedDoctor || "Unassigned"}
        </Typography>

        {/* 6. Arrival Time (New Field) */}
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
            {arrivalTime || "--:--"}
        </Typography>
        
      </Box>
    </Box>
  );
};

export default QueueDashboard;