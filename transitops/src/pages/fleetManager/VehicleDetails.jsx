import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const VehicleDetails = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>fleetManager / VehicleDetails</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > fleetManager > VehicleDetails</p>
      </div>
      <div className="page-content">
        <Card title="VehicleDetails Overview">
          <p>This is a placeholder for the VehicleDetails page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default VehicleDetails;
