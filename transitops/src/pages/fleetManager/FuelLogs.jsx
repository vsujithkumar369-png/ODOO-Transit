import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const FuelLogs = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>fleetManager / FuelLogs</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > fleetManager > FuelLogs</p>
      </div>
      <div className="page-content">
        <Card title="FuelLogs Overview">
          <p>This is a placeholder for the FuelLogs page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default FuelLogs;
