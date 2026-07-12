import os

def write(file_path, content):
    full_path = os.path.join(os.path.dirname(__file__), file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')

# Fleet Manager Dashboard
write('src/pages/fleetManager/Dashboard.jsx', """
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import { Truck, Users, Activity, AlertTriangle } from 'lucide-react';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { dashboardService } from '../../services/dashboardService';
import { tripService } from '../../services/tripService';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const kpiRes = await dashboardService.getKPIs();
        const tripRes = await tripService.list();
        setKpis(kpiRes);
        setTrips(tripRes);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
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
          <h3>Loading dashboard statistics...</h3>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Fleet Manager Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, admin. Here is what's happening with your fleet today.</p>
      </div>
      
      <div className="responsive-grid-cards">
        <Card title="Total Vehicles" icon={<Truck size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{kpis?.totalVehicles || 0}</div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem' }}>{kpis?.availableVehicles || 0} available</div>
        </Card>
        <Card title="Drivers Active" icon={<Users size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{kpis?.driversOnDuty || 0}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>On duty today</div>
        </Card>
        <Card title="Active Trips" icon={<Activity size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{kpis?.activeTrips || 0}</div>
          <div style={{ color: 'var(--accent-primary)', fontSize: '0.875rem' }}>{kpis?.pendingTrips || 0} pending</div>
        </Card>
        <Card title="Vehicles In Shop" icon={<AlertTriangle size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{kpis?.vehiclesInShop || 0}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Require attention</div>
        </Card>
      </div>

      <div className="responsive-grid-2">
        <Card title="Trips Overview (7 Days)">
          <BarChart />
        </Card>
        <Card title="Vehicle Status Distribution">
          <PieChart />
        </Card>
      </div>

      <Card title="Recent Dispatch Activity">
        <Table 
          headers={['Trip ID/Number', 'Start Location', 'End Location', 'Cargo Weight (kg)', 'Status', 'Action']}
          data={trips}
          renderRow={(row, i) => (
            <tr key={i}>
              <td style={{fontWeight: 'bold'}}>{row.trip_number}</td>
              <td>{row.start_location}</td>
              <td>{row.end_location}</td>
              <td>{row.cargo_weight.toLocaleString()}</td>
              <td><StatusBadge status={row.status || 'Pending'} /></td>
              <td><a href="#" style={{fontSize:'0.875rem'}}>View Details</a></td>
            </tr>
          )}
        />
      </Card>
    </DashboardLayout>
  );
};
export default Dashboard;
""")

# Vehicles list API Connection
write('src/pages/fleetManager/Vehicles.jsx', """
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { vehicleService } from '../../services/vehicleService';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const res = await vehicleService.list();
        setVehicles(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <h3>Loading vehicles list...</h3>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Vehicles Fleet</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your vehicles, track status, and view specifications.</p>
        </div>
        <Button variant="primary">+ Add Vehicle</Button>
      </div>
      
      <Card>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <input type="text" placeholder="Search vehicles..." style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', flex: 1 }} />
          <select style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <option>All Statuses</option>
            <option>Available</option>
            <option>On Trip</option>
            <option>In Shop</option>
          </select>
        </div>
        <Table 
          headers={['ID', 'Plate Number', 'Model & Make', 'Type', 'Capacity (kg)', 'Region', 'Status']}
          data={vehicles}
          renderRow={(v, i) => (
            <tr key={i}>
              <td style={{fontWeight: 'bold'}}>{v.id}</td>
              <td>{v.plate_number}</td>
              <td>{v.model}</td>
              <td>{v.type}</td>
              <td>{v.capacity.toLocaleString()}</td>
              <td>{v.region}</td>
              <td><StatusBadge status={v.status} /></td>
            </tr>
          )}
        />
      </Card>
    </DashboardLayout>
  );
};
export default Vehicles;
""")

# Drivers List API Connection
write('src/pages/fleetManager/Drivers.jsx', """
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { driverService } from '../../services/driverService';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const res = await driverService.list();
        setDrivers(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <h3>Loading drivers directory...</h3>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Driver Directory</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage driver profiles, licenses, and compliance.</p>
        </div>
        <Button variant="primary">+ Add Driver</Button>
      </div>
      
      <Card>
        <Table 
          headers={['Driver ID', 'Name', 'Phone', 'License Type', 'License Expiry', 'Status', 'Actions']}
          data={drivers}
          renderRow={(d, i) => (
            <tr key={i}>
              <td style={{fontWeight: 'bold'}}>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.phone}</td>
              <td>{d.license}</td>
              <td style={{ color: d.status === 'Expiring Soon' ? 'var(--danger)' : 'inherit'}}>{d.expiry}</td>
              <td><StatusBadge status={d.status} /></td>
              <td><a href="#" style={{fontSize:'0.875rem'}}>View Profile</a></td>
            </tr>
          )}
        />
      </Card>
    </DashboardLayout>
  );
};
export default Drivers;
""")

# Financial Analyst Dashboard Connection
write('src/pages/financialAnalyst/Dashboard.jsx', """
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
""")

# Expense Management page connection
write('src/pages/financialAnalyst/ExpenseManagement.jsx', """
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { expenseService } from '../../services/expenseService';

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await expenseService.list();
        setExpenses(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <h3>Loading expenses logs...</h3>
        </div>
      </DashboardLayout>
    );
  }

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

print("Frontend components successfully connected to API services!")
