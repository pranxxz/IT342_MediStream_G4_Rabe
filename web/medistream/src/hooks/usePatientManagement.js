import { useState, useMemo, useEffect } from "react";
import { patientService } from '../services/patientService'; // Use your service instead of mock data

export const usePatientManagement = () => {
  const [patients, setPatients] = useState([]); // State for real data
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch patients from Backend/Supabase on mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await patientService.getAllPatients();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const isNumberSearch = !isNaN(searchQuery) && searchQuery !== '';
      let matchesSearch = searchQuery === '';
      
      if (searchQuery !== '') {
        if (isNumberSearch) {
          matchesSearch = patient.patientId?.toLowerCase().includes(searchQuery.toLowerCase());
        } else {
          matchesSearch = 
            patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.contactNo?.includes(searchQuery);
        }
      }

      const matchesGender = genderFilter === 'all' || patient.gender === genderFilter;
      return matchesSearch && matchesGender;
    });
  }, [searchQuery, genderFilter, patients]);

  const currentStats = useMemo(() => {
    const totalPatients = filteredPatients.length;
    const malePatients = filteredPatients.filter(p => p.gender === 'Male').length;
    const femalePatients = filteredPatients.filter(p => p.gender === 'Female').length;

    return [
      { id: 1, title: 'Total Patients', stats: totalPatients.toString(), icon: 'people' },
      { id: 2, title: 'Male Patients', stats: malePatients.toString(), icon: 'male', gradient: 'linear-gradient(135deg, #8eb3efff 0%, #1d4ed8 100%)' },
      { id: 3, title: 'Female Patients', stats: femalePatients.toString(), icon: 'female', gradient: 'linear-gradient(135deg, #e891bcff 0%, #db2777 100%)' }
    ];
  }, [filteredPatients]);

  return {
    patientRecords: filteredPatients,
    managementStats: currentStats,
    searchQuery,
    genderFilter,
    loading,
    hasActiveFilters: searchQuery || genderFilter !== 'all',
    handleSearchPatients: setSearchQuery,
    handleFilterRecords: (type, value) => type === 'gender' && setGenderFilter(value),
    clearFilters: () => { setSearchQuery(''); setGenderFilter('all'); },
  };
};