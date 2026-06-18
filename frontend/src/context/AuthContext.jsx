import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api.js';

// Create Authentication Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load profile on start if token exists
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      // If we are already authenticated and have a user, we don't need to load it again
      if (isAuthenticated && user) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/api/user/profile');
        if (res.data && res.data.success && res.data.payload) {
          setUser(res.data.payload);
          setIsAuthenticated(true);
        } else {
          // Fallback if data format is slightly different
          const userObj = res.data.payload || res.data.user || null;
          setUser(userObj);
          setIsAuthenticated(!!userObj);
        }
      } catch (err) {
        console.error('Session expired or invalid token:', err);
        // Reset state on failed token check
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/user/login', { email, password });
      const { token: receivedToken, payload: userObj } = res.data;
      
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(userObj);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      console.error('Login error details:', err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, phone, role) => {
    setLoading(true);
    try {
      await api.post('/api/user/register', { name, email, password, phone, role });
      return { success: true };
    } catch (err) {
      console.error('Registration error details:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Try again.';
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile handler
  const updateProfile = async (name, phone, password) => {
    setLoading(true);
    try {
      const body = { name, phone };
      if (password) body.password = password;

      const res = await api.put('/api/user/profile', body);
      const updatedUser = res.data.payload || res.data.user;
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      console.error('Profile update error details:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to update profile.';
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setLoading(true);
    try {
      await api.get('/api/user/logout');
    } catch (err) {
      console.warn('Backend logout response skipped or failed:', err);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
