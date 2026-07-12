import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Data Reports</h2>
      </div>
      <Card title="Data Reports Data">
        <p>This is a placeholder page for Data Reports waiting for API integration.</p>
      </Card>
    </DashboardLayout>
  );
};
export default Reports;
