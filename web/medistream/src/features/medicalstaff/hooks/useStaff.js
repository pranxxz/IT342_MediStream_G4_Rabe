// hooks/useStaff.js
import { useState, useEffect, useMemo } from "react";
import API from '../../../shared/services/api';

export const useStaff = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- TEMPORARY CLEANUP: RUN ONCE THEN REMOVE ---
  useEffect(() => {
    // This checks if the sensitive data still exists from previous runs and deletes it
    if (localStorage.getItem('medicalStaffData') || localStorage.getItem('staffList')) {
      // console.log('🧹 Security Cleanup: Removing sensitive staff data from LocalStorage...');
      localStorage.removeItem('medicalStaffData');
      localStorage.removeItem('staffList');
    }
  }, []);
  // -----------------------------------------------

  // Fetch staff data from backend
  const fetchStaffData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching staff data from backend...');
      const response = await API.get('/api/medicalstaff/all');
      const data = response.data || [];
      // console.log('✅ Staff data received:', data);  
      
      // Map API data to staff format (excluding admin roles)
      const mappedStaff = data
        .filter(staff => {
          const role = (staff.role || '').toLowerCase();
          return role !== 'admin' && role !== 'administrator';
        })
        .map(staff => {
        // Get email from userAccount relation
        const email = staff.userAccount?.username || '';
        
        // Get availability from database (default to 'Available' if null)
        const availability = staff.availability || 'Available';
        
        // Map availability to status for backward compatibility
        let status = availability;
        if (availability === 'offline') {
          status = 'Off Duty'; 
        }
        
        return {
          id: staff.staffID,
          name: staff.name,
          role: staff.role,
          specialty: staff.specialty || 'Not specified',
          email: email,
          contact: staff.contactNo || 'No contact',
          status: status, 
          availability: availability,
          department: staff.department || 'General Medicine',
          age: staff.age,
          gender: staff.gender,
          accountID: staff.userAccount?.accountID,
          // Removed _raw to save memory
        };
      });
      
      setStaffMembers(mappedStaff);
      
      // ❌ REMOVED: localStorage.setItem(...) - This was the security risk
      
    } catch (err) {
      console.error('❌ Error fetching staff data:', err);
      setError('Failed to load staff data. Please try again.');
      setStaffMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchStaffData();
  }, []);

  // Filter staff based on search and filter criteria
  const filteredStaff = useMemo(() => {
    if (!staffMembers.length) return [];
    
    return staffMembers.filter((staff) => {
      // If search query is a pure number, search by staff ID
      const isPureNumber = /^\d+$/.test(searchQuery);
      
      let matchesSearch = searchQuery === '';
      
      if (searchQuery !== '') {
        if (isPureNumber) {
          // Number search: search by id
          const staffId = staff.id || '';
          matchesSearch = staffId.toString().includes(searchQuery);
        } else {
          // Text search: match by name, email, specialty, or role
          const name = staff.name || '';
          const email = staff.email || '';
          const specialty = staff.specialty || '';
          const role = staff.role || '';
          const department = staff.department || '';
          
          matchesSearch = 
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
            role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            department.toLowerCase().includes(searchQuery.toLowerCase());
        }
      }

      // Role filter
      const staffRole = staff.role || '';
      const matchesRole = roleFilter === 'all' || 
                           staffRole.toLowerCase() === roleFilter.toLowerCase();
      
      // Status filter
      const staffStatus = staff.status || 'Available';
      const staffAvailability = staff.availability || 'available';
      
      let matchesStatus = statusFilter === 'all';
      
      if (statusFilter !== 'all') {
        const filterMap = {
          'Available': ['available'],
          'Busy': ['busy'],
          'Off Duty': ['offline', 'off duty']
        };
        
        const mappedFilters = filterMap[statusFilter] || [statusFilter.toLowerCase()];
        
        matchesStatus = mappedFilters.some(filter => 
          staffAvailability.toLowerCase() === filter.toLowerCase() ||
          staffStatus.toLowerCase() === filter.toLowerCase()
        );
      }

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffMembers, searchQuery, roleFilter, statusFilter]);

  // Calculate stats from filtered data
  const staffStats = useMemo(() => {
    const totalStaff = filteredStaff.length;
    
    const doctorCount = filteredStaff.filter(s => 
      (s.role || '').toLowerCase() === "doctor"
    ).length;
    
    const nurseCount = filteredStaff.filter(s => 
      (s.role || '').toLowerCase() === "nurse"
    ).length;
    
    const availableCount = filteredStaff.filter(s => {
      const availability = (s.availability || 'Available').toLowerCase();
      return availability === 'Available';
    }).length;

    return [
      {
        id: 1,
        title: 'Total Staff',
        value: totalStaff,
        subText: 'All medical staff',
        icon: 'people',
        borderColor: 'rgba(243, 178, 0, 0.1)',
        hoverShadow: 'rgba(234, 188, 102, 0.15)'
      },
      {
        id: 2,
        title: 'Doctors',
        value: doctorCount,
        subText: 'Medical physicians',
        icon: 'medical',
        borderColor: 'rgba(102, 126, 234, 0.1)',
        hoverShadow: 'rgba(102, 126, 234, 0.15)'
      },
      {
        id: 3,
        title: 'Nurses',
        value: nurseCount,
        subText: 'Nursing staff',
        icon: 'people',
        borderColor: 'rgba(118, 75, 162, 0.1)',
        hoverShadow: 'rgba(118, 75, 162, 0.15)'
      },
      {
        id: 4,
        title: 'Available Now',
        value: availableCount,
        subText: 'Currently active',
        icon: 'check',
        borderColor: 'rgba(46, 125, 50, 0.1)',
        hoverShadow: 'rgba(46, 125, 50, 0.15)'
      }
    ];
  }, [filteredStaff]);

  const getStatusColor = (status = '') => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'available': return '#10b981';
      case 'busy': return '#f59e0b';
      case 'offline':
      case 'off duty': 
        return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status = '') => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'available': return '#d1fae5';
      case 'busy': return '#fef3c7';
      case 'offline':
      case 'off duty': 
        return '#f3f4f6';
      default: return '#f3f4f6';
    }
  };

  const getRoleColor = (role = '') => {
    const actualRole = role || '';
    switch (actualRole.toLowerCase()) {
      case 'doctor': return '#667eea';
      case 'nurse': return '#764ba2';
      case 'administrator': return '#7c3aed';
      case 'technician': return '#dc2626';
      case 'staff': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchQuery || roleFilter !== 'all' || statusFilter !== 'all';

  return {
    staffMembers: filteredStaff,
    staffStats,
    searchQuery,
    roleFilter,
    statusFilter,
    loading,
    error,
    hasActiveFilters,
    getStatusColor,
    getStatusBgColor,
    getRoleColor,
    handleSearch: setSearchQuery,
    handleRoleFilter: setRoleFilter,
    handleStatusFilter: setStatusFilter,
    clearFilters,
    refreshStaffData: fetchStaffData,
  };
};