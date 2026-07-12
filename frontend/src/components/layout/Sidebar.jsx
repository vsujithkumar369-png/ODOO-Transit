import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Navigation, Droplet, Clock, Settings, LogOut,
  Truck, Users, PenTool, DollarSign, FileText, Shield
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import './Sidebar.css';

const MENUS = {
  'Driver': [
    { name: 'Dashboard', path: '/driver/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Trips', path: '/driver/my-trips', icon: <Map size={20} /> },
    { name: 'Current Trip', path: '/driver/current-trip', icon: <Navigation size={20} /> },
    { name: 'Fuel Logs', path: '/driver/fuel-logs', icon: <Droplet size={20} /> },
    { name: 'Trip History', path: '/driver/trip-history', icon: <Clock size={20} /> },
    { name: 'Settings', path: '/driver/settings', icon: <Settings size={20} /> },
  ],
  'Fleet Manager': [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Vehicles', path: '/vehicles', icon: <Truck size={20} /> },
    { name: 'Drivers', path: '/drivers', icon: <Users size={20} /> },
    { name: 'Dispatch Trips', path: '/dispatch', icon: <Map size={20} /> },
    { name: 'Dispatch History', path: '/history', icon: <Clock size={20} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <PenTool size={20} /> },
    { name: 'Fuel Logs', path: '/fuel', icon: <Droplet size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <DollarSign size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ],
  'Safety Officer': [
    { name: 'Dashboard', path: '/safety/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Driver Compliance', path: '/compliance', icon: <Users size={20} /> },
    { name: 'License Monitoring', path: '/licenses', icon: <Shield size={20} /> },
    { name: 'Vehicle Safety', path: '/vehicle-safety', icon: <Truck size={20} /> },
    { name: 'Incident Reports', path: '/incidents', icon: <FileText size={20} /> },
    { name: 'Safety Reports', path: '/safety-reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/safety/settings', icon: <Settings size={20} /> },
  ],
  'Financial Analyst': [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Fuel Reports', path: '/fuel-reports', icon: <Droplet size={20} /> },
    { name: 'Operational Cost', path: '/costs', icon: <DollarSign size={20} /> },
    { name: 'Vehicle ROI', path: '/roi', icon: <Truck size={20} /> },
    { name: 'Expense Management', path: '/expenses', icon: <DollarSign size={20} /> },
    { name: 'Budget Reports', path: '/budgets', icon: <FileText size={20} /> },
    { name: 'Export Reports', path: '/exports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ],
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || 'Driver';
  const menuItems = MENUS[role] || MENUS['Driver'];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '1rem 1.5rem 0.5rem',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        opacity: 0.7,
      }}>
        {role} Menu
      </div>

      <nav className="sidebar-nav" style={{ flex: 1 }}>
        {menuItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer with user info + logout */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--accent-primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.role}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            width: '100%', padding: '0.5rem 0.75rem',
            background: 'none', border: '1px solid var(--border-color)',
            borderRadius: '6px', cursor: 'pointer', color: 'var(--danger)',
            fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
