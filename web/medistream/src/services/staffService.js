import API from './api'; 

export const staffService = {
  // Get all medical staff
  getAllStaff: async () => {
    try {
      const response = await API.get('/api/medicalstaff/all');
      
      return response.data.map(staff => ({
        id: staff.staffID,
        name: staff.name,
        email: staff.userAccount?.username || '',
        role: staff.role,
        specialty: staff.specialty || '',
        contact: staff.contactNo || '',
        status: 'Available',
        accountId: staff.userAccount?.accountID,
        staffID: staff.staffID
      }));
    } catch (error) {
      console.error('❌ Error fetching staff:', error);
      if (error.response) {
          console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },

  // Get staff statistics
  getStaffStats: async () => {
    try {
      const allStaff = await staffService.getAllStaff();
      
      const totalStaff = allStaff.length;
      const doctors = allStaff.filter(staff => 
        staff.role && staff.role.toLowerCase().includes('doctor')
      ).length;
      const nurses = allStaff.filter(staff => 
        staff.role && staff.role.toLowerCase().includes('nurse')
      ).length;
      
      return [
        {
          id: 1,
          title: 'Total Staff',
          value: totalStaff,
          subText: 'All healthcare staff',
          icon: 'people'
        },
        {
          id: 2,
          title: 'Doctors',
          value: doctors,
          subText: 'Medical doctors',
          icon: 'medical'
        },
        {
          id: 3,
          title: 'Nurses',
          value: nurses,
          subText: 'Nursing staff',
          icon: 'check'
        },
        {
          id: 4,
          title: 'Available Today',
          value: totalStaff, 
          subText: 'Currently on duty',
          icon: 'check'
        }
      ];
    } catch (error) {
      console.error('❌ Error fetching staff stats:', error);
      return [
        { id: 1, title: 'Total Staff', value: 0, subText: 'All healthcare staff', icon: 'people' },
        { id: 2, title: 'Doctors', value: 0, subText: 'Medical doctors', icon: 'medical' },
        { id: 3, title: 'Nurses', value: 0, subText: 'Nursing staff', icon: 'check' },
        { id: 4, title: 'Available Today', value: 0, subText: 'Currently on duty', icon: 'check' }
      ];
    }
  },

  // Get single staff member by ID
  getStaffById: async (id) => {
    try {
      const response = await API.get(`/api/medicalstaff/${id}`);
      const staff = response.data;
      
      return {
        id: staff.staffID,
        name: staff.name,
        email: staff.userAccount?.username || '',
        role: staff.role,
        specialty: staff.specialty || '',
        contact: staff.contactNo || '',
        status: 'Available',
        accountId: staff.userAccount?.accountID
      };
    } catch (error) {
      console.error(`❌ Error fetching staff with ID ${id}:`, error);
      throw error;
    }
  },

  // Update staff member
  updateStaff: async (id, staffData) => {
    try {
      console.log(`✏️ Updating staff ${id}:`, staffData);
      
      const response = await API.put(`/api/medicalstaff/update/${id}`, staffData);
      console.log('✅ Staff updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating staff ${id}:`, error);
      throw error;
    }
  },

  // Search staff (client-side filtering) - No API call needed here, logic remains same
  searchStaff: (staffList, query) => {
    if (!query) return staffList;
    
    return staffList.filter(staff => 
      (staff.name && staff.name.toLowerCase().includes(query.toLowerCase())) ||
      (staff.role && staff.role.toLowerCase().includes(query.toLowerCase())) ||
      (staff.email && staff.email.toLowerCase().includes(query.toLowerCase())) ||
      (staff.specialty && staff.specialty.toLowerCase().includes(query.toLowerCase()))
    );
  },

  // Filter by role - Logic remains same
  filterByRole: (staffList, role) => {
    if (role === 'all') return staffList;
    
    return staffList.filter(staff => 
      staff.role && staff.role.toLowerCase() === role.toLowerCase()
    );
  }
};

export default staffService;