import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Drivers = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>fleetManager / Drivers</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > fleetManager > Drivers</p>
      </div>
      <div className="page-content">
        <Card title="Drivers Overview">
          <p>This is a placeholder for the Drivers page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Drivers;
