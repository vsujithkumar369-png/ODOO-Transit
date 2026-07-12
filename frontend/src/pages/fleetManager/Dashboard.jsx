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
