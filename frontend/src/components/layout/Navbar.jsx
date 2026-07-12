import React from 'react';
import { Bell, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">TransitOps</div>
      <div className="navbar-actions">
        <button className="icon-btn"><Bell size={20} /></button>
        <button className="icon-btn"><User size={20} /></button>
      </div>
    </header>
  );
};
export default Navbar;
