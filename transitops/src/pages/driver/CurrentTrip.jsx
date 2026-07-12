import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const CurrentTrip = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>driver / CurrentTrip</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > driver > CurrentTrip</p>
      </div>
      <div className="page-content">
        <Card title="CurrentTrip Overview">
          <p>This is a placeholder for the CurrentTrip page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default CurrentTrip;
