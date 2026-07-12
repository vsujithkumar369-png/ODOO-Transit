import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: 'u1', name: 'Alex Driver', email: 'driver@transitops.com', password: 'driver123', role: 'Driver', contact: '+91 9876543210', licenseNum: 'LIC-ALX01', licenseExpiry: '2028-06-30', safetyScore: 95, status: 'Available', avatar: null },
  { id: 'u2', name: 'Fleet Manager', email: 'manager@transitops.com', password: 'manager123', role: 'FleetManager', contact: '+91 9123456789', avatar: null },
  { id: 'u3', name: 'Safety Officer', email: 'safety@transitops.com', password: 'safety123', role: 'SafetyOfficer', contact: '', avatar: null },
  { id: 'u4', name: 'Finance Analyst', email: 'analyst@transitops.com', password: 'analyst123', role: 'FinancialAnalyst', contact: '', avatar: null },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await authService.getMe();
      if (response) {
        setUser(response);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await authService.login(email, password);
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('transitops_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      }
      throw new Error('Login failed: Token not found');
    } catch (err) {
      // Fallback to mock local users if backend fails or is offline
      const found = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (found) {
        const { password: _, ...safeUser } = found;
        localStorage.setItem('transitops_user', JSON.stringify(safeUser));
        setUser(safeUser);
        return safeUser;
      }
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('transitops_user');
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updates) => {
    try {
      const updated = await authService.updateProfile(updates);
      setUser(updated);
      return updated;
    } catch (err) {
      const updated = { ...user, ...updates };
      setUser(updated);
      return updated;
    }
  }, [user]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

