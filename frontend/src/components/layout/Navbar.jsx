import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Menu, LogOut, Settings, ChevronDown, Trash2, CheckCheck } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import './Navbar.css';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllRead, deleteNotification, clearAll } = useNotifications();

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getProfilePath = () => {
    if (user?.role === 'Driver') return '/driver/profile';
    return '/settings';
  };

  const getSettingsPath = () => {
    if (user?.role === 'Driver') return '/driver/settings';
    return '/settings';
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-btn menu-toggle-btn" onClick={onMenuClick} aria-label="Toggle sidebar">
          <Menu size={22} />
        </button>
        <div className="navbar-brand">TransitOps</div>
        {user && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '2px 10px',
            borderRadius: '20px',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
          }}>
            {user.role}
          </span>
        )}
      </div>

      <div className="navbar-actions">
        {/* Notification Bell */}
        <div className="navbar-dropdown-wrap" ref={notifRef}>
          <button
            className="icon-btn"
            onClick={() => { setShowNotif(v => !v); setShowProfile(false); }}
            aria-label="Notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: 'var(--danger)', color: 'white',
                fontSize: '0.65rem', fontWeight: 700,
                width: '17px', height: '17px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-secondary)',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="navbar-dropdown notif-panel">
              <div className="dropdown-header">
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                  Notifications {unreadCount > 0 && <span style={{ color: 'var(--accent-primary)' }}>({unreadCount})</span>}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="dropdown-action-btn" onClick={markAllRead} title="Mark all read">
                    <CheckCheck size={14} />
                  </button>
                  <button className="dropdown-action-btn" onClick={clearAll} title="Clear all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">No notifications</div>
                ) : notifications.slice(0, 20).map(n => (
                  <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '2px' }}>{n.type}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.message}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '3px' }}>{n.date}</div>
                    </div>
                    <button
                      onClick={() => deleteNotification(n.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '2px', flexShrink: 0 }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="navbar-dropdown-wrap" ref={profileRef}>
          <button
            className="profile-trigger"
            onClick={() => { setShowProfile(v => !v); setShowNotif(false); }}
          >
            <div className="avatar-circle">{initials}</div>
            {user && <span className="navbar-username">{user.name?.split(' ')[0]}</span>}
            <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
          </button>

          {showProfile && (
            <div className="navbar-dropdown profile-panel">
              <div className="profile-user-info">
                <div className="avatar-circle avatar-lg">{initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
                </div>
              </div>
              <div className="profile-menu-list">
                <button className="profile-menu-item" onClick={() => { navigate(getProfilePath()); setShowProfile(false); }}>
                  <User size={15} /> My Profile
                </button>
                <button className="profile-menu-item" onClick={() => { navigate(getSettingsPath()); setShowProfile(false); }}>
                  <Settings size={15} /> Settings
                </button>
                <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />
                <button className="profile-menu-item danger" onClick={handleLogout}>
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
