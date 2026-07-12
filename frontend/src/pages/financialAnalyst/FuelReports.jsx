import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const FuelReports = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>financialAnalyst / FuelReports</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > financialAnalyst > FuelReports</p>
      </div>
      <div className="page-content">
        <Card title="FuelReports Overview">
          <p>This is a placeholder for the FuelReports page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default FuelReports;
