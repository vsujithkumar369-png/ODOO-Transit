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
