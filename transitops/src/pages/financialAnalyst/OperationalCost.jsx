import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const OperationalCost = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>financialAnalyst / OperationalCost</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > financialAnalyst > OperationalCost</p>
      </div>
      <div className="page-content">
        <Card title="OperationalCost Overview">
          <p>This is a placeholder for the OperationalCost page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default OperationalCost;
