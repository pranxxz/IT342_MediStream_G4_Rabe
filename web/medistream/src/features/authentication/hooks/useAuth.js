// frontend/src/hooks/useAuth.js
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
            console.log('📥 Login response status:', response.status);
            // console.log('📥 Login response data:', data);

            if (!response.ok || !data.success) {
                throw new Error(data.message || `Login failed (${response.status})`);
            }

            // Save user info to localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            // console.log('✅ Login successful! User:', data.user);
            
            
            // Redirect to PatientQueue
            navigate('/PatientQueue');
            
        } catch (error) {
            console.error('❌ Login error:', error);
            setError(error.message);
            
            // Show error for 5 seconds then clear
            setTimeout(() => setError(null), 5000);
            throw error; // Re-throw for form to catch
        } finally {
            setLoading(false);
        }
    };

    // Register function WITH EMAIL CHECK
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('📤 Sending registration request...', userData);
            
            // Optional: Check email first
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
            console.log('📥 Registration response status:', response.status);
            console.log('📥 Registration response data:', data);

            if (!response.ok || !data.success) {
                throw new Error(data.message || `Registration failed (${response.status})`);
            }

            // Save user info to localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', 'clinicaflow-session');
            
            console.log('✅ Registration successful! User:', data.user);

            // Redirect to PatientQueue
            navigate('/PatientQueue');
            
        } catch (error) {
            console.error('❌ Registration error:', error);
            setError(error.message);
            
            // Show error for 5 seconds then clear
            setTimeout(() => setError(null), 5000);
            throw error; // Re-throw for form to catch
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

    // Check if user is authenticated
    const isAuthenticated = () => {
        return localStorage.getItem('user') !== null;
    };

    // Get current user
    const getCurrentUser = () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    return { 
        login, 
        register, 
        logout, 
        loading, 
        error, 
        checkEmailExists, // Export this too
        testBackend,
        healthCheck,
        isAuthenticated,
        getCurrentUser
    };
};