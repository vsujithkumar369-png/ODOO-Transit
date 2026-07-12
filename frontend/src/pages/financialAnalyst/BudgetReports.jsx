import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const ProgressBar = ({ label, current, max, color }) => {
  const percent = Math.min((current / max) * 100, 100);
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
        <span>{label}</span>
        <span>${current.toLocaleString()} / ${max.toLocaleString()}</span>
      </div>
      <div style={{ width: '100%', backgroundColor: 'var(--bg-tertiary)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, backgroundColor: color, height: '100%' }}></div>
      </div>
    </div>
  );
};

const BudgetReports = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Monthly Budget Tracking</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor departmental spend against allocated budgets.</p>
        </div>
        <select style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          <option>July 2026</option>
          <option>June 2026</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <Card title="Departmental Budgets">
          <ProgressBar label="Fuel Budget" current={42500} max={50000} color="var(--warning)" />
          <ProgressBar label="Maintenance Budget" current={12000} max={25000} color="var(--success)" />
          <ProgressBar label="Driver Salaries" current={85000} max={90000} color="var(--accent-primary)" />
          <ProgressBar label="Insurance & Tolls" current={15500} max={15000} color="var(--danger)" />
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default BudgetReports;
