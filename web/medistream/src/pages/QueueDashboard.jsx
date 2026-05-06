import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  Chip,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import {
  People,
  Schedule,
  MedicalServices,
  CheckCircle,
} from '@mui/icons-material';

// ─── Color tokens ─────────────────────────────────────────────────────────────
const MAROON      = '#660013';
const MAROON_DARK = '#44000d';
const MAROON_LIGHT = '#7a0017';

// ─── Status helpers ───────────────────────────────────────────────────────────
const getStatusStyle = (status) => {
  switch (status) {
    case 'CONSULTING':
      return {
        color: '#b91c1c',
        bgcolor: '#fee2e2',
        border: '1px solid #fca5a5',
      };
    case 'WAITING':
      return {
        color: '#6b7280',
        bgcolor: '#f3f4f6',
        border: '1px solid #d1d5db',
      };
    case 'COMPLETED':
      return {
        color: '#059669',
        bgcolor: '#d1fae5',
        border: '1px solid #6ee7b7',
      };
    default:
      return {
        color: '#6b7280',
        bgcolor: '#f3f4f6',
        border: '1px solid #d1d5db',
      };
  }
};

// ─── Main Component ────────────────────────────────────────────────────────────
const QueueDashboard = () => {
  const location = useLocation();
  const [queueList, setQueueList] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching queue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Stats
  const stats = {
    total:     queueList.length,
    waiting:   queueList.filter(q => q.status === 'WAITING').length,
    consulting: queueList.filter(q => q.status === 'CONSULTING').length,
    completed: queueList.filter(q => q.status === 'COMPLETED').length,
  };

  const currentServing =
    queueList.find(q => q.status === 'CONSULTING') ||
    queueList.find(q => q.status === 'WAITING');
  const servingNumber = currentServing ? currentServing.queueNumber : '--';

  return (
    // Outer dark maroon background
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: MAROON_DARK,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        fontFamily: '"Inter", "Helvetica Neue", sans-serif',
      }}
    >
      {/* White rounded wrapper card */}
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 4,
          width: '100%',
          maxWidth: 1100,
          p: { xs: 3, md: 4 },
          boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
        }}
      >
        {/* ── Brand header ─────────────────────────────────────────────── */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'rgba(68,0,13,0.08)',
              border: '1.5px solid rgba(68,0,13,0.15)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/logo (2).png"
              alt="MediStream"
              style={{ width: '65%', height: '65%', objectFit: 'contain' }}
            />
          </Box>
          <Typography
            fontWeight={800}
            sx={{ color: MAROON_DARK, fontSize: '1.15rem', letterSpacing: 0.2 }}
          >
            MediStream
          </Typography>
        </Stack>

        {/* ── Stats row ────────────────────────────────────────────────── */}
        <Box
          sx={{
            border: `1.5px solid rgba(68,0,13,0.15)`,
            borderRadius: 3,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            mb: 3,
            overflow: 'hidden',
          }}
        >
          {[
            { label: 'Total Patients', value: stats.total,     Icon: People         },
            { label: 'Waiting',        value: stats.waiting,   Icon: Schedule       },
            { label: 'Consulting',     value: stats.consulting, Icon: MedicalServices },
            { label: 'Completed',      value: stats.completed, Icon: CheckCircle    },
          ].map(({ label, value, Icon }, i, arr) => (
            <Box
              key={label}
              sx={{
                py: 3,
                px: 2,
                textAlign: 'center',
                borderRight: i < arr.length - 1 ? `1px solid rgba(68,0,13,0.12)` : 'none',
              }}
            >
              <Typography
                sx={{
                  fontSize: '2.6rem',
                  fontWeight: 900,
                  color: MAROON_DARK,
                  lineHeight: 1,
                  mb: 1.5,
                }}
              >
                {value}
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.75}>
                <Typography
                  sx={{ fontWeight: 700, color: MAROON_DARK, fontSize: '0.85rem' }}
                >
                  {label}
                </Typography>
                <Icon sx={{ fontSize: 18, color: MAROON_DARK }} />
              </Stack>
            </Box>
          ))}
        </Box>

        {/* ── Your Number / Now Serving ─────────────────────────────────── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            mb: 3,
          }}
        >
          {[
            { label: 'Your Number', value: myQueueData.queueNumber || 'N/A' },
            { label: 'Now Serving', value: servingNumber },
          ].map(({ label, value }) => (
            <Box
              key={label}
              sx={{
                bgcolor: MAROON_DARK,
                borderRadius: 3,
                py: 4,
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '3.5rem',
                  fontWeight: 900,
                  color: 'white',
                  lineHeight: 1,
                  mb: 1.5,
                }}
              >
                {value}
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  letterSpacing: 0.3,
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* ── Patient Queue table ───────────────────────────────────────── */}
        <Box
          sx={{
            border: '1.5px solid rgba(68,0,13,0.12)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Table title */}
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Typography fontWeight={800} sx={{ color: MAROON_DARK, fontSize: '1.1rem' }}>
              Patient Queue
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.25 }}>
              {queueList.length} patient{queueList.length !== 1 ? 's' : ''} in queue
            </Typography>
          </Box>

          {/* Column headers */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '60px 2fr 80px 140px 160px 100px',
              px: 3,
              py: 1.5,
              bgcolor: '#f9fafb',
              borderTop: '1px solid rgba(68,0,13,0.08)',
              borderBottom: '1px solid rgba(68,0,13,0.08)',
            }}
          >
            {['#', 'PATIENT', 'AGE', 'STATUS', 'DOCTOR', 'TIME'].map((h) => (
              <Typography
                key={h}
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: MAROON_DARK,
                  letterSpacing: 0.8,
                }}
              >
                {h}
              </Typography>
            ))}
          </Box>

          {/* Rows */}
          {queueList.length > 0 ? (
            queueList.map((item) => (
              <PatientRow key={item.id} item={item} />
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ color: '#9ca3af' }}>No patients found</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// ─── Patient row ──────────────────────────────────────────────────────────────
const PatientRow = ({ item }) => {
  const { patient, status, queueNumber, assignedDoctor, arrivalTime } = item;
  const initials =
    (patient?.firstName?.[0] || '') + (patient?.lastName?.[0] || '');
  const fullName = `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim();
  const statusStyle = getStatusStyle(status);
  const label = status
    ? status.charAt(0) + status.slice(1).toLowerCase()
    : '--';

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '60px 2fr 80px 140px 160px 100px',
        px: 3,
        py: 2.5,
        borderBottom: '1px solid #f3f4f6',
        alignItems: 'center',
        '&:last-child': { borderBottom: 'none' },
        '&:hover': { bgcolor: '#fafafa' },
        transition: 'background 0.15s',
      }}
    >
      {/* # */}
      <Typography sx={{ color: '#6b7280', fontWeight: 600, fontSize: '0.875rem' }}>
        {queueNumber}
      </Typography>

      {/* Patient */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: MAROON_DARK,
            fontSize: '0.78rem',
            fontWeight: 700,
          }}
        >
          {initials}
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#1f2937', fontSize: '0.875rem' }}>
            {fullName}
          </Typography>
          <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            ID: {patient?.patientId}
          </Typography>
        </Box>
      </Stack>

      {/* Age */}
      <Typography sx={{ color: '#374151', fontSize: '0.875rem' }}>
        {patient?.age}
      </Typography>

      {/* Status */}
      <Chip
        label={label}
        size="small"
        sx={{
          ...statusStyle,
          fontWeight: 700,
          fontSize: '0.75rem',
          height: 26,
          borderRadius: '20px',
          width: 'fit-content',
        }}
      />

      {/* Doctor */}
      <Typography sx={{ color: MAROON_DARK, fontWeight: 700, fontSize: '0.875rem' }}>
        {assignedDoctor || 'Unassigned'}
      </Typography>

      {/* Time */}
      <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
        {arrivalTime || '--:--'}
      </Typography>
    </Box>
  );
};

export default QueueDashboard;