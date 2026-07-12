import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import { DollarSign, TrendingUp, AlertTriangle, Briefcase } from 'lucide-react';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';

const Dashboard = () => {
  const recentExpenses = [
    { id: 'EXP-9021', date: '2026-07-10', category: 'Fuel', amount: '$4,250.00', status: 'Cleared' },
    { id: 'EXP-9022', date: '2026-07-11', category: 'Maintenance', amount: '$1,820.50', status: 'Pending' },
    { id: 'EXP-9023', date: '2026-07-11', category: 'Salary', amount: '$12,400.00', status: 'Cleared' },
    { id: 'EXP-9024', date: '2026-07-12', category: 'Tolls & Fees', amount: '$340.00', status: 'Processing' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Financial Overview</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Track revenue, operational costs, and fleet profitability.</p>
      </div>
      
      <div className="responsive-grid-cards">
        <Card title="Total Revenue (YTD)" icon={<TrendingUp size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>$842,500</div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem' }}>+12% vs last year</div>
        </Card>
        <Card title="Operational Costs" icon={<Briefcase size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>$315,200</div>
          <div style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>+4% vs last month</div>
        </Card>
        <Card title="Net Profit Margin" icon={<DollarSign size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>28.4%</div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem' }}>Healthy</div>
        </Card>
        <Card title="Budget Alerts" icon={<AlertTriangle size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>2</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Fuel budget near limit</div>
        </Card>
      </div>

      <div className="responsive-grid-2">
        <Card title="Revenue vs Expenses (Last 6 Months)">
          <BarChart />
        </Card>
        <Card title="Expense Distribution">
          <PieChart />
        </Card>
      </div>

      <Card title="Recent Large Expenses">
        <Table 
          headers={['Transaction ID', 'Date', 'Category', 'Amount', 'Status']}
          data={recentExpenses}
          renderRow={(row, i) => (
            <tr key={i}>
              <td style={{fontWeight: 'bold'}}>{row.id}</td>
              <td>{row.date}</td>
              <td>{row.category}</td>
              <td style={{ fontFamily: 'monospace', fontSize: '1.1em' }}>{row.amount}</td>
              <td><StatusBadge status={row.status} /></td>
            </tr>
          )}
        />
      </Card>
    </DashboardLayout>
  );
};
export default Dashboard;
