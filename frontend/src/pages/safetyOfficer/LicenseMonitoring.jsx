import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const LicenseMonitoring = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>safetyOfficer / LicenseMonitoring</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > safetyOfficer > LicenseMonitoring</p>
      </div>
      <div className="page-content">
        <Card title="LicenseMonitoring Overview">
          <p>This is a placeholder for the LicenseMonitoring page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default LicenseMonitoring;
