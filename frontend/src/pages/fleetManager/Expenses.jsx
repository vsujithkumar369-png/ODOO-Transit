import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Expenses = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Operational Expenses</h2>
      </div>
      <Card title="Operational Expenses Data">
        <p>This is a placeholder page for Operational Expenses waiting for API integration.</p>
      </Card>
    </DashboardLayout>
  );
};
export default Expenses;
