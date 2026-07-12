import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Map, Clock, PenTool, Droplet, DollarSign, FileText, Settings, Shield, Navigation } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const [role, setRole] = useState(() => localStorage.getItem('mockRole') || 'Financial Analyst');

  const menus = {
    'Fleet Manager': [
      { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
      { name: 'Vehicles', path: '/vehicles', icon: <Truck size={20} /> },
      { name: 'Drivers', path: '/drivers', icon: <Users size={20} /> },
      { name: 'Dispatch Trips', path: '/dispatch', icon: <Map size={20} /> },
      { name: 'Maintenance', path: '/maintenance', icon: <PenTool size={20} /> },
      { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ],
    'Driver': [
      { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
      { name: 'My Trips', path: '/my-trips', icon: <Map size={20} /> },
      { name: 'Current Trip', path: '/current-trip', icon: <Navigation size={20} /> },
      { name: 'Fuel Logs', path: '/fuel', icon: <Droplet size={20} /> },
      { name: 'Trip History', path: '/history', icon: <Clock size={20} /> },
      { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ],
    'Safety Officer': [
      { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
      { name: 'Driver Compliance', path: '/compliance', icon: <Users size={20} /> },
      { name: 'License Monitoring', path: '/licenses', icon: <Shield size={20} /> },
      { name: 'Vehicle Safety', path: '/vehicle-safety', icon: <Truck size={20} /> },
      { name: 'Incident Reports', path: '/incidents', icon: <FileText size={20} /> },
      { name: 'Safety Reports', path: '/safety-reports', icon: <FileText size={20} /> },
      { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ],
    'Financial Analyst': [
      { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
      { name: 'Fuel Reports', path: '/fuel-reports', icon: <Droplet size={20} /> },
      { name: 'Operational Cost', path: '/costs', icon: <DollarSign size={20} /> },
      { name: 'Vehicle ROI', path: '/roi', icon: <Truck size={20} /> },
      { name: 'Expense Management', path: '/expenses', icon: <DollarSign size={20} /> },
      { name: 'Budget Reports', path: '/budgets', icon: <FileText size={20} /> },
      { name: 'Export Reports', path: '/exports', icon: <FileText size={20} /> },
      { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ]
  };

  const currentMenu = menus[role] || menus['Fleet Manager'];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {role} Navigation
      </div>
      
      <nav className="sidebar-nav" style={{ flex: 1 }}>
        {currentMenu.map(item => (
          <NavLink key={item.name} to={item.path} onClick={onClose} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Switch Role (Mock):</label>
        <select 
          value={role} 
          onChange={(e) => {
            const val = e.target.value;
            setRole(val);
            localStorage.setItem('mockRole', val);
          }}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
        >
          {Object.keys(menus).map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
    </aside>
  );
};
export default Sidebar;
