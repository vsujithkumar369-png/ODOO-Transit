import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { maintenanceService } from '../../services/maintenanceService';
import { PenTool } from 'lucide-react';

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    maintenanceService.list().then(res => {
      setLogs(res);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Maintenance Logs</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track vehicle servicing, repairs, and scheduled maintenance.</p>
        </div>
        <Button variant="primary">+ New Maintenance Log</Button>
      </div>

      <div className="responsive-grid-cards" style={{ marginBottom: '2rem' }}>
        <Card title="Total Logs" icon={<PenTool size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{logs.length}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>All time</div>
        </Card>
        <Card title="In Progress">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
            {logs.filter(l => l.status === 'In Progress').length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Currently active</div>
        </Card>
        <Card title="Scheduled">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
            {logs.filter(l => l.status === 'Scheduled').length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Upcoming</div>
        </Card>
        <Card title="Completed">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
            {logs.filter(l => l.status === 'Completed').length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>This month</div>
        </Card>
      </div>

      <Card title="Maintenance History">
        {loading ? <p>Loading...</p> : (
          <Table
            headers={['ID', 'Vehicle Plate', 'Service Type', 'Technician', 'Date', 'Cost (₹)', 'Status']}
            data={logs}
            renderRow={(row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 'bold' }}>#{row.id}</td>
                <td>{row.vehicle}</td>
                <td>{row.type}</td>
                <td>{row.technician}</td>
                <td>{row.date}</td>
                <td style={{ fontFamily: 'monospace' }}>₹{row.cost.toLocaleString()}</td>
                <td><StatusBadge status={row.status} /></td>
              </tr>
            )}
          />
        )}
      </Card>
    </DashboardLayout>
  );
};
export default Maintenance;
