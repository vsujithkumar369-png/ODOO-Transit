import React, { useState, useEffect, useCallback } from 'react';
import { Activity, TrendingUp, DollarSign, Download, Printer, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import { SkeletonCard } from '../../components/common/SkeletonLoader';
import SkeletonRow from '../../components/common/SkeletonLoader';
import { ErrorState, EmptyState } from '../../components/common/StateComponents';
import Toast from '../../components/common/Toast';
import { safetyReportService } from '../../services/safetyReportService';

const SafetyReports = () => {
  const [fleetUtil, setFleetUtil]   = useState(null);
  const [fuelEff, setFuelEff]       = useState(null);
  const [opCost, setOpCost]         = useState(null);
  const [roi, setRoi]               = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError]     = useState(null);

  const [reportRows, setReportRows] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  // Date range filter
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo,   setDateTo]   = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = useCallback((type, msg) => setToast({ type, message: msg }), []);

  const fetchMetrics = useCallback(async () => {
    setMetricsLoading(true);
    setMetricsError(null);
    const params = {};
    if (dateFrom) params.from = dateFrom;
    if (dateTo)   params.to   = dateTo;
    try {
      const [fu, fe, oc, r] = await Promise.all([
        safetyReportService.getFleetUtilization(params),
        safetyReportService.getFuelEfficiency(params),
        safetyReportService.getOperationalCost(params),
        safetyReportService.getVehicleROI(params),
      ]);
      setFleetUtil(fu);
      setFuelEff(fe);
      setOpCost(oc);
      setRoi(r);
    } catch {
      setMetricsError('Failed to load report metrics.');
    } finally {
      setMetricsLoading(false);
    }
  }, [dateFrom, dateTo]);

  const fetchReportsList = useCallback(async () => {
    setReportsLoading(true);
    try {
      // TODO: GET /api/reports/list — list of previously generated report documents
      setReportRows([]);
    } catch {
      setReportRows([]);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMetrics(); fetchReportsList(); }, [fetchMetrics, fetchReportsList]);

  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      const data = await safetyReportService.exportCSV();
      if (data) {
        const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data)], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `safety-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('success', 'CSV export downloaded successfully.');
      } else {
        showToast('warning', 'No data available to export.');
      }
    } catch {
      showToast('error', 'Failed to export CSV.');
    } finally {
      setExportLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const metricCards = [
    { label: 'Fleet Utilization', value: fleetUtil?.rate != null ? `${fleetUtil.rate}%` : null, Icon: Activity, color: '#1E3A8A', raw: fleetUtil },
    { label: 'Fuel Efficiency',   value: fuelEff?.avg   != null ? `${fuelEff.avg} km/l` : null, Icon: TrendingUp, color: '#22c55e', raw: fuelEff },
    { label: 'Operational Cost',  value: opCost?.total  != null ? `$${opCost.total?.toLocaleString()}` : null, Icon: DollarSign, color: '#f59e0b', raw: opCost },
    { label: 'Vehicle ROI',       value: roi?.index     != null ? `${roi.index}%` : null, Icon: TrendingUp, color: '#10b981', raw: roi },
  ];

  return (
    <DashboardLayout>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Safety Officer / Safety Reports</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Home &gt; Safety Officer &gt; Safety Reports</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={handleExportCSV} disabled={exportLoading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '6px', cursor: exportLoading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: '500', opacity: exportLoading ? 0.7 : 1 }}>
            <Download size={14} /> {exportLoading ? 'Exporting...' : 'Export CSV'}
          </button>
          <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Date Range Filter */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Date Range:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: '6px 10px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>to</span>
              <input type="date" value={dateTo}   onChange={e => setDateTo(e.target.value)} style={{ padding: '6px 10px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
            </div>
            <button onClick={fetchMetrics} style={{ padding: '6px 14px', backgroundColor: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>Apply</button>
            <button onClick={() => { setDateFrom(''); setDateTo(''); }} style={{ padding: '6px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Clear</button>
          </div>
        </Card>

        {/* Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {metricsLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : metricsError
              ? <div style={{ gridColumn: '1/-1' }}><ErrorState message={metricsError} onRetry={fetchMetrics} /></div>
              : metricCards.map(c => (
                <Card key={c.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <c.Icon size={30} style={{ color: c.color, flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{c.label}</p>
                      <h3 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{c.value ?? '—'}</h3>
                    </div>
                  </div>
                </Card>
              ))
          }
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          <Card title="Fleet Utilization">
            <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {/* TODO: Wire GET /api/reports/fleet-utilization timeseries to chart.js Bar */}
              Chart — backend data pending
            </div>
          </Card>
          <Card title="Fuel Efficiency">
            <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {/* TODO: Wire GET /api/reports/fuel-efficiency to chart.js Line */}
              Chart — backend data pending
            </div>
          </Card>
          <Card title="Operational Cost">
            <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {/* TODO: Wire GET /api/reports/operational-cost to chart.js Area */}
              Chart — backend data pending
            </div>
          </Card>
          <Card title="Driver Performance">
            <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {/* TODO: GET /api/reports/driver-performance — wire to chart.js Radar or Bar */}
              Chart — backend data pending
            </div>
          </Card>
        </div>

        {/* Generated Reports Table */}
        <Card title="Generated Reports">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button onClick={handleExportCSV} disabled={exportLoading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '6px', cursor: exportLoading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: '500', opacity: exportLoading ? 0.7 : 1 }}>
              <Download size={14} /> Export All (CSV)
            </button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  {['Report Name', 'Type', 'Generated Date', 'Actions'].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {reportsLoading
                  ? <SkeletonRow rows={5} cols={4} />
                  : reportRows.length === 0
                    ? <tr><td colSpan={4}><EmptyState message="No reports generated yet." subtext="TODO: GET /api/reports/list — connect once backend is available." /></td></tr>
                    : reportRows.map(r => (
                      <tr key={r.id} onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--bg-primary)'; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                        <td style={{ fontWeight: '600' }}>{r.name}</td>
                        <td style={{ fontSize: '0.85rem' }}>{r.type}</td>
                        <td style={{ fontSize: '0.85rem' }}>{r.date}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => window.open(r.pdfUrl, '_blank')} style={{ padding: '4px 10px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.78rem', color: '#1E3A8A', fontWeight: '600' }}>PDF</button>
                            <button onClick={() => window.open(r.csvUrl, '_blank')} style={{ padding: '4px 10px', border: 'none', borderRadius: '4px', backgroundColor: 'rgba(34,197,94,.1)', cursor: 'pointer', fontSize: '0.78rem', color: '#15803d', fontWeight: '600' }}>CSV</button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SafetyReports;
