import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Unauthorized = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>auth / Unauthorized</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > auth > Unauthorized</p>
      </div>
      <div className="page-content">
        <Card title="Unauthorized Overview">
          <p>This is a placeholder for the Unauthorized page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Unauthorized;
