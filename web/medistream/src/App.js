import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout';
import LandingPage from './shared/pages/Landing.jsx';
import ProtectedRoute from './shared/components/ProtectedRoute';
import RoleBasedRoute from './shared/components/RoleBasedRoute';
import PatientPage from './features/patient/pages/Patient.jsx';
import Consultation from './features/consultation/pages/Consultations.jsx';
import RegisterPage from './features/authentication/pages/Register'
import LoginPage from './features/authentication/pages/Login.jsx';  
import MedicalHistory from './features/consultation/pages/MedicalHistory.jsx';
import PatientQueue from './features/patientqueue/pages/PatientQueue.jsx';
import Staff from './features/medicalstaff/pages/Staff.jsx';
import GeneralSettings from './shared/pages/GeneralSettings';
import QueueDashboard from './features/patientqueue/pages/QueueDashboard.jsx';
import OAuthCallback from './features/authentication/pages/OAuthCallback.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="Patient" element={
          <RoleBasedRoute requiredRoles={['nurse', 'staff', 'doctor', 'admin']}>
            <PatientPage />
          </RoleBasedRoute>
        } />
        <Route path="Consultations" element={
          <RoleBasedRoute requiredRoles={['doctor', 'admin']}>
            <Consultation />
          </RoleBasedRoute>
        } />
        <Route path="MedicalHistory" element={
          <RoleBasedRoute requiredRoles={['nurse', 'staff', 'doctor', 'admin']}>
            <MedicalHistory />
          </RoleBasedRoute>
        } />
        <Route path="PatientQueue" element={
          <RoleBasedRoute requiredRoles={['nurse', 'staff', 'doctor', 'admin']}>
            <PatientQueue />
          </RoleBasedRoute>
        } />
        <Route path="Staff" element={
          <RoleBasedRoute requiredRoles={['nurse', 'staff', 'doctor', 'admin']}>
            <Staff />
          </RoleBasedRoute>
        } /> 
      </Route>

      <Route path="general-settings" element={<ProtectedRoute><GeneralSettings /></ProtectedRoute>} />

      <Route index element={<LandingPage />} />
      <Route path="/Register" element={<RegisterPage />} />
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/QueueDashboard" element={<QueueDashboard />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
    </Routes>
  );
}

export default App;