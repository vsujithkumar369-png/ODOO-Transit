import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const FuelReports = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Fuel Expenditure Reports</h2>
      </div>
      <Card title="Fuel Expenditure Reports Data">
        <p>This is a placeholder page for Fuel Expenditure Reports waiting for API integration.</p>
      </Card>
    </DashboardLayout>
  );
};
export default FuelReports;
