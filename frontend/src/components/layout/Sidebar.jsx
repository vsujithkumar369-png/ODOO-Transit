import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Map, Clock, PenTool, Droplet, DollarSign, FileText, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Vehicles', path: '/vehicles', icon: <Truck size={20} /> },
    { name: 'Drivers', path: '/drivers', icon: <Users size={20} /> },
    { name: 'Dispatch New Trip', path: '/dispatch', icon: <Map size={20} /> },
    { name: 'Dispatch History', path: '/history', icon: <Clock size={20} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <PenTool size={20} /> },
    { name: 'Fuel Logs', path: '/fuel', icon: <Droplet size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <DollarSign size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Fleet Manager</div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <NavLink key={item.name} to={item.path} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
export default Sidebar;
