import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FileWarning, AlertTriangle, CheckCircle, ShieldAlert, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import { SkeletonCard } from '../../components/common/SkeletonLoader';
import SkeletonRow from '../../components/common/SkeletonLoader';
import { ErrorState, EmptyState } from '../../components/common/StateComponents';
import Toast from '../../components/common/Toast';
import Drawer from '../../components/common/Drawer';
import FormModal from '../../components/common/FormModal';
import DebouncedSearchBar from '../../components/common/DebouncedSearchBar';
import { incidentService } from '../../services/incidentService';

const TABLE_HEADERS = ['Incident ID', 'Driver / Vehicle', 'Location', 'Severity', 'Date', 'Status', 'Actions'];
const SORTABLE = { 'Incident ID': 'id', Driver: 'driver', Location: 'location', Severity: 'severity', Date: 'date', Status: 'status' };
const SEVERITY_OPTIONS = ['All', 'Critical', 'High', 'Medium', 'Low'];
const STATUS_OPTIONS   = ['All', 'Open', 'Under Investigation', 'Closed', 'Resolved'];
const ROWS_OPTIONS     = [10, 25, 50];

const SeverityBadge = ({ val }) => {
  const map = { critical: { bg: 'rgba(239,68,68,.15)', color: '#7f1d1d' }, high: { bg: 'rgba(239,68,68,.1)', color: '#b91c1c' }, medium: { bg: 'rgba(245,158,11,.1)', color: '#92400e' }, low: { bg: 'rgba(250,204,21,.1)', color: '#713f12' } };
  const s = map[(val || '').toLowerCase()] || { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
  return <span style={{ backgroundColor: s.bg, color: s.color, padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700', textTransform: 'capitalize' }}>{val}</span>;
};

const StatusBadge = ({ val }) => {
  const map = { open: { bg: 'rgba(59,130,246,.1)', color: '#1d4ed8' }, 'under investigation': { bg: 'rgba(245,158,11,.1)', color: '#92400e' }, closed: { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }, resolved: { bg: 'rgba(34,197,94,.1)', color: '#15803d' } };
  const s = map[(val || '').toLowerCase()] || { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
  return <span style={{ backgroundColor: s.bg, color: s.color, padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700', textTransform: 'capitalize' }}>{val}</span>;
};

const SortIcon = ({ col, sortCol, sortDir }) => col !== sortCol ? <ChevronUp size={12} style={{ opacity: 0.3 }} /> : sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;

const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' };

const IncidentReports = () => {
  const [incidents, setIncidents]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [stats, setStats]           = useState(null);

  const [search, setSearch]         = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter]     = useState('All');
  const [sortCol, setSortCol]       = useState('date');
  const [sortDir, setSortDir]       = useState('desc');
  const [page, setPage]             = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus]   = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = useCallback((type, msg) => setToast({ type, message: msg }), []);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: GET /api/incidents
      const data = await incidentService.list();
      if (!data) throw new Error('No data');
      const list = Array.isArray(data) ? data : [];
      setIncidents(list);
      setStats({
        total:    list.length,
        open:     list.filter(i => i.status?.toLowerCase() === 'open').length,
        closed:   list.filter(i => ['closed', 'resolved'].includes(i.status?.toLowerCase())).length,
        critical: list.filter(i => i.severity?.toLowerCase() === 'critical').length,
      });
    } catch {
      setError('Failed to load incidents. (TODO: GET /api/incidents)');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  const processed = useMemo(() => {
    let list = incidents;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => (i.id || '').toLowerCase().includes(q) || (i.driver || '').toLowerCase().includes(q) || (i.vehicle || '').toLowerCase().includes(q) || (i.location || '').toLowerCase().includes(q));
    }
    if (severityFilter !== 'All') list = list.filter(i => i.severity?.toLowerCase() === severityFilter.toLowerCase());
    if (statusFilter   !== 'All') list = list.filter(i => i.status?.toLowerCase() === statusFilter.toLowerCase());
    const key = SORTABLE[sortCol] || 'date';
    return [...list].sort((a, b) => sortDir === 'asc' ? ((a[key] ?? '') > (b[key] ?? '') ? 1 : -1) : ((a[key] ?? '') < (b[key] ?? '') ? 1 : -1));
  }, [incidents, search, severityFilter, statusFilter, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processed.length / rowsPerPage));
  const safePage   = Math.min(page, totalPages);
  const paginated  = processed.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const handleSort = (col) => { if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortCol(col); setSortDir('asc'); } setPage(1); };

  const openStatusModal = (inc) => {
    setSelectedIncident(inc);
    setNewStatus(inc.status || '');
    setStatusNote('');
    setStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) { showToast('warning', 'Please select a status.'); return; }
    setStatusLoading(true);
    try {
      // TODO: PUT /api/incidents/:id
      await incidentService.updateStatus(selectedIncident.id, { status: newStatus, note: statusNote });
      setIncidents(prev => prev.map(i => i.id === selectedIncident.id ? { ...i, status: newStatus } : i));
      setStatusModal(false);
      showToast('success', 'Incident status updated.');
    } catch {
      showToast('error', 'Failed to update incident status.');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Status Update Modal */}
      <FormModal isOpen={statusModal} title="Update Incident Status" onClose={() => setStatusModal(false)}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>New Status</label>
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={inputStyle}>
            <option value="">Select status...</option>
            {STATUS_OPTIONS.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Investigation Notes</label>
          <textarea value={statusNote} onChange={e => setStatusNote(e.target.value)} rows={4} placeholder="Add notes..." style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={() => setStatusModal(false)} style={{ padding: '9px 20px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Cancel</button>
          <button onClick={handleStatusUpdate} disabled={statusLoading} style={{ padding: '9px 20px', backgroundColor: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '6px', cursor: statusLoading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: '500', opacity: statusLoading ? 0.7 : 1 }}>{statusLoading ? 'Updating...' : 'Update Status'}</button>
        </div>
      </FormModal>

      {/* Incident Details Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Incident Details" width="520px">
        {selectedIncident && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <SeverityBadge val={selectedIncident.severity} />
              <StatusBadge val={selectedIncident.status} />
            </div>
            {[
              ['Incident ID', selectedIncident.id],
              ['Driver', selectedIncident.driver],
              ['Vehicle', selectedIncident.vehicle],
              ['Location', selectedIncident.location],
              ['Date', selectedIncident.date],
              ['Description', selectedIncident.description],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--bg-primary)', fontSize: '0.85rem', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500', flexShrink: 0 }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600', textAlign: 'right' }}>{val || '—'}</span>
              </div>
            ))}
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>Timeline / Comments</p>
              {selectedIncident.timeline?.length > 0 ? (
                <div style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '16px' }}>
                  {selectedIncident.timeline.map((t, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{t.event}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.note}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.7rem', opacity: 0.7, color: 'var(--text-secondary)' }}>{t.date}</p>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>No timeline entries yet.</p>}
            </div>
            <button onClick={() => { setDrawerOpen(false); openStatusModal(selectedIncident); }} style={{ marginTop: '20px', padding: '9px 16px', backgroundColor: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', width: '100%' }}>Update Status</button>
          </div>
        )}
      </Drawer>

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Safety Officer / Incident Reports</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Home &gt; Safety Officer &gt; Incident Reports</p>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
            <>
              {[
                { label: 'Total Incidents', val: stats?.total,    Icon: FileWarning,  color: '#1E3A8A' },
                { label: 'Open Cases',      val: stats?.open,     Icon: AlertTriangle, color: '#f59e0b' },
                { label: 'Closed Cases',    val: stats?.closed,   Icon: CheckCircle,  color: '#22c55e' },
                { label: 'Critical Cases',  val: stats?.critical, Icon: ShieldAlert,  color: '#ef4444' },
              ].map(c => (
                <Card key={c.label}><div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><c.Icon size={30} style={{ color: c.color }} /><div><p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{c.label}</p><h3 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{c.val ?? '—'}</h3></div></div></Card>
              ))}
            </>
          )}
        </div>

        {/* Table Card */}
        <Card>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <DebouncedSearchBar placeholder="Search by ID, driver, vehicle, location..." onSearch={q => { setSearch(q); setPage(1); }} />
            <button onClick={() => setShowFilters(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: showFilters ? 'var(--bg-tertiary)' : 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              <Filter size={14} /> Filters
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Rows: <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }} style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '3px 6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}>{ROWS_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}</select>
            </div>
          </div>

          {showFilters && (
            <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
              {[['Severity', severityFilter, setSeverityFilter, SEVERITY_OPTIONS], ['Status', statusFilter, setStatusFilter, STATUS_OPTIONS]].map(([label, val, set, opts]) => (
                <div key={label}>
                  <label style={{ ...labelStyle, marginBottom: '4px' }}>{label}</label>
                  <select value={val} onChange={e => { set(e.target.value); setPage(1); }} style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '5px 8px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    {opts.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              ))}
              <button onClick={() => { setSeverityFilter('All'); setStatusFilter('All'); setSearch(''); setPage(1); }} style={{ alignSelf: 'flex-end', padding: '5px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reset</button>
            </div>
          )}

          {error ? <ErrorState message={error} onRetry={fetchIncidents} /> : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    {TABLE_HEADERS.map(h => (
                      <th key={h} onClick={() => SORTABLE[h] && handleSort(h)} style={{ cursor: SORTABLE[h] ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{h} {SORTABLE[h] && <SortIcon col={h} sortCol={sortCol} sortDir={sortDir} />}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonRow rows={rowsPerPage} cols={TABLE_HEADERS.length} />
                    : paginated.length === 0
                      ? <tr><td colSpan={TABLE_HEADERS.length}><EmptyState message="No incidents found." subtext="Try adjusting your search or filters." /></td></tr>
                      : paginated.map(inc => (
                        <tr key={inc.id} onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--bg-primary)'; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                          <td style={{ fontWeight: '700', fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>{inc.id}</td>
                          <td><p style={{ margin: 0, fontWeight: '600', fontSize: '0.875rem' }}>{inc.driver}</p><p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{inc.vehicle}</p></td>
                          <td style={{ fontSize: '0.85rem' }}>{inc.location || '—'}</td>
                          <td><SeverityBadge val={inc.severity} /></td>
                          <td style={{ fontSize: '0.85rem' }}>{inc.date || '—'}</td>
                          <td><StatusBadge val={inc.status} /></td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => { setSelectedIncident(inc); setDrawerOpen(true); }} style={{ padding: '4px 10px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.78rem', color: '#1E3A8A', fontWeight: '600' }}>View</button>
                              <button onClick={() => openStatusModal(inc)} style={{ padding: '4px 10px', border: 'none', borderRadius: '4px', backgroundColor: 'rgba(59,130,246,.1)', cursor: 'pointer', fontSize: '0.78rem', color: '#1d4ed8', fontWeight: '600' }}>Update</button>
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && processed.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '8px' }}>
              <span>Showing {((safePage - 1) * rowsPerPage) + 1}–{Math.min(safePage * rowsPerPage, processed.length)} of {processed.length}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[['«', () => setPage(1), safePage === 1], ['‹', () => setPage(p => p - 1), safePage === 1], ['›', () => setPage(p => p + 1), safePage === totalPages], ['»', () => setPage(totalPages), safePage === totalPages]].map(([lbl, fn, dis]) => (
                  <button key={lbl} onClick={fn} disabled={dis} style={{ padding: '4px 10px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'transparent', cursor: dis ? 'not-allowed' : 'pointer', color: dis ? 'var(--border-color)' : 'var(--text-secondary)', fontSize: '0.8rem' }}>{lbl}</button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default IncidentReports;
