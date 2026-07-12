import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const FuelLogs = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Fuel Consumption Logs</h2>
      </div>
      <Card title="Fuel Consumption Logs Data">
        <p>This is a placeholder page for Fuel Consumption Logs waiting for API integration.</p>
      </Card>
    </DashboardLayout>
  );
};
export default FuelLogs;
