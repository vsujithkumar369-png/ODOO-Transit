import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Vehicles = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>fleetManager / Vehicles</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > fleetManager > Vehicles</p>
      </div>
      <div className="page-content">
        <Card title="Vehicles Overview">
          <p>This is a placeholder for the Vehicles page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Vehicles;
