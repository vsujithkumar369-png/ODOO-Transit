import os

def write(file_path, content):
    full_path = os.path.join(os.path.dirname(__file__), file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')

# Common Components
write('src/components/common/StatusBadge.jsx', """
import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor = 'var(--bg-tertiary)';
  let color = 'var(--text-secondary)';
  
  const normalized = status.toLowerCase();
  
  if (normalized.includes('active') || normalized.includes('available') || normalized.includes('completed')) {
    bgColor = 'rgba(34, 197, 94, 0.1)';
    color = 'var(--success)';
  } else if (normalized.includes('maintenance') || normalized.includes('shop') || normalized.includes('pending')) {
    bgColor = 'rgba(245, 158, 11, 0.1)';
    color = 'var(--warning)';
  } else if (normalized.includes('trip') || normalized.includes('route')) {
    bgColor = 'rgba(59, 130, 246, 0.1)';
    color = 'var(--accent-primary)';
  } else if (normalized.includes('retired') || normalized.includes('inactive')) {
    bgColor = 'rgba(239, 68, 68, 0.1)';
    color = 'var(--danger)';
  }

  return (
    <span style={{
      backgroundColor: bgColor,
      color: color,
      padding: '4px 8px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'capitalize'
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;
""")

write('src/components/common/Card.jsx', """
import React from 'react';
import './Card.css';

const Card = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {(title || icon) && (
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          {icon && <span style={{ color: 'var(--accent-primary)', display: 'flex' }}>{icon}</span>}
          {title && <h3 className="card-title" style={{ marginBottom: 0 }}>{title}</h3>}
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};
export default Card;
""")

write('src/components/common/Table.jsx', """
import React from 'react';
import './Table.css';

const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, index) => renderRow(row, index))
          ) : (
            <tr>
              <td colSpan={headers.length} className="table-empty">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
""")

# Dashboard Page
write('src/pages/fleetManager/Dashboard.jsx', """
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
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
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
""")

write('src/pages/fleetManager/Vehicles.jsx', """
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

const Vehicles = () => {
  const vehicles = [
    { id: 'V-001', make: 'Ford Transit', type: 'Van', capacity: '1.5t', odo: '45,200 km', status: 'Available' },
    { id: 'V-002', make: 'Mercedes Sprinter', type: 'Van', capacity: '2.0t', odo: '12,500 km', status: 'On Trip' },
    { id: 'V-003', make: 'Volvo VNL 860', type: 'Semi-Truck', capacity: '18t', odo: '142,000 km', status: 'In Shop' },
    { id: 'V-004', make: 'Chevrolet Express', type: 'Van', capacity: '1.2t', odo: '89,000 km', status: 'Available' },
    { id: 'V-005', make: 'Freightliner Cascadia', type: 'Semi-Truck', capacity: '20t', odo: '210,000 km', status: 'On Trip' },
  ];

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
          <input type="text" placeholder="Search vehicles..." style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'white', flex: 1 }} />
          <select style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'white' }}>
            <option>All Statuses</option>
            <option>Available</option>
            <option>On Trip</option>
            <option>In Shop</option>
          </select>
        </div>
        <Table 
          headers={['Reg/ID', 'Make & Model', 'Type', 'Capacity', 'Odometer', 'Status', 'Actions']}
          data={vehicles}
          renderRow={(v, i) => (
            <tr key={i}>
              <td style={{fontWeight: 'bold'}}>{v.id}</td>
              <td>{v.make}</td>
              <td>{v.type}</td>
              <td>{v.capacity}</td>
              <td>{v.odo}</td>
              <td><StatusBadge status={v.status} /></td>
              <td><a href={`/vehicles/${v.id}`} style={{fontSize:'0.875rem'}}>Manage</a></td>
            </tr>
          )}
        />
      </Card>
    </DashboardLayout>
  );
};
export default Vehicles;
""")

write('src/pages/fleetManager/Drivers.jsx', """
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

const Drivers = () => {
  const drivers = [
    { id: 'D-101', name: 'John Doe', phone: '+1 234 567 890', license: 'CDL-A', expiry: '2027-10-15', status: 'Active' },
    { id: 'D-102', name: 'Alice Smith', phone: '+1 987 654 321', license: 'CDL-B', expiry: '2026-05-22', status: 'On Trip' },
    { id: 'D-103', name: 'Robert Fox', phone: '+1 555 444 333', license: 'CDL-A', expiry: '2024-01-10', status: 'Expiring Soon' },
    { id: 'D-104', name: 'Michael Scott', phone: '+1 111 222 333', license: 'Standard', expiry: '2028-12-01', status: 'Inactive' },
  ];

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

write('src/pages/fleetManager/DispatchTrips.jsx', """
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const DispatchTrips = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Dispatch New Trip</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Assign a driver and vehicle to a new route.</p>
      </div>
      
      <div style={{ maxWidth: '800px' }}>
        <Card title="Trip Details">
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Origin</label>
                <input type="text" style={{width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'white'}} placeholder="Enter starting location" />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Destination</label>
                <input type="text" style={{width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'white'}} placeholder="Enter destination" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Assign Vehicle</label>
                <select style={{width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'white'}}>
                  <option>Select an available vehicle...</option>
                  <option>V-001 (Ford Transit)</option>
                  <option>V-004 (Chevrolet Express)</option>
                </select>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Assign Driver</label>
                <select style={{width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'white'}}>
                  <option>Select an available driver...</option>
                  <option>D-101 (John Doe)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Cargo Details / Instructions</label>
              <textarea rows="4" style={{width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'white'}} placeholder="Enter cargo weight, type, and special instructions..."></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Dispatch Trip</Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default DispatchTrips;
""")

write('src/components/layout/Sidebar.jsx', """
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Map, Clock, PenTool, Droplet, DollarSign, FileText, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Vehicles', path: '/vehicles', icon: <Truck size={20} /> },
    { name: 'Drivers', path: '/drivers', icon: <Users size={20} /> },
    { name: 'Dispatch New Trip', path: '/dispatch', icon: <Map size={20} /> },
    { name: 'Dispatch History', path: '/history', icon: <Clock size={20} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <PenTool size={20} /> },
    { name: 'Fuel Logs', path: '/fuel', icon: <Droplet size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <DollarSign size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Fleet Manager</div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <NavLink key={item.name} to={item.path} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
export default Sidebar;
""")

write('src/routes/AppRoutes.jsx', """
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';

// Fleet Manager Pages
import Dashboard from '../pages/fleetManager/Dashboard';
import Vehicles from '../pages/fleetManager/Vehicles';
import Drivers from '../pages/fleetManager/Drivers';
import DispatchTrips from '../pages/fleetManager/DispatchTrips';
import DispatchHistory from '../pages/fleetManager/DispatchHistory';
import Maintenance from '../pages/fleetManager/Maintenance';
import FuelLogs from '../pages/fleetManager/FuelLogs';
import Expenses from '../pages/fleetManager/Expenses';
import Reports from '../pages/fleetManager/Reports';
import Settings from '../pages/fleetManager/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/drivers" element={<Drivers />} />
      <Route path="/dispatch" element={<DispatchTrips />} />
      <Route path="/history" element={<DispatchHistory />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/fuel" element={<FuelLogs />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};
export default AppRoutes;
""")

# Provide minimal placeholders for the rest so they don't break
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

write('src/pages/fleetManager/DispatchHistory.jsx', generate_minimal_page('DispatchHistory', 'Dispatch History'))
write('src/pages/fleetManager/Maintenance.jsx', generate_minimal_page('Maintenance', 'Maintenance Logs'))
write('src/pages/fleetManager/FuelLogs.jsx', generate_minimal_page('FuelLogs', 'Fuel Consumption Logs'))
write('src/pages/fleetManager/Expenses.jsx', generate_minimal_page('Expenses', 'Operational Expenses'))
write('src/pages/fleetManager/Reports.jsx', generate_minimal_page('Reports', 'Data Reports'))
write('src/pages/fleetManager/Settings.jsx', generate_minimal_page('Settings', 'Account Settings'))

print("Fleet Manager UI script complete!")
