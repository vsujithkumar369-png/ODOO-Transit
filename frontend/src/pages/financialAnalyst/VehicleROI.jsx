import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const VehicleROI = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>financialAnalyst / VehicleROI</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > financialAnalyst > VehicleROI</p>
      </div>
      <div className="page-content">
        <Card title="VehicleROI Overview">
          <p>This is a placeholder for the VehicleROI page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default VehicleROI;
