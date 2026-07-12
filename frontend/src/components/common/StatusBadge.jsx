import React from 'react';

const BADGE_CONFIG = {
  // Trip statuses
  'Active': { bg: 'rgba(59,130,246,0.12)', color: '#1d4ed8' },
  'Pending': { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
  'Completed': { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
  'Cancelled': { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
  // Vehicle / driver statuses
  'Available': { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
  'On Trip': { bg: 'rgba(59,130,246,0.12)', color: '#1d4ed8' },
  'In Maintenance': { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
  'Inactive': { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
  'Retired': { bg: 'rgba(107,114,128,0.12)', color: '#4b5563' },
  // Generic
  'Dispatched': { bg: 'rgba(59,130,246,0.12)', color: '#1d4ed8' },
  'Draft': { bg: 'rgba(107,114,128,0.12)', color: '#4b5563' },
};

const DEFAULT = { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' };

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const cfg = BADGE_CONFIG[status] || DEFAULT;

  return (
    <span style={{
      backgroundColor: cfg.bg,
      color: cfg.color,
      padding: '3px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'inline-block',
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;
