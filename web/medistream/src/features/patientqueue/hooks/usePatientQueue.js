import { useState, useMemo } from 'react';

export const usePatientQueue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');


  const patients = useMemo(() => [
    {
      id: 1,
      initials: "MS",
      name: "Maria Santos",
      age: 45,
      gender: "Female",
      assignedTo: "Dr. Cruz",
      arrivalTime: "08:30 AM",
      status: "Consulting",
      priority: "high"
    },
  ], []);

  const displayPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toString().includes(searchTerm) ||
        patient.initials.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [patients, searchTerm, filterStatus]);

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handleFilter = (status = 'all') => {
    setFilterStatus(status);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  const hasActiveFilters = searchTerm || filterStatus !== 'all';

  return {
    patients,
    displayPatients,
    searchTerm,
    filterStatus,
    hasActiveFilters,
    handleSearch,
    handleFilter,
    handleRefresh,
    clearFilters,
  };
};
