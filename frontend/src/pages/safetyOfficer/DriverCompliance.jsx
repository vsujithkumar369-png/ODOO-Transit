import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const DriverCompliance = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>safetyOfficer / DriverCompliance</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > safetyOfficer > DriverCompliance</p>
      </div>
      <div className="page-content">
        <Card title="DriverCompliance Overview">
          <p>This is a placeholder for the DriverCompliance page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default DriverCompliance;
