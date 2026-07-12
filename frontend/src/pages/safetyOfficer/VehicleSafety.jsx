import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const VehicleSafety = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>safetyOfficer / VehicleSafety</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home &gt; safetyOfficer &gt; VehicleSafety</p>
      </div>
      <div className="page-content">
        <Card title="VehicleSafety Overview">
          <p>This is a placeholder for the VehicleSafety page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default VehicleSafety;
