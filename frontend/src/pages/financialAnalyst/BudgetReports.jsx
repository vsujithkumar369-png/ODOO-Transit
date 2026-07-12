import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const BudgetReports = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>financialAnalyst / BudgetReports</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > financialAnalyst > BudgetReports</p>
      </div>
      <div className="page-content">
        <Card title="BudgetReports Overview">
          <p>This is a placeholder for the BudgetReports page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default BudgetReports;
