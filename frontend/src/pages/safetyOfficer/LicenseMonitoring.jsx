import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, CheckCircle, AlertTriangle, ShieldAlert, Filter, ChevronUp, ChevronDown, Bell } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import { SkeletonCard } from '../../components/common/SkeletonLoader';
import SkeletonRow from '../../components/common/SkeletonLoader';
import { ErrorState, EmptyState } from '../../components/common/StateComponents';
import Toast from '../../components/common/Toast';
import Drawer from '../../components/common/Drawer';
import DebouncedSearchBar from '../../components/common/DebouncedSearchBar';
import { licenseService } from '../../services/licenseService';

const TABLE_HEADERS = ['Driver', 'License Number', 'Category', 'Issue Date', 'Expiry Date', 'Remaining Days', 'Status', 'Actions'];
const SORTABLE = { Driver: 'driver', 'License Number': 'licenseNumber', Category: 'category', 'Expiry Date': 'expiryDate', 'Remaining Days': 'daysRemaining', Status: 'status' };
const STATUS_OPTIONS = ['All', 'Valid', 'Expiring Soon', 'Expired'];
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const StatusBadge = ({ status }) => {
  const map = { valid: { bg: 'rgba(34,197,94,.12)', color: '#15803d' }, 'expiring soon': { bg: 'rgba(245,158,11,.12)', color: '#92400e' }, expired: { bg: 'rgba(239,68,68,.12)', color: '#b91c1c' } };
  const key = (status || '').toLowerCase();
  const s = map[key] || { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
  return <span style={{ backgroundColor: s.bg, color: s.color, padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700' }}>{status}</span>;
};

const SortIcon = ({ col, sortCol, sortDir }) => {
  if (col !== sortCol) return <ChevronUp size={12} style={{ opacity: 0.3 }} />;
  return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
};

const LicenseMonitoring = () => {
  const [licenses, setLicenses]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);

  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortCol, setSortCol]       = useState('daysRemaining');
  const [sortDir, setSortDir]       = useState('asc');
  const [page, setPage]             = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedLicense, setSelectedLicense] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = useCallback((type, msg) => setToast({ type, message: msg }), []);

  const fetchLicenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: GET /api/license-expiry
      const data = await licenseService.list();
      if (!data) throw new Error('No data');
      const list = Array.isArray(data) ? data : [];
      setLicenses(list);
      setSummaryStats({
        total:      list.length,
        valid:      list.filter(l => l.status?.toLowerCase() === 'valid').length,
        expiring:   list.filter(l => l.status?.toLowerCase() === 'expiring soon').length,
        expired:    list.filter(l => l.status?.toLowerCase() === 'expired').length,
      });
    } catch {
      setError('Failed to load license data. (TODO: GET /api/license-expiry)');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLicenses(); }, [fetchLicenses]);

  const processed = useMemo(() => {
    let list = licenses;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l => (l.driver || '').toLowerCase().includes(q) || (l.licenseNumber || '').toLowerCase().includes(q));
    }
    if (statusFilter !== 'All') {
      list = list.filter(l => l.status?.toLowerCase() === statusFilter.toLowerCase());
    }
    const key = SORTABLE[sortCol] || 'daysRemaining';
    return [...list].sort((a, b) => {
      const va = a[key] ?? '';
      const vb = b[key] ?? '';
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
  }, [licenses, search, statusFilter, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processed.length / rowsPerPage));
  const safePage   = Math.min(page, totalPages);
  const paginated  = processed.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const handleSort = (col) => { if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortCol(col); setSortDir('asc'); } setPage(1); };

  const handleReminder = async (license) => {
    setReminderLoading(true);
    try {
      // TODO: POST /api/license-expiry/:id/reminder
      await licenseService.sendReminder(license.id);
      showToast('success', `Reminder sent for ${license.driver}.`);
    } catch {
      showToast('error', 'Failed to send reminder.');
    } finally {
      setReminderLoading(false);
    }
  };

  const expiredCount  = summaryStats?.expired  || 0;
  const expiringCount = summaryStats?.expiring || 0;

  return (
    <DashboardLayout>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* License Details Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="License Details" width="440px">
        {selectedLicense && (
          <div>
            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Driver</p>
              <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{selectedLicense.driver}</p>
            </div>
            {[
              ['License Number', selectedLicense.licenseNumber],
              ['Category', selectedLicense.category],
              ['Issue Date', selectedLicense.issueDate],
              ['Expiry Date', selectedLicense.expiryDate],
              ['Days Remaining', selectedLicense.daysRemaining != null ? `${selectedLicense.daysRemaining} days` : '—'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--bg-primary)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{val || '—'}</span>
              </div>
            ))}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StatusBadge status={selectedLicense.status} />
              {selectedLicense.status?.toLowerCase() !== 'valid' && (
                <button
                  onClick={() => handleReminder(selectedLicense)}
                  disabled={reminderLoading}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', cursor: reminderLoading ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: '600', opacity: reminderLoading ? 0.7 : 1 }}
                >
                  <Bell size={13} /> {reminderLoading ? 'Sending...' : 'Send Reminder'}
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Header */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Safety Officer / License Monitoring</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Home &gt; Safety Officer &gt; License Monitoring</p>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Alert Banner */}
        {!loading && (expiredCount > 0 || expiringCount > 0) && (
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #f59e0b', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: '#92400e' }}>License Expiry Alert</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#78350f' }}>
                {expiredCount > 0 && `${expiredCount} license${expiredCount > 1 ? 's have' : ' has'} expired. `}
                {expiringCount > 0 && `${expiringCount} license${expiringCount > 1 ? 's are' : ' is'} expiring soon.`}
                {' '}Please take action immediately.
              </p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
            <>
              <Card><div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><FileText size={30} style={{ color: '#1E3A8A' }} /><div><p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Licenses</p><h3 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{summaryStats?.total ?? '—'}</h3></div></div></Card>
              <Card><div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><CheckCircle size={30} style={{ color: '#22c55e' }} /><div><p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Valid</p><h3 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{summaryStats?.valid ?? '—'}</h3></div></div></Card>
              <Card><div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><AlertTriangle size={30} style={{ color: '#f59e0b' }} /><div><p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Expiring Soon</p><h3 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{summaryStats?.expiring ?? '—'}</h3></div></div></Card>
              <Card><div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><ShieldAlert size={30} style={{ color: '#ef4444' }} /><div><p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Expired</p><h3 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{summaryStats?.expired ?? '—'}</h3></div></div></Card>
            </>
          )}
        </div>

        {/* Table Card */}
        <Card>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <DebouncedSearchBar placeholder="Search driver name or license number..." onSearch={q => { setSearch(q); setPage(1); }} />
            <button onClick={() => setShowFilters(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: showFilters ? 'var(--bg-tertiary)' : 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              <Filter size={14} /> Filters
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Rows:
              <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }} style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '3px 6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                {ROWS_PER_PAGE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {showFilters && (
            <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Status</label>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '5px 8px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={() => { setStatusFilter('All'); setSearch(''); setPage(1); }} style={{ alignSelf: 'flex-end', padding: '5px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Reset Filters
              </button>
            </div>
          )}

          {error ? <ErrorState message={error} onRetry={fetchLicenses} /> : (
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
                      ? <tr><td colSpan={TABLE_HEADERS.length}><EmptyState message="No license records found." subtext="Try adjusting your search or filters." /></td></tr>
                      : paginated.map(l => (
                        <tr key={l.id} onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--bg-primary)'; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                          <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{l.driver}</td>
                          <td style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{l.licenseNumber}</td>
                          <td style={{ fontSize: '0.85rem' }}>{l.category}</td>
                          <td style={{ fontSize: '0.85rem' }}>{l.issueDate || '—'}</td>
                          <td style={{ fontSize: '0.85rem' }}>{l.expiryDate || '—'}</td>
                          <td>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: (l.daysRemaining ?? 999) <= 7 ? '#b91c1c' : (l.daysRemaining ?? 999) <= 30 ? '#92400e' : 'var(--text-primary)' }}>
                              {l.daysRemaining != null ? `${l.daysRemaining} days` : '—'}
                            </span>
                          </td>
                          <td><StatusBadge status={l.status} /></td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => { setSelectedLicense(l); setDrawerOpen(true); }} style={{ padding: '4px 10px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.78rem', color: '#1E3A8A', fontWeight: '600' }}>Details</button>
                              {l.status?.toLowerCase() !== 'valid' && (
                                <button onClick={() => handleReminder(l)} disabled={reminderLoading} style={{ padding: '4px 10px', border: 'none', borderRadius: '4px', backgroundColor: '#fef9c3', color: '#78350f', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Bell size={12} /> Remind
                                </button>
                              )}
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
              <span>Showing {((safePage - 1) * rowsPerPage) + 1}–{Math.min(safePage * rowsPerPage, processed.length)} of {processed.length} licenses</span>
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

export default LicenseMonitoring;
