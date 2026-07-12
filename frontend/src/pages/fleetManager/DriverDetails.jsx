import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const DriverDetails = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>fleetManager / DriverDetails</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > fleetManager > DriverDetails</p>
      </div>
      <div className="page-content">
        <Card title="DriverDetails Overview">
          <p>This is a placeholder for the DriverDetails page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default DriverDetails;
