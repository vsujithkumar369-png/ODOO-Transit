import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';

const VehicleROI = () => {
  const roiData = [
    { id: 'V-001', make: 'Ford Transit', cost: '$45,000', revenue: '$110,000', maintenance: '$5,200', roi: '132%', status: 'Excellent' },
    { id: 'V-002', make: 'Mercedes Sprinter', cost: '$55,000', revenue: '$95,000', maintenance: '$3,100', roi: '67%', status: 'Good' },
    { id: 'V-003', make: 'Volvo VNL 860', cost: '$165,000', revenue: '$210,000', maintenance: '$22,000', roi: '14%', status: 'Average' },
    { id: 'V-004', make: 'Chevrolet Express', cost: '$38,000', revenue: '$25,000', maintenance: '$8,500', roi: '-56%', status: 'Poor' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Vehicle ROI Analysis</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Analyze profitability per asset by comparing acquisition and maintenance costs against revenue generated.</p>
      </div>
      
      <Card>
        <Table 
          headers={['Vehicle ID', 'Make & Model', 'Acquisition Cost', 'Total Maint. Cost', 'Total Revenue', 'ROI %', 'Performance']}
          data={roiData}
          renderRow={(v, i) => (
            <tr key={i}>
              <td style={{fontWeight: 'bold'}}>{v.id}</td>
              <td>{v.make}</td>
              <td>{v.cost}</td>
              <td style={{ color: 'var(--danger)' }}>{v.maintenance}</td>
              <td style={{ color: 'var(--success)' }}>{v.revenue}</td>
              <td style={{ fontWeight: 'bold', color: v.roi.includes('-') ? 'var(--danger)' : 'var(--success)' }}>{v.roi}</td>
              <td style={{ 
                color: v.status === 'Excellent' ? 'var(--success)' : 
                       v.status === 'Poor' ? 'var(--danger)' : 'var(--warning)' 
              }}>{v.status}</td>
            </tr>
          )}
        />
      </Card>
    </DashboardLayout>
  );
};
export default VehicleROI;
