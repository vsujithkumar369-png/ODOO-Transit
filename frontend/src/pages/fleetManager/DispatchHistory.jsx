import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const DispatchHistory = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Dispatch History</h2>
      </div>
      <Card title="Dispatch History Data">
        <p>This is a placeholder page for Dispatch History waiting for API integration.</p>
      </Card>
    </DashboardLayout>
  );
};
export default DispatchHistory;
