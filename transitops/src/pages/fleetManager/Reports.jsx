import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>fleetManager / Reports</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > fleetManager > Reports</p>
      </div>
      <div className="page-content">
        <Card title="Reports Overview">
          <p>This is a placeholder for the Reports page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Reports;
