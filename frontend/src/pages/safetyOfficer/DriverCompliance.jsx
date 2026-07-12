import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, CheckCircle, AlertTriangle, ShieldAlert, Filter, ChevronUp, ChevronDown, Eye, Edit2, Ban, UserCheck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import { SkeletonCard } from '../../components/common/SkeletonLoader';
import SkeletonRow from '../../components/common/SkeletonLoader';
import { ErrorState, EmptyState } from '../../components/common/StateComponents';
import Toast from '../../components/common/Toast';
import Drawer from '../../components/common/Drawer';
import ConfirmModal from '../../components/common/ConfirmModal';
import FormModal from '../../components/common/FormModal';
import DebouncedSearchBar from '../../components/common/DebouncedSearchBar';
import { safetyDriverService } from '../../services/safetyDriverService';

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    active: { bg: 'rgba(34,197,94,.12)', color: '#15803d' },
    suspended: { bg: 'rgba(239,68,68,.12)', color: '#b91c1c' },
    'on trip': { bg: 'rgba(59,130,246,.12)', color: '#1d4ed8' },
    'at risk': { bg: 'rgba(245,158,11,.12)', color: '#92400e' },
  };
  const key = (status || '').toLowerCase();
  const s = Object.entries(map).find(([k]) => key.includes(k))?.[1] || { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
  return <span style={{ backgroundColor: s.bg, color: s.color, padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700', textTransform: 'capitalize' }}>{status}</span>;
};

// ─── Sort Icon ────────────────────────────────────────────────────────────────
const SortIcon = ({ col, sortCol, sortDir }) => {
  if (col !== sortCol) return <ChevronUp size={12} style={{ opacity: 0.3 }} />;
  return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
};

// ─── Field styles ─────────────────────────────────────────────────────────────
const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' };
const fieldWrap = { marginBottom: '16px' };
const btnPrimary = { padding: '9px 20px', backgroundColor: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' };
const btnSecondary = { padding: '9px 20px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' };

const TABLE_HEADERS = ['Driver', 'Employee ID', 'Phone', 'License', 'Category', 'Expiry', 'Safety Score', 'Status', 'Actions'];
const SORTABLE = { 'Safety Score': 'safetyScore', 'Status': 'status', 'Expiry': 'expiryDate', Driver: 'name' };
const STATUS_OPTIONS = ['All', 'Active', 'Suspended', 'On Trip', 'At Risk'];
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const DriverCompliance = () => {
  // Data state
  const [drivers, setDrivers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [stats, setStats]           = useState(null);

  // Table controls
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortCol, setSortCol]       = useState('name');
  const [sortDir, setSortDir]       = useState('asc');
  const [page, setPage]             = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Drawer
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [history, setHistory]       = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Modals
  const [editModal, setEditModal]   = useState(false);
  const [editScore, setEditScore]   = useState('');
  const [editRemarks, setEditRemarks] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editErrors, setEditErrors] = useState({});

  const [suspendModal, setSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendLoading, setSuspendLoading] = useState(false);

  const [activateConfirm, setActivateConfirm] = useState(false);
  const [activateLoading, setActivateLoading] = useState(false);

  const [toast, setToast]           = useState(null);
  const showToast = useCallback((type, msg) => { setToast({ type, message: msg }); }, []);

  // ─── Fetch all drivers ──────────────────────────────────────────────────────
  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await safetyDriverService.list();
      if (!data) throw new Error('No data');
      setDrivers(Array.isArray(data) ? data : []);
      // Derive stats from data
      if (Array.isArray(data)) {
        setStats({
          total:     data.length,
          safe:      data.filter(d => (d.safetyScore ?? 0) >= 80 && d.status?.toLowerCase() === 'active').length,
          atRisk:    data.filter(d => (d.safetyScore ?? 100) < 80).length,
          suspended: data.filter(d => d.status?.toLowerCase() === 'suspended').length,
        });
      }
    } catch {
      setError('Failed to load drivers. Please check the connection and retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  // ─── Filter + sort + paginate ───────────────────────────────────────────────
  const processed = useMemo(() => {
    let list = drivers;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        (d.name || '').toLowerCase().includes(q) ||
        (d.employeeId || '').toLowerCase().includes(q) ||
        (d.licenseNumber || '').toLowerCase().includes(q) ||
        (d.phone || '').includes(q)
      );
    }

    if (statusFilter !== 'All') {
      list = list.filter(d => (d.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    const key = SORTABLE[sortCol] || 'name';
    list = [...list].sort((a, b) => {
      const va = a[key] ?? '';
      const vb = b[key] ?? '';
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

    return list;
  }, [drivers, search, statusFilter, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processed.length / rowsPerPage));
  const safePage   = Math.min(page, totalPages);
  const paginated  = processed.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
    setPage(1);
  };

  // ─── Drawer: open driver ────────────────────────────────────────────────────
  const openDriver = async (driver) => {
    setSelectedDriver(driver);
    setDrawerOpen(true);
    setHistory([]);
    setHistoryLoading(true);
    try {
      // TODO: GET /api/drivers/:id/history
      const h = await safetyDriverService.getHistory(driver.id);
      setHistory(Array.isArray(h) ? h : []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ─── Edit Safety Score ──────────────────────────────────────────────────────
  const openEditModal = () => {
    setEditScore(selectedDriver?.safetyScore ?? '');
    setEditRemarks('');
    setEditErrors({});
    setEditModal(true);
  };

  const validateEdit = () => {
    const errs = {};
    const s = Number(editScore);
    if (editScore === '' || isNaN(s))   errs.score = 'Safety score is required.';
    else if (s < 0 || s > 100)          errs.score = 'Score must be between 0 and 100.';
    return errs;
  };

  const handleSaveScore = async () => {
    const errs = validateEdit();
    if (Object.keys(errs).length) { setEditErrors(errs); return; }
    setEditLoading(true);
    try {
      // TODO: PATCH /api/drivers/:id/safety-score
      await safetyDriverService.updateSafetyScore(selectedDriver.id, Number(editScore), editRemarks);
      setDrivers(prev => prev.map(d => d.id === selectedDriver.id ? { ...d, safetyScore: Number(editScore) } : d));
      setSelectedDriver(prev => ({ ...prev, safetyScore: Number(editScore) }));
      setEditModal(false);
      showToast('success', 'Safety score updated successfully.');
    } catch {
      showToast('error', 'Failed to update safety score.');
    } finally {
      setEditLoading(false);
    }
  };

  // ─── Suspend Driver ──────────────────────────────────────────────────────────
  const handleSuspend = async () => {
    if (!suspendReason.trim()) { showToast('warning', 'Please provide a reason for suspension.'); return; }
    setSuspendLoading(true);
    try {
      // TODO: PATCH /api/drivers/:id/suspend
      await safetyDriverService.suspend(selectedDriver.id, suspendReason);
      setDrivers(prev => prev.map(d => d.id === selectedDriver.id ? { ...d, status: 'Suspended' } : d));
      setSelectedDriver(prev => ({ ...prev, status: 'Suspended' }));
      setSuspendModal(false);
      setSuspendReason('');
      showToast('success', `${selectedDriver.name} has been suspended.`);
    } catch {
      showToast('error', 'Failed to suspend driver.');
    } finally {
      setSuspendLoading(false);
    }
  };

  // ─── Activate Driver ─────────────────────────────────────────────────────────
  const handleActivate = async () => {
    setActivateLoading(true);
    try {
      // TODO: PATCH /api/drivers/:id/activate
      await safetyDriverService.activate(selectedDriver.id);
      setDrivers(prev => prev.map(d => d.id === selectedDriver.id ? { ...d, status: 'Active' } : d));
      setSelectedDriver(prev => ({ ...prev, status: 'Active' }));
      setActivateConfirm(false);
      showToast('success', `${selectedDriver.name} has been activated.`);
    } catch {
      showToast('error', 'Failed to activate driver.');
    } finally {
      setActivateLoading(false);
    }
  };

  const isSuspended = selectedDriver?.status?.toLowerCase() === 'suspended';

  return (
    <DashboardLayout>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Confirm Modals */}
      <ConfirmModal isOpen={activateConfirm} title="Activate Driver" message={`Are you sure you want to activate ${selectedDriver?.name}?`} confirmLabel="Activate" onConfirm={handleActivate} onCancel={() => setActivateConfirm(false)} loading={activateLoading} />

      {/* Edit Safety Score Modal */}
      <FormModal isOpen={editModal} title="Edit Safety Score" onClose={() => setEditModal(false)}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Safety Score (0–100) <span style={{ color: 'var(--danger)' }}>*</span></label>
          <input type="number" min="0" max="100" value={editScore} onChange={e => setEditScore(e.target.value)} style={{ ...inputStyle, borderColor: editErrors.score ? 'var(--danger)' : undefined }} />
          {editErrors.score && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px' }}>{editErrors.score}</p>}
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Remarks</label>
          <textarea value={editRemarks} onChange={e => setEditRemarks(e.target.value)} rows={3} placeholder="Optional remarks..." style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button style={btnSecondary} onClick={() => setEditModal(false)}>Cancel</button>
          <button style={{ ...btnPrimary, opacity: editLoading ? 0.7 : 1, cursor: editLoading ? 'not-allowed' : 'pointer' }} onClick={handleSaveScore} disabled={editLoading}>
            {editLoading ? 'Saving...' : 'Save Score'}
          </button>
        </div>
      </FormModal>

      {/* Suspend Modal */}
      <FormModal isOpen={suspendModal} title={`Suspend ${selectedDriver?.name || 'Driver'}`} onClose={() => setSuspendModal(false)}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Reason for Suspension <span style={{ color: 'var(--danger)' }}>*</span></label>
          <textarea value={suspendReason} onChange={e => setSuspendReason(e.target.value)} rows={4} placeholder="Enter reason..." style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button style={btnSecondary} onClick={() => setSuspendModal(false)}>Cancel</button>
          <button style={{ ...btnPrimary, backgroundColor: 'var(--danger)', opacity: suspendLoading ? 0.7 : 1, cursor: suspendLoading ? 'not-allowed' : 'pointer' }} onClick={handleSuspend} disabled={suspendLoading}>
            {suspendLoading ? 'Suspending...' : 'Suspend Driver'}
          </button>
        </div>
      </FormModal>

      {/* Driver Details Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Driver Details" width="520px">
        {selectedDriver && (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1E3A8A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '700', flexShrink: 0 }}>
                {(selectedDriver.name || '?').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{selectedDriver.name}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedDriver.employeeId}</p>
                <StatusBadge status={selectedDriver.status || 'Unknown'} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <button style={btnPrimary} onClick={openEditModal}><Edit2 size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Edit Score</button>
              {isSuspended
                ? <button style={{ ...btnPrimary, backgroundColor: 'var(--success)' }} onClick={() => setActivateConfirm(true)}><UserCheck size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Activate</button>
                : <button style={{ ...btnPrimary, backgroundColor: 'var(--danger)' }} onClick={() => setSuspendModal(true)}><Ban size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Suspend</button>
              }
            </div>

            {/* Personal Info */}
            <Section title="Personal Information">
              <InfoRow label="Phone"   value={selectedDriver.phone} />
              <InfoRow label="Email"   value={selectedDriver.email} />
              <InfoRow label="Address" value={selectedDriver.address} />
            </Section>

            {/* License Info */}
            <Section title="License Information">
              <InfoRow label="License Number" value={selectedDriver.licenseNumber} />
              <InfoRow label="Category"        value={selectedDriver.licenseCategory} />
              <InfoRow label="Issue Date"      value={selectedDriver.issueDate} />
              <InfoRow label="Expiry Date"     value={selectedDriver.expiryDate} />
            </Section>

            {/* Safety Info */}
            <Section title="Safety Information">
              <InfoRow label="Safety Score" value={selectedDriver.safetyScore != null ? `${selectedDriver.safetyScore}%` : '—'} />
              <InfoRow label="Violations"   value={selectedDriver.violations ?? '—'} />
              <InfoRow label="Warnings"     value={selectedDriver.warnings ?? '—'} />
              <InfoRow label="Accidents"    value={selectedDriver.accidents ?? '—'} />
            </Section>

            {/* History Timeline */}
            <Section title="Driver History">
              {historyLoading
                ? <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading history...</p>
                : history.length === 0
                  ? <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No history available. (TODO: GET /api/drivers/:id/history)</p>
                  : (
                    <div style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '16px' }}>
                      {history.map((h, i) => (
                        <div key={i} style={{ marginBottom: '16px', position: 'relative' }}>
                          <div style={{ position: 'absolute', left: '-22px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{h.event}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{h.description}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '0.7rem', opacity: 0.7, color: 'var(--text-secondary)' }}>{h.date}</p>
                        </div>
                      ))}
                    </div>
                  )
              }
            </Section>
          </div>
        )}
      </Drawer>

      {/* Page header */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Safety Officer / Driver Compliance</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Home &gt; Safety Officer &gt; Driver Compliance</p>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
            <>
              <StatCard label="Total Drivers"  value={stats?.total}     Icon={Users}       color="#1E3A8A" />
              <StatCard label="Safe Drivers"   value={stats?.safe}      Icon={CheckCircle} color="#22c55e" />
              <StatCard label="Drivers At Risk" value={stats?.atRisk}   Icon={AlertTriangle} color="#f59e0b" />
              <StatCard label="Suspended"      value={stats?.suspended} Icon={ShieldAlert} color="#ef4444" />
            </>
          )}
        </div>

        {/* Search + Filters + Table */}
        <Card>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <DebouncedSearchBar placeholder="Search by name, license, Emp ID, phone..." onSearch={q => { setSearch(q); setPage(1); }} />
            <button
              onClick={() => setShowFilters(f => !f)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: showFilters ? 'var(--bg-tertiary)' : 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)' }}
            >
              <Filter size={14} /> Filters
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Rows:
              <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }} style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '3px 6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                {ROWS_PER_PAGE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label style={{ ...labelStyle, marginBottom: '4px' }}>Status</label>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '5px 8px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button
                onClick={() => { setStatusFilter('All'); setSearch(''); setPage(1); }}
                style={{ alignSelf: 'flex-end', padding: '5px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Table */}
          {error ? (
            <ErrorState message={error} onRetry={fetchDrivers} />
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    {TABLE_HEADERS.map(h => (
                      <th key={h} onClick={() => SORTABLE[h] && handleSort(h)} style={{ cursor: SORTABLE[h] ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {h} {SORTABLE[h] && <SortIcon col={h} sortCol={sortCol} sortDir={sortDir} />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonRow rows={rowsPerPage} cols={TABLE_HEADERS.length} />
                    : paginated.length === 0
                      ? <tr><td colSpan={TABLE_HEADERS.length}><EmptyState message="No drivers found." subtext="Try adjusting your search or filters." /></td></tr>
                      : paginated.map(d => (
                        <tr key={d.id} style={{ cursor: 'pointer' }} onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--bg-primary)'; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1E3A8A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', flexShrink: 0 }}>
                                {(d.name || '?').slice(0, 2).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{d.name}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{d.employeeId || '—'}</td>
                          <td style={{ fontSize: '0.85rem' }}>{d.phone || '—'}</td>
                          <td style={{ fontSize: '0.85rem' }}>{d.licenseNumber || '—'}</td>
                          <td style={{ fontSize: '0.85rem' }}>{d.licenseCategory || '—'}</td>
                          <td style={{ fontSize: '0.85rem' }}>{d.expiryDate || '—'}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '60px', height: '6px', borderRadius: '9999px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${d.safetyScore || 0}%`, backgroundColor: (d.safetyScore ?? 0) >= 80 ? '#22c55e' : (d.safetyScore ?? 0) >= 60 ? '#f59e0b' : '#ef4444', borderRadius: '9999px' }} />
                              </div>
                              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', minWidth: '30px' }}>{d.safetyScore ?? '—'}</span>
                            </div>
                          </td>
                          <td><StatusBadge status={d.status || 'Unknown'} /></td>
                          <td>
                            <button onClick={() => openDriver(d)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', border: '1px solid var(--border-color)', borderRadius: '5px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.78rem', color: '#1E3A8A', fontWeight: '600' }}>
                              <Eye size={13} /> View
                            </button>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && processed.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '8px' }}>
              <span>Showing {((safePage - 1) * rowsPerPage) + 1}–{Math.min(safePage * rowsPerPage, processed.length)} of {processed.length} drivers</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <PageBtn label="« First"  onClick={() => setPage(1)}           disabled={safePage === 1} />
                <PageBtn label="‹ Prev"   onClick={() => setPage(p => p - 1)}  disabled={safePage === 1} />
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(safePage - 2, totalPages - 4)) + i;
                  return <PageBtn key={p} label={String(p)} onClick={() => setPage(p)} active={p === safePage} />;
                })}
                <PageBtn label="Next ›"  onClick={() => setPage(p => p + 1)}  disabled={safePage === totalPages} />
                <PageBtn label="Last »"  onClick={() => setPage(totalPages)}   disabled={safePage === totalPages} />
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

// ─── Small helpers ─────────────────────────────────────────────────────────────
const StatCard = ({ label, value, Icon, color }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Icon size={30} style={{ color, flexShrink: 0 }} />
      <div>
        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: '500', color: 'var(--text-secondary)' }}>{label}</p>
        <h3 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{value ?? '—'}</h3>
      </div>
    </div>
  </Card>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ margin: '0 0 10px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>{title}</h4>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--bg-primary)', fontSize: '0.85rem' }}>
    <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</span>
    <span style={{ color: 'var(--text-primary)', fontWeight: '600', textAlign: 'right' }}>{value || '—'}</span>
  </div>
);

const PageBtn = ({ label, onClick, disabled, active }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid', borderColor: active ? '#1E3A8A' : 'var(--border-color)', backgroundColor: active ? '#1E3A8A' : 'transparent', color: active ? '#fff' : disabled ? 'var(--border-color)' : 'var(--text-secondary)', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.78rem', fontWeight: active ? '700' : '400' }}
  >
    {label}
  </button>
);

export default DriverCompliance;
