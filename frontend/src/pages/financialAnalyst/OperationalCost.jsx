import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const OperationalCost = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Operational Cost Analysis</h2>
      </div>
      <Card title="Operational Cost Analysis Data">
        <p>This is a placeholder page for Operational Cost Analysis waiting for API integration.</p>
      </Card>
    </DashboardLayout>
  );
};
export default OperationalCost;
