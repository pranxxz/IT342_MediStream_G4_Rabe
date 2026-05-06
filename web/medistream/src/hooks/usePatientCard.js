export const getStatusColor = (status) => {
  switch (status) {
    case 'Consulting': return '#667eea';
    case 'Waiting': return '#ed6c02';
    case 'Completed': return '#2e7d32';
    default: return '#6b7280';
  }
};

export const getStatusBgColor = (status) => {
  switch (status) {
    case 'Consulting': return '#e8eaf6';
    case 'Waiting': return '#fff3e0';
    case 'Completed': return '#e8f5e9';
    default: return '#f5f5f5';
  }
};

export const usePatientCard = (patient) => {
  const handleViewDetails = () => {
    // console.log("Viewing details for patient:", patient.id);
  };

  const handleMoreActions = () => {
    // console.log("More actions for patient:", patient.id);
  };

  return {
    statusColor: getStatusColor(patient.status),
    statusBgColor: getStatusBgColor(patient.status),
    handleViewDetails,
    handleMoreActions
  };
};