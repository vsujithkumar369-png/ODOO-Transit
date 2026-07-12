import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

const ExpenseManagement = () => {
  const expenses = [
    { id: 'EXP-9021', date: '2026-07-10', vehicle: 'All', category: 'Fuel', amount: '$4,250.00', status: 'Cleared' },
    { id: 'EXP-9022', date: '2026-07-11', vehicle: 'V-003', category: 'Maintenance', amount: '$1,820.50', status: 'Pending' },
    { id: 'EXP-9023', date: '2026-07-11', vehicle: 'All', category: 'Salary', amount: '$12,400.00', status: 'Cleared' },
    { id: 'EXP-9024', date: '2026-07-12', vehicle: 'V-001', category: 'Tolls & Fees', amount: '$340.00', status: 'Processing' },
    { id: 'EXP-9025', date: '2026-07-12', vehicle: 'All', category: 'Insurance', amount: '$5,100.00', status: 'Cleared' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Expense Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track and categorize all operational fleet expenses.</p>
        </div>
        <Button variant="primary">+ Log Expense</Button>
      </div>
      
      <Card>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <input type="date" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          <select style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <option>All Categories</option>
            <option>Fuel</option>
            <option>Maintenance</option>
            <option>Salary</option>
            <option>Tolls & Fees</option>
          </select>
          <input type="text" placeholder="Search ID..." style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', flex: 1 }} />
        </div>
        <Table 
          headers={['ID', 'Date', 'Vehicle', 'Category', 'Amount', 'Status', 'Actions']}
          data={expenses}
          renderRow={(e, i) => (
            <tr key={i}>
              <td style={{fontWeight: 'bold'}}>{e.id}</td>
              <td>{e.date}</td>
              <td>{e.vehicle}</td>
              <td>{e.category}</td>
              <td style={{ fontFamily: 'monospace' }}>{e.amount}</td>
              <td><StatusBadge status={e.status} /></td>
              <td><a href="#" style={{fontSize:'0.875rem'}}>View Receipt</a></td>
            </tr>
          )}
        />
      </Card>
    </DashboardLayout>
  );
};
export default ExpenseManagement;
