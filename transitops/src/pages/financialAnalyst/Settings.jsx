import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>financialAnalyst / Settings</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > financialAnalyst > Settings</p>
      </div>
      <div className="page-content">
        <Card title="Settings Overview">
          <p>This is a placeholder for the Settings page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Settings;
