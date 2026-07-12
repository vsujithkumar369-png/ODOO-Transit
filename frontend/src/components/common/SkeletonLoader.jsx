import React from 'react';

/**
 * SkeletonRow — renders N shimmer rows for table loading states.
 * Props:
 *   rows (number)
 *   cols (number)
 */
const SkeletonRow = ({ rows = 5, cols = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, ri) => (
        <tr key={ri}>
          {Array.from({ length: cols }).map((_, ci) => (
            <td key={ci} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div
                style={{
                  height: '14px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-tertiary)',
                  width: ci === 0 ? '70%' : ci === cols - 1 ? '50%' : '85%',
                  animation: 'shimmer 1.4s infinite linear',
                }}
              />
            </td>
          ))}
        </tr>
      ))}
      <style>{`
        @keyframes shimmer {
          0%   { opacity: 1; }
          50%  { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

/**
 * SkeletonCard — shimmer block for KPI card loading states.
 */
export const SkeletonCard = () => (
  <div
    style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', animation: 'shimmer 1.4s infinite linear' }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: '12px', width: '60%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', marginBottom: '8px', animation: 'shimmer 1.4s infinite linear' }} />
        <div style={{ height: '20px', width: '40%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', animation: 'shimmer 1.4s infinite linear' }} />
      </div>
    </div>
    <style>{`@keyframes shimmer{0%{opacity:1}50%{opacity:.4}100%{opacity:1}}`}</style>
  </div>
);

export default SkeletonRow;
