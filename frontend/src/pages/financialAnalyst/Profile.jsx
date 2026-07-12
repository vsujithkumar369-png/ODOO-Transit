import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>financialAnalyst / Profile</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > financialAnalyst > Profile</p>
      </div>
      <div className="page-content">
        <Card title="Profile Overview">
          <p>This is a placeholder for the Profile page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Profile;
