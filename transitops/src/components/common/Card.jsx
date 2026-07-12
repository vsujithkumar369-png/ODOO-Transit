import React from 'react';
import './Card.css';

const Card = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {(title || icon) && (
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          {icon && <span style={{ color: 'var(--accent-primary)', display: 'flex' }}>{icon}</span>}
          {title && <h3 className="card-title" style={{ marginBottom: 0 }}>{title}</h3>}
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};
export default Card;
