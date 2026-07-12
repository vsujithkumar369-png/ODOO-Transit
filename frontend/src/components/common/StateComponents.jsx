import React from 'react';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';

/**
 * ErrorState — friendly error message with optional retry.
 * Props: message (string), onRetry (fn, optional)
 */
export const ErrorState = ({ message = 'Something went wrong. Please try again.', onRetry }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '12px', color: 'var(--danger)' }}>
    <AlertCircle size={40} />
    <p style={{ fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
      >
        <RefreshCw size={14} /> Retry
      </button>
    )}
  </div>
);

/**
 * EmptyState — shown when API returns empty data.
 * Props: message (string), subtext (string, optional)
 */
export const EmptyState = ({ message = 'No data found.', subtext }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '8px', color: 'var(--text-secondary)' }}>
    <Inbox size={40} style={{ opacity: 0.5 }} />
    <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>{message}</p>
    {subtext && <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{subtext}</p>}
  </div>
);
