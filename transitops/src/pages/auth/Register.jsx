import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Register = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>auth / Register</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > auth > Register</p>
      </div>
      <div className="page-content">
        <Card title="Register Overview">
          <p>This is a placeholder for the Register page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Register;
