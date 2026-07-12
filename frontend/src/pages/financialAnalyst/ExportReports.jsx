import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const ExportReports = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Export Reports</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Generate and download comprehensive financial datasets.</p>
      </div>

      <div style={{ maxWidth: '600px' }}>
        <Card title="Report Configuration">
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Report Type</label>
              <select style={{width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}}>
                <option>Complete Financial Summary</option>
                <option>Expense Breakdown</option>
                <option>Vehicle ROI Analysis</option>
                <option>Tax Deductible Logs</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Start Date</label>
                <input type="date" style={{width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>End Date</label>
                <input type="date" style={{width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}} />
              </div>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Format</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label><input type="radio" name="format" defaultChecked /> CSV Spreadsheet</label>
                <label><input type="radio" name="format" /> PDF Document</label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary">Generate & Download</Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default ExportReports;
