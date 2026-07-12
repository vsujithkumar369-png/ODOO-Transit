import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const TripHistory = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>driver / TripHistory</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > driver > TripHistory</p>
      </div>
      <div className="page-content">
        <Card title="TripHistory Overview">
          <p>This is a placeholder for the TripHistory page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default TripHistory;
