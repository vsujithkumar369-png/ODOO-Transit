import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const IncidentReports = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>safetyOfficer / IncidentReports</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > safetyOfficer > IncidentReports</p>
      </div>
      <div className="page-content">
        <Card title="IncidentReports Overview">
          <p>This is a placeholder for the IncidentReports page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default IncidentReports;
