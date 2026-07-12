import React, { useState, useEffect, useCallback } from 'react';
import { Users, AlertCircle, FileWarning, TrendingUp, CheckCircle, Clock, ShieldAlert, RefreshCw, Filter } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import { SkeletonCard } from '../../components/common/SkeletonLoader';
import { ErrorState, EmptyState } from '../../components/common/StateComponents';
import Toast from '../../components/common/Toast';
import DebouncedSearchBar from '../../components/common/DebouncedSearchBar';
import { safetyDashboardService } from '../../services/safetyDashboardService';

// ─── KPI Card ────────────────────────────────────────────────────────────────
const KPICard = ({ label, value, Icon, iconColor }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Icon size={32} style={{ color: iconColor, flexShrink: 0 }} />
      <div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500', margin: 0 }}>{label}</p>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: '4px 0 0' }}>
          {value ?? '—'}
        </h3>
      </div>
    </div>
  </Card>
);

// ─── Priority Badge ───────────────────────────────────────────────────────────
const priorityStyle = { Critical: { bg: '#fee2e2', color: '#b91c1c' }, Warning: { bg: '#fef9c3', color: '#92400e' }, Information: { bg: '#dbeafe', color: '#1e40af' } };
const PriorityBadge = ({ priority }) => {
  const s = priorityStyle[priority] || priorityStyle.Information;
  return <span style={{ backgroundColor: s.bg, color: s.color, padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '700' }}>{priority}</span>;
};

// ─── Alert Filter Tabs ────────────────────────────────────────────────────────
const ALERT_FILTERS = ['All', 'Critical', 'Warning', 'Information'];

