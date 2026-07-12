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
