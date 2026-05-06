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
    {
      id: 2,
      initials: "JDC",
      name: "Juan Dela Cruz",
      age: 32,
      gender: "Male",
      assignedTo: "Dr. Cruz",
      arrivalTime: "08:45 AM",
      status: "Waiting",
      priority: "medium"
    },
    {
      id: 3,
      initials: "AR",
      name: "Ana Reyes",
      age: 28,
      gender: "Female",
      assignedTo: "Dr. Cruz",
      arrivalTime: "09:00 AM",
      status: "Completed",
      priority: "low"
    },
    {
      id: 4,
      initials: "PG",
      name: "Pedro Garcia",
      age: 55,
      gender: "Male",
      assignedTo: "Dr. Santos",
      arrivalTime: "09:15 AM",
      status: "Waiting",
      priority: "medium"
    },
    {
      id: 5,
      initials: "RM",
      name: "Rosa Martinez",
      age: 38,
      gender: "Female",
      assignedTo: "Dr. Santos",
      arrivalTime: "09:30 AM",
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
    // Removed: setIsFilterOpen(false);
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