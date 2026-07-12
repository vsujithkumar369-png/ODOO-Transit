import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

/**
 * Toast — auto-dismissing toast notification.
 * Props:
 *   type: 'success' | 'error' | 'warning'
 *   message: string
 *   onClose: fn
 *   duration: ms (default 3500)
 */
const Toast = ({ type = 'success', message, onClose, duration = 3500 }) => {
  useEffect(() => {
    const t = setTimeout(() => { if (onClose) onClose(); }, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const config = {
    success: { bg: '#f0fdf4', border: '#22c55e', color: '#15803d', Icon: CheckCircle },
    error:   { bg: '#fef2f2', border: '#ef4444', color: '#b91c1c', Icon: XCircle },
    warning: { bg: '#fffbeb', border: '#f59e0b', color: '#92400e', Icon: AlertTriangle },
  }[type] || { bg: '#f0fdf4', border: '#22c55e', color: '#15803d', Icon: CheckCircle };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: '8px',
      padding: '12px 16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      maxWidth: '360px',
      animation: 'slideIn 0.25s ease',
    }}>
      <config.Icon size={18} style={{ color: config.color, flexShrink: 0 }} />
      <p style={{ fontSize: '0.875rem', color: config.color, flex: 1 }}>{message}</p>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: config.color, display: 'flex' }}>
        <X size={16} />
      </button>
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </div>
  );
};

export default Toast;
