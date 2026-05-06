import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout, { ProtectedRoute } from './components';
import LandingPage from './pages/Landing.jsx';
import PatientPage from './pages/Patient.jsx';
import Consultation from './pages/Consultations.jsx';
import RegisterPage from './pages/Register.jsx';
import LoginPage from './pages/Login.jsx';  
import MedicalHistory from './pages/MedicalHistory.jsx';
import PatientQueue from './pages/PatientQueue.jsx';
import Staff from './pages/Staff.jsx';
import GeneralSettings from './pages/GeneralSettings.jsx';
import QueueDashboard from './pages/QueueDashboard.jsx';
import OAuthCallback from './pages/OAuthCallback.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="Patient" element={<PatientPage />} />
        <Route path="Consultations" element={<Consultation />} />
        <Route path="MedicalHistory" element={<MedicalHistory />} />
        <Route path="PatientQueue" element={<PatientQueue />} />
        <Route path="Staff" element={<Staff />} /> 
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