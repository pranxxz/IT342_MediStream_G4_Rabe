import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/auth';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Check if email exists in database
    const checkEmailExists = async (email) => {
        try {
            const response = await fetch(`${API_URL}/check-email/${encodeURIComponent(email)}`);
            if (response.ok) {
                const exists = await response.json();
                return exists; // true or false
            }
            return false;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };

    // Test backend connection
    const testBackend = async () => {
        try {
            console.log('Testing backend connection...');
            const response = await fetch(`${API_URL}/test`);
            const text = await response.text();
            console.log('✅ Backend test response:', text);
            return { success: true, message: text };
        } catch (err) {
            console.error('❌ Cannot connect to backend:', err);
            return { 
                success: false, 
                message: 'Cannot connect to backend. Make sure Spring Boot is running on port 8080.' 
            };
        }
    };

    // Health check
    const healthCheck = async () => {
        try {
            const response = await fetch(`${API_URL}/health`);
            const data = await response.json();
            console.log('✅ Health check:', data);
            return data;
        } catch (err) {
            console.error('❌ Health check failed:', err);
            return null;
        }
    };

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('📤 Sending login request...');
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || `Login failed (${response.status})`);
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            navigate('/PatientQueue');
        } catch (error) {
            console.error('❌ Login error:', error);
            setError(error.message);
            setTimeout(() => setError(null), 5000);
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    // Register function WITH EMAIL CHECK
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        
        try {
            const emailExists = await checkEmailExists(userData.email);
            if (emailExists) {
                throw new Error('Email already registered. Please use a different email.');
            }
            
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    password: userData.password,
                    role: userData.role || 'staff'
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || `Registration failed (${response.status})`);
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', 'clinicaflow-session'); // Note: Replace with actual token from backend if available
            
            navigate('/PatientQueue');
        } catch (error) {
            console.error('❌ Registration error:', error);
            setError(error.message);
            setTimeout(() => setError(null), 5000);
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isAuthenticated = () => {
        return localStorage.getItem('user') !== null;
    };

    const getCurrentUser = () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    return { 
        login, register, logout, loading, error, 
        checkEmailExists, testBackend, healthCheck, 
        isAuthenticated, getCurrentUser
    };
};