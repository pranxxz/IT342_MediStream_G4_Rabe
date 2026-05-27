import axios from 'axios';

// 1. Create the instance
const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add the Interceptor (This attaches the Token automatically)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach it
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;