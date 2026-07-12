import os

def write(file_path, content):
    full_path = os.path.join(os.path.dirname(__file__), file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')

index_css = """
:root {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --bg-tertiary: #2a2a2a;
  
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  
  --accent-primary: #3b82f6;
  --accent-hover: #2563eb;
  
  --border-color: #333333;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-family);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent-primary);
  text-decoration: none;
}
"""
write('src/index.css', index_css)

write('src/components/common/Button.jsx', """
import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', onClick, type = 'button', className = '' }) => {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
export default Button;
""")

write('src/components/common/Button.css', """
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.btn-primary {
  background-color: var(--accent-primary);
  color: white;
}
.btn-primary:hover {
  background-color: var(--accent-hover);
}
.btn-secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
.btn-secondary:hover {
  background-color: var(--border-color);
}
""")

write('src/components/common/Card.jsx', """
import React from 'react';
import './Card.css';

const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  );
};
export default Card;
""")

write('src/components/common/Card.css', """
.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.card-title {
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}
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

write('src/components/common/Table.css', """
.table-container {
  overflow-x: auto;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th, .table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}
.table th {
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
}
.table-empty {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem !important;
}
""")

for name in ['Modal', 'Loader', 'Pagination', 'SearchBar', 'StatusBadge', 'EmptyState']:
    write(f'src/components/common/{name}.jsx', f"""
import React from 'react';
const {name} = () => <div>{name} Component Placeholder</div>;
export default {name};
""")

write('src/components/layout/Navbar.jsx', """
import React from 'react';
import { Bell, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">TransitOps</div>
      <div className="navbar-actions">
        <button className="icon-btn"><Bell size={20} /></button>
        <button className="icon-btn"><User size={20} /></button>
      </div>
    </header>
  );
};
export default Navbar;
""")
write('src/components/layout/Navbar.css', """
.navbar {
  height: 64px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
}
.navbar-brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--accent-primary);
}
.navbar-actions {
  display: flex;
  gap: 1rem;
}
.icon-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}
.icon-btn:hover {
  color: var(--text-primary);
}
""")

write('src/components/layout/Sidebar.jsx', """
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Vehicles', path: '/vehicles', icon: <Truck size={20} /> },
    { name: 'Drivers', path: '/drivers', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
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
write('src/components/layout/Sidebar.css', """
.sidebar {
  width: 250px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px;
  overflow-y: auto;
}
.sidebar-nav {
  padding: 1rem 0;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  gap: 0.75rem;
  transition: all 0.2s;
}
.nav-item:hover, .nav-item.active {
  color: var(--text-primary);
  background-color: var(--bg-tertiary);
  border-right: 3px solid var(--accent-primary);
}
""")

write('src/components/layout/DashboardLayout.jsx', """
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
""")
write('src/components/layout/DashboardLayout.css', """
.dashboard-layout {
  min-height: 100vh;
}
.dashboard-body {
  display: flex;
}
.dashboard-main {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background-color: var(--bg-primary);
  min-height: calc(100vh - 64px);
}
@media (max-width: 768px) {
  .dashboard-main {
    margin-left: 0;
  }
}
""")

for name in ['BarChart', 'LineChart', 'PieChart', 'AreaChart']:
    write(f'src/components/charts/{name}.jsx', f"""
import React from 'react';
const {name} = () => <div style={{{{height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)', borderRadius: '4px', color: 'var(--text-secondary)'}}}}>{name} Placeholder</div>;
export default {name};
""")

def generate_page(name, role):
    return f"""
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const {name} = () => {{
  return (
    <DashboardLayout>
      <div className="page-header" style={{{{marginBottom: '2rem'}}}}>
        <h2>{role} / {name}</h2>
        <p style={{{{color: 'var(--text-secondary)'}}}}>Home > {role} > {name}</p>
      </div>
      <div className="page-content">
        <Card title="{name} Overview">
          <p>This is a placeholder for the {name} page.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}};
export default {name};
"""

pages = {
  'auth': ['Login', 'Register', 'Unauthorized'],
  'fleetManager': ['Dashboard', 'Vehicles', 'VehicleDetails', 'Drivers', 'DriverDetails', 'DispatchTrips', 'DispatchHistory', 'Maintenance', 'FuelLogs', 'Expenses', 'Reports', 'Settings', 'Profile'],
  'driver': ['Dashboard', 'MyTrips', 'CurrentTrip', 'FuelLogs', 'TripHistory', 'Settings', 'Profile'],
  'safetyOfficer': ['Dashboard', 'DriverCompliance', 'LicenseMonitoring', 'VehicleSafety', 'IncidentReports', 'SafetyReports', 'Settings', 'Profile'],
  'financialAnalyst': ['Dashboard', 'FuelReports', 'OperationalCost', 'VehicleROI', 'ExpenseManagement', 'BudgetReports', 'ExportReports', 'Settings', 'Profile']
}

for role, page_list in pages.items():
    for page in page_list:
        write(f'src/pages/{role}/{page}.jsx', generate_page(page, role))

write('src/pages/auth/Login.jsx', """
import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Login = () => {
  return (
    <div style={{display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)'}}>
      <Card title="TransitOps Login" className="login-card" style={{width: '400px'}}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{marginBottom: '1rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Email</label>
            <input type="email" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'white'}} placeholder="admin@transitops.com"/>
          </div>
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Password</label>
            <input type="password" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'white'}} placeholder="••••••••"/>
          </div>
          <Button variant="primary" style={{width: '100%'}}>Sign In</Button>
        </form>
      </Card>
    </div>
  );
};
export default Login;
""")

write('src/App.jsx', """
import React from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AppRoutes />
  );
}

export default App;
""")

write('src/main.jsx', """
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
""")

write('src/routes/AppRoutes.jsx', """
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/fleetManager/Dashboard';
import Vehicles from '../pages/fleetManager/Vehicles';
import Drivers from '../pages/fleetManager/Drivers';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/drivers" element={<Drivers />} />
      {/* Other routes can be mapped similarly */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};
export default AppRoutes;
""")

print("Successfully generated all code content via python!")
