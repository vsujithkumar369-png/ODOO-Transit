import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const SafetyReports = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>safetyOfficer / SafetyReports</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > safetyOfficer > SafetyReports</p>
      </div>
      <div className="page-content">
        <Card title="SafetyReports Overview">
          <p>This is a placeholder for the SafetyReports page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default SafetyReports;
