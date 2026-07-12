import React, { useState, useContext } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { TripsContext } from '../../context/TripsContext';
import { Clock, Search, X, Filter, Eye, CheckCircle, XCircle, TrendingUp, Droplet } from 'lucide-react';

const TripHistory = () => {
  const { trips, fuelLogs } = useContext(TripsContext);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [showView, setShowView] = useState(false);

  // Only completed + cancelled trips
  const historyTrips = trips.filter(t => t.status === 'Completed' || t.status === 'Cancelled');

  const filtered = historyTrips.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.id?.toLowerCase().includes(q) || t.source?.toLowerCase().includes(q) || t.destination?.toLowerCase().includes(q) || t.vehicle?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchDate = !dateFilter || t.startDate === dateFilter;
    return matchSearch && matchStatus && matchDate;
  });

  const completed = historyTrips.filter(t => t.status === 'Completed');
  const cancelled = historyTrips.filter(t => t.status === 'Cancelled');
  const totalDist = completed.reduce((s, t) => s + Number(t.distance || 0), 0);
  const estFuel = (totalDist * 0.12).toFixed(0);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Trip History</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Review all completed and cancelled trips.</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { l: 'Completed', v: completed.length, icon: <CheckCircle size={20} />, color: '#22C55E' },
          { l: 'Cancelled', v: cancelled.length, icon: <XCircle size={20} />, color: '#EF4444' },
          { l: 'Total Distance', v: `${totalDist} km`, icon: <TrendingUp size={20} />, color: '#000080' },
          { l: 'Est. Fuel Used', v: `${estFuel} L`, icon: <Droplet size={20} />, color: '#F59E0B' },
        ].map(({ l, v, icon, color }) => (
          <div key={l} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color }}>{icon}</span>
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '2px' }}>{l}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{v}</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.4rem 0.75rem', background: 'var(--bg-primary)' }}>
            <Search size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <input type="text" placeholder="Search by ID, route, vehicle…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'none', fontSize: '0.875rem', color: 'var(--text-primary)', width: '100%', fontFamily: 'inherit' }} />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 0 }}><X size={14} /></button>}
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
            <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
            {['All', 'Completed', 'Cancelled'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                style={{ padding: '0.3rem 0.75rem', borderRadius: '20px', border: '1px solid', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                  borderColor: statusFilter === s ? 'var(--accent-primary)' : 'var(--border-color)',
                  background: statusFilter === s ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: statusFilter === s ? 'white' : 'var(--text-secondary)',
                }}>
                {s}
              </button>
            ))}
          </div>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            style={{ padding: '0.4rem 0.625rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.875rem', color: 'var(--text-primary)', background: 'var(--bg-secondary)', outline: 'none', fontFamily: 'inherit' }} />
          {dateFilter && <button onClick={() => setDateFilter('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}><X size={14} /></button>}
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Showing <strong>{filtered.length}</strong> of <strong>{historyTrips.length}</strong> trips
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '2px solid var(--border-color)' }}>
                {['Trip ID', 'Route', 'Vehicle', 'Cargo', 'Distance', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {historyTrips.length === 0 ? 'No completed or cancelled trips yet.' : 'No trips match your search.'}
                </td></tr>
              ) : filtered.map(trip => (
                <tr key={trip.id}
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-primary)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}>{trip.id}</td>
                  <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>{trip.source} → {trip.destination}</td>
                  <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>{trip.vehicle}</td>
                  <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>{trip.cargoType}</td>
                  <td style={{ padding: '0.75rem' }}>{trip.distance} km</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{trip.startDate}</td>
                  <td style={{ padding: '0.75rem' }}><StatusBadge status={trip.status} /></td>
                  <td style={{ padding: '0.75rem' }}>
                    <button title="View" onClick={() => { setSelected(trip); setShowView(true); }}
                      style={{ padding: '0.3rem 0.625rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Modal */}
      <Modal isOpen={showView} onClose={() => setShowView(false)} title={`Trip Details — ${selected?.id}`} size="md"
        footer={<Button variant="secondary" onClick={() => setShowView(false)}>Close</Button>}>
        {selected && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              ['Trip ID', selected.id],
              ['Status', <StatusBadge status={selected.status} />],
              ['Vehicle', selected.vehicle],
              ['Source', selected.source],
              ['Destination', selected.destination],
              ['Cargo Type', selected.cargoType],
              ['Cargo Weight', `${selected.cargoWeight} kg`],
              ['Distance', `${selected.distance} km`],
              ['Start Date', selected.startDate],
              ['End Date', selected.endDate || '—'],
              ['Progress', `${selected.progress}%`],
              ['Created', selected.createdAt],
            ].map(([l, v]) => (
              <div key={l} style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '3px' }}>{l}</p>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default TripHistory;
