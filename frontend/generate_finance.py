import os

def write(file_path, content):
    full_path = os.path.join(os.path.dirname(__file__), file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')

# Financial Analyst Pages

write('src/pages/financialAnalyst/Dashboard.jsx', """
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
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
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
""")

write('src/pages/financialAnalyst/ExpenseManagement.jsx', """
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
""")

write('src/pages/financialAnalyst/VehicleROI.jsx', """
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';

const VehicleROI = () => {
  const roiData = [
    { id: 'V-001', make: 'Ford Transit', cost: '$45,000', revenue: '$110,000', maintenance: '$5,200', roi: '132%', status: 'Excellent' },
    { id: 'V-002', make: 'Mercedes Sprinter', cost: '$55,000', revenue: '$95,000', maintenance: '$3,100', roi: '67%', status: 'Good' },
    { id: 'V-003', make: 'Volvo VNL 860', cost: '$165,000', revenue: '$210,000', maintenance: '$22,000', roi: '14%', status: 'Average' },
    { id: 'V-004', make: 'Chevrolet Express', cost: '$38,000', revenue: '$25,000', maintenance: '$8,500', roi: '-56%', status: 'Poor' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Vehicle ROI Analysis</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Analyze profitability per asset by comparing acquisition and maintenance costs against revenue generated.</p>
      </div>
      
      <Card>
        <Table 
          headers={['Vehicle ID', 'Make & Model', 'Acquisition Cost', 'Total Maint. Cost', 'Total Revenue', 'ROI %', 'Performance']}
          data={roiData}
          renderRow={(v, i) => (
            <tr key={i}>
              <td style={{fontWeight: 'bold'}}>{v.id}</td>
              <td>{v.make}</td>
              <td>{v.cost}</td>
              <td style={{ color: 'var(--danger)' }}>{v.maintenance}</td>
              <td style={{ color: 'var(--success)' }}>{v.revenue}</td>
              <td style={{ fontWeight: 'bold', color: v.roi.includes('-') ? 'var(--danger)' : 'var(--success)' }}>{v.roi}</td>
              <td style={{ 
                color: v.status === 'Excellent' ? 'var(--success)' : 
                       v.status === 'Poor' ? 'var(--danger)' : 'var(--warning)' 
              }}>{v.status}</td>
            </tr>
          )}
        />
      </Card>
    </DashboardLayout>
  );
};
export default VehicleROI;
""")

write('src/pages/financialAnalyst/BudgetReports.jsx', """
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const ProgressBar = ({ label, current, max, color }) => {
  const percent = Math.min((current / max) * 100, 100);
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
        <span>{label}</span>
        <span>${current.toLocaleString()} / ${max.toLocaleString()}</span>
      </div>
      <div style={{ width: '100%', backgroundColor: 'var(--bg-tertiary)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, backgroundColor: color, height: '100%' }}></div>
      </div>
    </div>
  );
};

const BudgetReports = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Monthly Budget Tracking</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor departmental spend against allocated budgets.</p>
        </div>
        <select style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          <option>July 2026</option>
          <option>June 2026</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <Card title="Departmental Budgets">
          <ProgressBar label="Fuel Budget" current={42500} max={50000} color="var(--warning)" />
          <ProgressBar label="Maintenance Budget" current={12000} max={25000} color="var(--success)" />
          <ProgressBar label="Driver Salaries" current={85000} max={90000} color="var(--accent-primary)" />
          <ProgressBar label="Insurance & Tolls" current={15500} max={15000} color="var(--danger)" />
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default BudgetReports;
""")

write('src/pages/financialAnalyst/ExportReports.jsx', """
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
""")

def generate_minimal_page(name, title):
    return f"""
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const {name} = () => {{
  return (
    <DashboardLayout>
      <div className="page-header" style={{{{ marginBottom: '2rem' }}}}>
        <h2>{title}</h2>
      </div>
      <Card title="{title} Data">
        <p>This is a placeholder page for {title} waiting for API integration.</p>
      </Card>
    </DashboardLayout>
  );
}};
export default {name};
"""

write('src/pages/financialAnalyst/FuelReports.jsx', generate_minimal_page('FuelReports', 'Fuel Expenditure Reports'))
write('src/pages/financialAnalyst/OperationalCost.jsx', generate_minimal_page('OperationalCost', 'Operational Cost Analysis'))

print("Financial Analyst UI script complete!")
