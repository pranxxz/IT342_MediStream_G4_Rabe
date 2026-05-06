import API from '../../../services/api';

export const consultationService = {
    addConsultation: async (consultationData) => {
        try {
            const response = await API.post('/api/consultations/add', consultationData);
            return response.data;
        } catch (error) {
            console.error("Error saving consultation:", error);
            throw error;
        }
    },

    getAllConsultations: async () => {
        try {
            const response = await API.get('/api/consultations/all');
            return response.data;
        } catch (error) {
            console.error("Error fetching consultations:", error);
            throw error;
        }
    },

    updateConsultation: async (consultationId, consultationData) => {
        try {
            const response = await API.put(`/api/consultations/update/${consultationId}`, consultationData);
            return response.data;
        } catch (error) {
            console.error("Error updating consultation:", error);
            throw error;
        }
    },

    deleteConsultation: async (consultationId) => {
        try {
            const response = await API.delete(`/api/consultations/delete/${consultationId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting consultation:", error);
            throw error;
        }
    }
};