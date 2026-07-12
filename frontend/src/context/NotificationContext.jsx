import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export const NotificationContext = createContext(null);

const STORAGE_KEY = 'transitops_notifications';

const generateId = () => `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const formatTime = () => new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
};

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((type, message) => {
    const notif = { id: generateId(), type, message, date: formatTime(), read: false };
    setNotifications(prev => [notif, ...prev].slice(0, 50));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount,
      addNotification, markAllRead, markRead, deleteNotification, clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
