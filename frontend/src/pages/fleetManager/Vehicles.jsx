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
