import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>financialAnalyst / Dashboard</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > financialAnalyst > Dashboard</p>
      </div>
      <div className="page-content">
        <Card title="Dashboard Overview">
          <p>This is a placeholder for the Dashboard page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Dashboard;
