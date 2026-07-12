import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Expenses = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>fleetManager / Expenses</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > fleetManager > Expenses</p>
      </div>
      <div className="page-content">
        <Card title="Expenses Overview">
          <p>This is a placeholder for the Expenses page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Expenses;
