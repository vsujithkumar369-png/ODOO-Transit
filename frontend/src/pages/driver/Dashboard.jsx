import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import useAuth from '../../hooks/useAuth';
import { useTrips } from '../../context/TripsContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Map, Navigation, CheckCircle, Droplet, TrendingUp, Activity,
  ArrowRight, Clock, Bell
} from 'lucide-react';

/* ─── KPI Card ─── */
const KpiCard = ({ title, value, sub, icon, color }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
    <div style={{
      width: 46, height: 46, borderRadius: 10,
      background: color + '18',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, color,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.2rem' }}>{title}</p>
      <p style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{sub}</p>}
    </div>
  </div>
);

/* ─── Quick Action ─── */
const QuickAction = ({ label, path, icon, color }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '0.75rem 1rem',
        border: '1px solid var(--border-color)', borderRadius: '8px',
        background: 'var(--bg-secondary)', cursor: 'pointer',
        fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)',
        transition: 'all 0.2s', fontFamily: 'inherit',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color }}>{icon}</span> {label}
      </span>
      <ArrowRight size={14} style={{ color: 'var(--text-secondary)' }} />
    </button>
  );
};

/* ─── Dashboard ─── */
const Dashboard = () => {
  const { user } = useAuth();
  const { trips, fuelLogs, activeTrip, stats } = useTrips();
  const { notifications } = useNotifications();

  const recentTrips = [...trips]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {activeTrip
              ? `Active trip in progress: ${activeTrip.source} → ${activeTrip.destination}`
              : 'You have no active trip. Start one from My Trips.'}
          </p>
        </div>
        <span style={{
          padding: '0.375rem 1rem', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700,
          background: activeTrip ? 'rgba(34,197,94,0.12)' : 'rgba(0,0,128,0.08)',
          color: activeTrip ? '#16a34a' : 'var(--accent-primary)',
        }}>
          {activeTrip ? '● On Trip' : '● Available'}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="responsive-grid-cards" style={{ marginBottom: '1.5rem' }}>
        <KpiCard title="Assigned / Pending" value={stats.pending} sub="Ready to start" icon={<Map size={20} />} color="#000080" />
        <KpiCard title="Active Trip" value={stats.active} sub={activeTrip ? 'In progress' : 'None'} icon={<Activity size={20} />} color="#F59E0B" />
        <KpiCard title="Completed Trips" value={stats.completed} sub="All time" icon={<CheckCircle size={20} />} color="#22C55E" />
        <KpiCard title="Fuel Logs" value={stats.totalFuelLogs} sub="Submitted" icon={<Droplet size={20} />} color="#3B82F6" />
        <KpiCard title="Total Distance" value={`${stats.totalDistance} km`} sub="Completed trips" icon={<TrendingUp size={20} />} color="#8B5CF6" />
      </div>

      <div className="responsive-grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Active Trip Card */}
        <Card title="Current Trip" icon={<Navigation size={18} />}>
          {activeTrip ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                {[
                  { l: 'Trip ID', v: activeTrip.id },
                  { l: 'Vehicle', v: activeTrip.vehicle },
                  { l: 'From', v: activeTrip.source },
                  { l: 'To', v: activeTrip.destination },
                  { l: 'Cargo', v: `${activeTrip.cargoType} (${activeTrip.cargoWeight} kg)` },
                  { l: 'Distance', v: `${activeTrip.distance} km` },
                ].map(({ l, v }) => (
                  <div key={l} style={{ padding: '0.625rem', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>{l}</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>{activeTrip.source}</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{activeTrip.progress}% Complete</span>
                <span>{activeTrip.destination}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ height: '100%', width: `${activeTrip.progress}%`, background: 'var(--accent-primary)', borderRadius: '4px', transition: 'width 0.5s' }} />
              </div>

              <button
                onClick={() => window.location.href = '/driver/current-trip'}
                style={{ width: '100%', padding: '0.625rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit' }}
              >
                View Full Trip Details →
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <Navigation size={36} style={{ color: 'var(--border-color)', margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No Active Trip</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Go to My Trips to start a trip.</p>
              <button
                onClick={() => window.location.href = '/driver/my-trips'}
                style={{ padding: '0.5rem 1.25rem', background: 'var(--accent-light)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit' }}
              >
                Go to My Trips
              </button>
            </div>
          )}
        </Card>

        {/* Recent Notifications */}
        <Card title="Recent Notifications" icon={<Bell size={18} />}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No notifications yet
            </div>
          ) : (
            <div>
              {notifications.slice(0, 5).map(n => (
                <div key={n.id} style={{
                  display: 'flex', gap: '0.625rem', padding: '0.625rem 0',
                  borderBottom: '1px solid var(--border-color)', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: n.read ? 'var(--border-color)' : 'var(--accent-primary)',
                  }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '2px' }}>{n.type}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.message}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Bottom row */}
      <div className="responsive-grid-2">
        {/* Recent Trips table */}
        <Card title="Recent Trips" icon={<Map size={18} />}>
          {recentTrips.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>No trips yet</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    {['ID', 'Route', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '0.5rem 0.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.625rem 0.5rem', fontWeight: 700, color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}>{t.id}</td>
                      <td style={{ padding: '0.625rem 0.5rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{t.source} → {t.destination}</td>
                      <td style={{ padding: '0.625rem 0.5rem' }}><StatusBadge status={t.status} /></td>
                      <td style={{ padding: '0.625rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{t.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" icon={<ArrowRight size={18} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <QuickAction label="My Trips" path="/driver/my-trips" icon={<Map size={16} />} color="#000080" />
            <QuickAction label="Current Trip" path="/driver/current-trip" icon={<Navigation size={16} />} color="#F59E0B" />
            <QuickAction label="Add Fuel Log" path="/driver/fuel-logs" icon={<Droplet size={16} />} color="#22C55E" />
            <QuickAction label="Trip History" path="/driver/trip-history" icon={<Clock size={16} />} color="#8B5CF6" />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
