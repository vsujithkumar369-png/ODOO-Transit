import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor = 'var(--bg-tertiary)';
  let color = 'var(--text-secondary)';
  
  const normalized = status.toLowerCase();
  
  if (normalized.includes('active') || normalized.includes('available') || normalized.includes('completed')) {
    bgColor = 'rgba(34, 197, 94, 0.1)';
    color = 'var(--success)';
  } else if (normalized.includes('maintenance') || normalized.includes('shop') || normalized.includes('pending')) {
    bgColor = 'rgba(245, 158, 11, 0.1)';
    color = 'var(--warning)';
  } else if (normalized.includes('trip') || normalized.includes('route')) {
    bgColor = 'rgba(59, 130, 246, 0.1)';
    color = 'var(--accent-primary)';
  } else if (normalized.includes('retired') || normalized.includes('inactive')) {
    bgColor = 'rgba(239, 68, 68, 0.1)';
    color = 'var(--danger)';
  }

  return (
    <span style={{
      backgroundColor: bgColor,
      color: color,
      padding: '4px 8px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'capitalize'
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;
