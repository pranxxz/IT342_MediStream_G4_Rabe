import API from '../../../shared/services/api'; 

export const patientService = {
  getAllPatients: async () => {
    try {
      // Matches @GetMapping in PatientController
      const response = await API.get('/api/patients'); 
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  addPatient: async (patientData) => {
    try {
      // Matches @PostMapping in PatientController
      const response = await API.post('/api/patients', patientData); 
      return response.data;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  },

  updatePatient: async (id, patientData) => {
    try {
      // Matches @PutMapping("/{id}") in PatientController
      const response = await API.put(`/api/patients/${id}`, patientData); 
      return response.data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  },

  deletePatient: async (id) => {
    try {
      // Assuming you will add a @DeleteMapping("/{id}") in your PatientController later
      const response = await API.delete(`/api/patients/${id}`); 
      return response.data;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  },

  getPatientById: async (id) => {
    try {
      // Matches @GetMapping("/{id}") in PatientController
      const response = await API.get(`/api/patients/${id}`); 
      return response.data;
    } catch (error) {
      console.error('Error fetching patient details:', error);
      throw error;
    }
  },
};