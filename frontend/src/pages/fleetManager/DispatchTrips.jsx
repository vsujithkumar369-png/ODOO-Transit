import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { tripService } from '../../services/tripService';
import { Map } from 'lucide-react';

const DispatchTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripService.list().then(res => {
      setTrips(res);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Dispatch Trips</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage trip dispatching, monitor active routes, and track deliveries.</p>
        </div>
        <Button variant="primary">+ Create Trip</Button>
      </div>

      <div className="responsive-grid-cards" style={{ marginBottom: '2rem' }}>
        <Card title="Total Trips" icon={<Map size={20} />}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{trips.length}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>All trips</div>
        </Card>
        <Card title="On Trip">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
            {trips.filter(t => t.status === 'On Trip').length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Currently active</div>
        </Card>
        <Card title="Pending Dispatch">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
            {trips.filter(t => t.status === 'Draft' || t.status === 'Pending').length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Awaiting dispatch</div>
        </Card>
        <Card title="Completed">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
            {trips.filter(t => t.status === 'Completed').length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>This week</div>
        </Card>
      </div>

      <Card title="All Trips">
        {loading ? <p>Loading trips...</p> : (
          <Table
            headers={['Trip No.', 'Vehicle ID', 'Driver ID', 'From', 'To', 'Cargo (kg)', 'Status', 'Actions']}
            data={trips}
            renderRow={(row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 'bold' }}>{row.trip_number}</td>
                <td>{row.vehicle_id}</td>
                <td>{row.driver_id}</td>
                <td>{row.start_location}</td>
                <td>{row.end_location}</td>
                <td>{row.cargo_weight.toLocaleString()}</td>
                <td><StatusBadge status={row.status || 'Draft'} /></td>
                <td>
                  <span style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.875rem' }}>Dispatch →</span>
                </td>
              </tr>
            )}
          />
        )}
      </Card>
    </DashboardLayout>
  );
};
export default DispatchTrips;
