import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import { DollarSign, TrendingUp, AlertTriangle, Briefcase } from 'lucide-react';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { dashboardService } from '../../services/dashboardService';
import { expenseService } from '../../services/expenseService';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const kpiRes = await dashboardService.getKPIs();
        const expRes = await expenseService.list();
        setKpis(kpiRes);
        setExpenses(expRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <h3>Loading financial data...</h3>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate mock YTD Revenue based on base + active trips
  const totalRevenue = 842500;
  const totalCosts = (kpis?.totalFuelCost || 0) + (kpis?.totalMaintenanceCost || 0) + 120000;

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Financial Overview</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Track revenue, operational costs, and fleet profitability.</p>
      </div>
      
      <div className="responsive-grid-cards">
        <Card title="Total Revenue (YTD)" icon={<TrendingUp size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalRevenue.toLocaleString()}</div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem' }}>+12% vs last year</div>
        </Card>
        <Card title="Operational Costs" icon={<Briefcase size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalCosts.toLocaleString()}</div>
          <div style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>+4% vs last month</div>
        </Card>
        <Card title="Profit Margin" icon={<DollarSign size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {((totalRevenue - totalCosts) / totalRevenue * 100).toFixed(1)}%
          </div>
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
          data={expenses}
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
