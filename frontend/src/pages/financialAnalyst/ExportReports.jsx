import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const ExportReports = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{marginBottom: '2rem'}}>
        <h2>financialAnalyst / ExportReports</h2>
        <p style={{color: 'var(--text-secondary)'}}>Home > financialAnalyst > ExportReports</p>
      </div>
      <div className="page-content">
        <Card title="ExportReports Overview">
          <p>This is a placeholder for the ExportReports page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default ExportReports;
