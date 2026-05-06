import { useState, useMemo, useEffect } from "react";
import { consultationService } from "../services/consultationService";

export const usePatientHistory = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await consultationService.getAllConsultations();

      const formattedData = data.map(item => {
        // Handle timezone offset issue with date
        let displayDate = item.consultationDate;
        if (displayDate) {
          // If it's a string date, ensure it displays correctly without timezone offset
          const date = new Date(displayDate + 'T00:00:00'); // Add time to avoid UTC conversion
          displayDate = date.toISOString().split('T')[0];
        }
        
        return {
          id: item.consultationID, 
          
          patientName: item.patient 
            ? `${item.patient.firstName} ${item.patient.lastName}` 
            : "Unknown Patient",
            
          gender: item.patient ? item.patient.gender : "N/A",
          age: item.patient ? item.patient.age : "N/A",
          
          date: displayDate || item.consultationDate,
          time: "10:00 AM",
          doctor: item.medicalStaff ? item.medicalStaff.name : "Unknown",         
          diagnosis: item.diagnosis,
          symptoms: item.symptoms || "",      
          prescription: item.medicinePrescribed || "",
          remarks: item.remarks || ""
        };
      });

      const sortedData = formattedData.sort((a, b) => b.id - a.id);
      
      setConsultations(sortedData);
      setError(null);
    } catch (error) {
      console.error("Failed to load history", error);
      setError("Failed to fetch consultations");
    } finally {
      setLoading(false);
    }
  };

  // Run fetch once on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredConsultations = useMemo(() => {
    return consultations.filter(consultation => {
      const isPureNumber = /^\d+$/.test(searchQuery);
      
      let matchesSearch = searchQuery === '';
      
      if (searchQuery !== '') {
        if (isPureNumber) {
          const searchId = parseInt(searchQuery, 10);
          matchesSearch = consultation.id === searchId;
        } else {
          matchesSearch = 
            (consultation.patientName && consultation.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (consultation.doctor && consultation.doctor.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (consultation.diagnosis && consultation.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()));
        }
      }

      const matchesDoctor = doctorFilter === 'all' || consultation.doctor === doctorFilter;
      
      let matchesDate = true;
      if (dateFilter !== '') {
        if (!consultation.date) {
          matchesDate = false;
        } else if (dateFilter === 'thisWeek') {
          const consultationDate = new Date(consultation.date);
          const today = new Date();
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(today.getDate() - 7);
          matchesDate = consultationDate >= oneWeekAgo && consultationDate <= today;
        } else if (dateFilter === 'thisMonth') {
          const consultationDate = new Date(consultation.date);
          const today = new Date();
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          matchesDate = consultationDate >= firstDayOfMonth && consultationDate <= today;
        } else {
          // Specific date format (YYYY-MM-DD)
          matchesDate = consultation.date === dateFilter;
        }
      }

      return matchesSearch && matchesDoctor && matchesDate;
    });
  }, [searchQuery, doctorFilter, dateFilter, consultations]);

  const patientStats = useMemo(() => {
    const totalVisits = filteredConsultations.length;
    
    const thisWeek = filteredConsultations.filter(c => {
      if (!c.date) return false;
      const consultationDate = new Date(c.date);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return consultationDate >= oneWeekAgo;
    }).length;
    
    const uniquePatients = new Set(filteredConsultations.map(c => c.patientName)).size;

    return [
      {
        id: 1,
        title: 'Total Visits',
        value: consultations.length,
        subText: 'All consultations',
        icon: 'history',
        borderColor: 'rgba(102, 126, 234, 0.1)',
        hoverShadow: 'rgba(102, 126, 234, 0.15)'
      },
      {
        id: 2,
        title: 'This Week',
        value: thisWeek,
        subText: 'Recent consultations',
        icon: 'schedule',
        borderColor: 'rgba(237, 108, 2, 0.1)',
        hoverShadow: 'rgba(237, 108, 2, 0.15)'
      },
      {
        id: 3,
        title: 'Unique Patients',
        value: uniquePatients,
        subText: 'Individual patients',
        icon: 'people',
        borderColor: 'rgba(46, 125, 50, 0.1)',
        hoverShadow: 'rgba(46, 125, 50, 0.15)'
      }
    ];
  }, [filteredConsultations, consultations.length]); // Fixed dependency

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
  };

  const handleDoctorFilter = (doctor) => {
    setDoctorFilter(doctor);
  };

  const handleDateFilter = (date) => {
    setDateFilter(date);
  };

  const handleRefresh = () => {
    console.log("Refreshing data...");
    fetchHistory(); 
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDoctorFilter('all');
    setDateFilter('');
  };

  const hasActiveFilters = searchQuery || doctorFilter !== 'all' || dateFilter !== '';

  return {
    consultations: filteredConsultations,
    patientStats,
    searchQuery,
    doctorFilter,
    dateFilter,
    loading, 
    error,
    hasActiveFilters,
    handleSearch,
    handleDoctorFilter,
    handleDateFilter,
    handleRefresh,
    clearFilters
  };
};