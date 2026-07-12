import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmModal — enterprise confirmation dialog.
 * Props:
 *   isOpen (bool)
 *   title (string)
 *   message (string)
 *   confirmLabel (string, default 'Confirm')
 *   onConfirm (fn)
 *   onCancel (fn)
 *   danger (bool) — red confirm button
 *   loading (bool)
 */
const ConfirmModal = ({ isOpen, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger = false, loading = false }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onCancel}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000 }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 2001,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '2rem',
          width: '90%',
          maxWidth: '420px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
        role="alertdialog"
        aria-modal="true"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <AlertTriangle size={22} style={{ color: danger ? 'var(--danger)' : 'var(--warning)', flexShrink: 0 }} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{title}</h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{ padding: '8px 20px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: danger ? 'var(--danger)' : '#1E3A8A',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