const Dashboard = () => {
  const [kpis, setKpis]           = useState(null);
  const [alerts, setAlerts]       = useState([]);
  const [activities, setActivities] = useState([]);
  const [kpiLoading, setKpiLoading]       = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [kpiError, setKpiError]     = useState(null);
  const [alertsError, setAlertsError] = useState(null);
  const [alertFilter, setAlertFilter] = useState('All');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [toast, setToast]           = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchKPIs = useCallback(async () => {
    setKpiLoading(true);
    setKpiError(null);
    try {
      const data = await safetyDashboardService.getKPIs();
      if (!data) throw new Error('No data returned');
      setKpis(data);
      setLastUpdated(new Date());
    } catch {
      setKpiError('Failed to load KPI data.');
    } finally {
      setKpiLoading(false);
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    setAlertsLoading(true);
    setAlertsError(null);
    try {
      // TODO: GET /api/dashboard/alerts
      const data = await safetyDashboardService.getAlerts();
      setAlerts(data || []);
    } catch {
      setAlertsError('Failed to load alerts.');
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      // TODO: GET /api/dashboard/activity
      const data = await safetyDashboardService.getActivity();
      setActivities(data || []);
    } catch {
      setActivities([]);
    }
  }, []);

  useEffect(() => {
    fetchKPIs();
    fetchAlerts();
    fetchActivity();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchKPIs();
      fetchAlerts();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchKPIs, fetchAlerts, fetchActivity]);

  const handleRefresh = async () => {
    await Promise.all([fetchKPIs(), fetchAlerts(), fetchActivity()]);
    showToast('success', 'Dashboard refreshed successfully.');
  };

  const kpiCards = [
    { label: 'Total Drivers',         value: kpis?.totalDrivers,         Icon: Users,       iconColor: '#1E3A8A' },
    { label: 'Active Drivers',        value: kpis?.activeDrivers,        Icon: CheckCircle, iconColor: '#22c55e' },
    { label: 'Drivers On Trip',       value: kpis?.driversOnTrip,        Icon: Clock,       iconColor: '#3b82f6' },
    { label: 'Suspended Drivers',     value: kpis?.suspendedDrivers,     Icon: ShieldAlert, iconColor: '#ef4444' },
    { label: 'License Expiring Soon', value: kpis?.licenseExpiringSoon,  Icon: FileWarning, iconColor: '#f59e0b' },
    { label: 'Avg Safety Score',      value: kpis?.averageSafetyScore != null ? `${kpis.averageSafetyScore}%` : null, Icon: TrendingUp, iconColor: '#10b981' },
  ];

  const filteredAlerts = alertFilter === 'All'
    ? alerts
    : alerts.filter(a => a.priority === alertFilter);

  return (
    <DashboardLayout>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Safety Officer / Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Home &gt; Safety Officer &gt; Dashboard</p>
          {lastUpdated && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={kpiLoading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '6px', cursor: kpiLoading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: '500', opacity: kpiLoading ? 0.7 : 1 }}
        >
          <RefreshCw size={14} style={{ animation: kpiLoading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {kpiLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : kpiError
              ? <div style={{ gridColumn: '1/-1' }}><ErrorState message={kpiError} onRetry={fetchKPIs} /></div>
              : kpiCards.map((c) => <KPICard key={c.label} {...c} />)
          }
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          <Card title="Driver Status Distribution">
            <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {/* TODO: GET /api/dashboard/driver-status-distribution — wire to chart.js Pie */}
              Chart loading once backend is available
            </div>
          </Card>
          <Card title="Safety Score Distribution">
            <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {/* TODO: GET /api/dashboard/safety-score-distribution — wire to chart.js Bar */}
              Chart loading once backend is available
            </div>
          </Card>
          <Card title="License Expiry Overview">
            <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {/* TODO: GET /api/license-expiry/overview — wire to chart.js Doughnut */}
              Chart loading once backend is available
            </div>
          </Card>
          <Card title="Monthly Safety Trend">
            <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {/* TODO: GET /api/dashboard/monthly-trend — wire to chart.js Line */}
              Chart loading once backend is available
            </div>
          </Card>
        </div>

        {/* Alerts + Activities */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {/* Recent Alerts */}
          <Card title="Recent Alerts" icon={<AlertCircle size={20} />}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {ALERT_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setAlertFilter(f)}
                  style={{
                    padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', border: '1px solid',
                    backgroundColor: alertFilter === f ? '#1E3A8A' : 'transparent',
                    color: alertFilter === f ? '#fff' : 'var(--text-secondary)',
                    borderColor: alertFilter === f ? '#1E3A8A' : 'var(--border-color)',
                    transition: 'all 0.15s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {alertsLoading ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>Loading alerts...</div>
            ) : alertsError ? (
              <ErrorState message={alertsError} onRetry={fetchAlerts} />
            ) : filteredAlerts.length === 0 ? (
              <EmptyState message="No alerts found." subtext={alertFilter !== 'All' ? `No ${alertFilter} alerts at this time.` : undefined} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredAlerts.map(alert => (
                  <div key={alert.id} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <PriorityBadge priority={alert.priority} />
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{alert.title}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{alert.description}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '6px', opacity: 0.7 }}>{alert.time}</p>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px', height: 'fit-content', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Activities */}
          <Card title="Recent Activities" icon={<Clock size={20} />}>
            {activities.length === 0 ? (
              <EmptyState message="No recent activities." subtext="Activity will appear here once drivers are managed." />
            ) : (
              <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--border-color)' }}>
                {activities.map(act => (
                  <div key={act.id} style={{ position: 'relative', marginBottom: '24px', paddingLeft: '20px' }}>
                    <div style={{ position: 'absolute', left: '-29px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', border: '2px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{act.type}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0' }}>{act.description}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.7, margin: 0 }}>{act.time}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {[
              { label: 'View Drivers',      path: '/compliance', primary: true  },
              { label: 'License Monitoring', path: '/licenses',   primary: false },
              { label: 'Generate Report',    path: '/safety-reports', primary: false },
              { label: 'Refresh Dashboard',  path: null,          primary: false, onClick: handleRefresh },
            ].map(action => (
              <button
                key={action.label}
                onClick={action.onClick || (() => window.location.assign(action.path))}
                style={{
                  padding: '8px 20px', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', border: action.primary ? 'none' : '1px solid var(--border-color)',
                  backgroundColor: action.primary ? '#1E3A8A' : 'transparent',
                  color: action.primary ? '#fff' : 'var(--text-primary)',
                  transition: 'all 0.15s',
                }}
                onMouseOver={(e) => { if (!action.primary) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; }}
                onMouseOut={(e)  => { if (!action.primary) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </DashboardLayout>
  );
};

export default Dashboard;
