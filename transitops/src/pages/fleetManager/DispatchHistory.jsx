import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const DispatchHistory = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>fleetManager / DispatchHistory</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > fleetManager > DispatchHistory</p>
      </div>
      <div className="page-content">
        <Card title="DispatchHistory Overview">
          <p>This is a placeholder for the DispatchHistory page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default DispatchHistory;
