import React, { createContext, useContext, useState, useCallback } from 'react';

export const AuthContext = createContext(null);

// Seed demo users in localStorage on first load
const DEMO_USERS = [
  { id: 'u1', name: 'Alex Driver', email: 'driver@transitops.com', password: 'driver123', role: 'Driver', contact: '+91 9876543210', licenseNum: 'LIC-ALX01', licenseExpiry: '2028-06-30', safetyScore: 95, status: 'Available', avatar: null },
  { id: 'u2', name: 'Fleet Manager', email: 'manager@transitops.com', password: 'manager123', role: 'Fleet Manager', contact: '+91 9123456789', avatar: null },
  { id: 'u3', name: 'Safety Officer', email: 'safety@transitops.com', password: 'safety123', role: 'Safety Officer', contact: '', avatar: null },
  { id: 'u4', name: 'Finance Analyst', email: 'analyst@transitops.com', password: 'analyst123', role: 'Financial Analyst', contact: '', avatar: null },
];

function seedDemoUsers() {
  const existing = JSON.parse(localStorage.getItem('transitops_users') || '[]');
  if (existing.length === 0) {
    localStorage.setItem('transitops_users', JSON.stringify(DEMO_USERS));
  }
}

seedDemoUsers();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('transitops_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = useCallback((email, password) => {
    const users = JSON.parse(localStorage.getItem('transitops_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password.');
    const { password: _, ...safeUser } = found;
    localStorage.setItem('transitops_user', JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('transitops_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('transitops_user', JSON.stringify(updated));
    // Also update in users list
    const users = JSON.parse(localStorage.getItem('transitops_users') || '[]');
    const idx = users.findIndex(u => u.id === updated.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem('transitops_users', JSON.stringify(users));
    }
    setUser(updated);
    return updated;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
