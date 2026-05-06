import API from '../../../services/api';

export const queueService = {
  joinQueue: async (queueRequestData) => {
    try {
      const response = await API.post('/api/queue/join', queueRequestData);
      return response.data;
    } catch (error) {
      console.error('Error joining queue:', error);
      throw error;
    }
  },

  getAllQueue: async () => {
    try {
      const response = await API.get('/api/queue');
      return response.data;
    } catch (error) {
      console.error('Error fetching queue:', error);
      throw error;
    }
  },

  updateQueueItem: async (id, queueData) => {
    try {
      const response = await API.put(`/api/queue/${id}`, queueData);
      return response.data;
    } catch (error) {
      console.error('Error updating queue item:', error);
      throw error;
    }
  },

  deleteQueueItem: async (id) => {
    try {
      const response = await API.delete(`/api/queue/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting queue item:', error);
      throw error;
    }
  },
};
