// src/lib/index.js - COMPLETE version for all pages

// FIRST: Import all icons and components at the TOP
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// MUI Core (for Patient.jsx + Consultations.jsx + PatientHistory.jsx)
export { 
  Box,       
  Typography,
  Stack,
  Paper,
  Chip,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Grid,        
  styled,
  Button,
  TextField,
  Select,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu
} from "@mui/material";

// MUI Icons (for Patient.jsx)
export { default as Add } from '@mui/icons-material/Add';
export { default as People } from '@mui/icons-material/People';
export { default as Female } from '@mui/icons-material/Female';
export { default as Male } from '@mui/icons-material/Male';
export { default as MoreVert } from '@mui/icons-material/MoreVert';

// MUI Icons (for Consultations.jsx)
export { default as AddIcon } from '@mui/icons-material/Add';
export { default as PeopleAltOutlinedIcon } from '@mui/icons-material/PeopleAltOutlined';
export { default as EditCalendarOutlinedIcon } from '@mui/icons-material/EditCalendarOutlined';
export { default as LocalHospitalOutlinedIcon } from '@mui/icons-material/LocalHospitalOutlined';

// MUI Icons (for PatientHistory.jsx)
export { default as Visibility } from '@mui/icons-material/Visibility';
export { default as CalendarToday } from '@mui/icons-material/CalendarToday';
export { default as Schedule } from '@mui/icons-material/Schedule';
export { default as Person } from '@mui/icons-material/Person';
export { default as FilterList } from '@mui/icons-material/FilterList';
export { default as Refresh } from '@mui/icons-material/Refresh';
export { default as History } from '@mui/icons-material/History';
export { default as Edit } from '@mui/icons-material/Edit';
export { default as Delete } from '@mui/icons-material/Delete';

// MUI Icons (for PatientQueue.jsx)
export { default as MedicalServices } from '@mui/icons-material/MedicalServices';
export { default as CheckCircle } from '@mui/icons-material/CheckCircle';

// React Icons (for all pages)
export { FaUsers } from 'react-icons/fa';
export { FaNotesMedical } from 'react-icons/fa';
export { FaClipboardList } from 'react-icons/fa';
export { MdQueue } from 'react-icons/md';
export { FaUserMd } from 'react-icons/fa';

// MUI Date Pickers (for Consultations.jsx)
export { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
export { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Utilities
export { default as dayjs } from 'dayjs';

// MUI Components
export { Clear } from "@mui/icons-material";