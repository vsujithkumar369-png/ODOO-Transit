import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const DispatchTrips = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>fleetManager / DispatchTrips</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > fleetManager > DispatchTrips</p>
      </div>
      <div className="page-content">
        <Card title="DispatchTrips Overview">
          <p>This is a placeholder for the DispatchTrips page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default DispatchTrips;
