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
