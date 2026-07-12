import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Maintenance = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>fleetManager / Maintenance</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > fleetManager > Maintenance</p>
      </div>
      <div className="page-content">
        <Card title="Maintenance Overview">
          <p>This is a placeholder for the Maintenance page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Maintenance;
