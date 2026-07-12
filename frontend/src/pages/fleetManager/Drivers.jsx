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
