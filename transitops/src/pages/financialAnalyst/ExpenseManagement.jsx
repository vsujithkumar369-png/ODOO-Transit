import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const ExpenseManagement = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>financialAnalyst / ExpenseManagement</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > financialAnalyst > ExpenseManagement</p>
      </div>
      <div className="page-content">
        <Card title="ExpenseManagement Overview">
          <p>This is a placeholder for the ExpenseManagement page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default ExpenseManagement;
