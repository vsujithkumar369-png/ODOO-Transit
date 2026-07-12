import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Account Settings</h2>
      </div>
      <Card title="Account Settings Data">
        <p>This is a placeholder page for Account Settings waiting for API integration.</p>
      </Card>
    </DashboardLayout>
  );
};
export default Settings;
