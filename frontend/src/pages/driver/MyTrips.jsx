import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const MyTrips = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>driver / MyTrips</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > driver > MyTrips</p>
      </div>
      <div className="page-content">
        <Card title="MyTrips Overview">
          <p>This is a placeholder for the MyTrips page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default MyTrips;
