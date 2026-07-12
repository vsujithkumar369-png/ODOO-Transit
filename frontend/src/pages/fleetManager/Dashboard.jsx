import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import { Truck, Users, Activity, AlertTriangle } from 'lucide-react';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';

const Dashboard = () => {
  const recentTrips = [
    { id: 'TRP-101', driver: 'John Doe', vehicle: 'Ford Transit 2021', status: 'On Trip' },
    { id: 'TRP-102', driver: 'Alice Smith', vehicle: 'Mercedes Sprinter', status: 'Completed' },
    { id: 'TRP-103', driver: 'Robert Fox', vehicle: 'Volvo VNL 860', status: 'Pending' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Fleet Manager Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, admin. Here is what's happening with your fleet today.</p>
      </div>
      
      <div className="responsive-grid-cards">
        <Card title="Total Vehicles" icon={<Truck size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>42</div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem' }}>+2 this month</div>
        </Card>
        <Card title="Active Drivers" icon={<Users size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>38</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>4 off duty</div>
        </Card>
        <Card title="Active Trips" icon={<Activity size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>12</div>
          <div style={{ color: 'var(--accent-primary)', fontSize: '0.875rem' }}>Currently en route</div>
        </Card>
        <Card title="Maintenance Alerts" icon={<AlertTriangle size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>3</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Require immediate attention</div>
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
          headers={['Trip ID', 'Driver', 'Vehicle', 'Status', 'Action']}
          data={recentTrips}
          renderRow={(row, i) => (
            <tr key={i}>
              <td>{row.id}</td>
              <td>{row.driver}</td>
              <td>{row.vehicle}</td>
              <td><StatusBadge status={row.status} /></td>
              <td><a href="#" style={{fontSize:'0.875rem'}}>View Details</a></td>
            </tr>
          )}
        />
      </Card>
    </DashboardLayout>
  );
};
export default Dashboard;
