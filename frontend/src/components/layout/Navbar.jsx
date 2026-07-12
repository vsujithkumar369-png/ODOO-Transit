import React from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-btn menu-toggle-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="navbar-brand">TransitOps</div>
      </div>
      <div className="navbar-actions">
        <button className="icon-btn"><Bell size={20} /></button>
        <button className="icon-btn" onClick={() => navigate('/login')} title="Login Profile">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};
export default Navbar;
