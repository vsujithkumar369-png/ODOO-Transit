import React, { useState, useContext } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import useAuth from '../../hooks/useAuth';
import { TripsContext } from '../../context/TripsContext';
import { NotificationContext } from '../../context/NotificationContext';
import { Droplet, Plus, Search, X, Pencil, Trash2, Filter } from 'lucide-react';

const BLANK = { vehicle: '', driverName: '', quantity: '', cost: '', station: '', date: '', remarks: '' };

const inputStyle = (err) => ({
  width: '100%', padding: '0.625rem 0.875rem',
  border: `1px solid ${err ? 'var(--danger)' : 'var(--border-color)'}`,
  borderRadius: '6px', background: 'var(--bg-secondary)',
  color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
});

const FuelLogs = () => {
  const { user } = useAuth();
  const { fuelLogs, addFuelLog, updateFuelLog, deleteFuelLog, stats } = useContext(TripsContext);
  const { addNotification } = useContext(NotificationContext);

  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});

  const setField = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.vehicle.trim()) e.vehicle = 'Vehicle number is required.';
    if (!form.quantity || Number(form.quantity) <= 0) e.quantity = 'Enter valid fuel quantity.';
    if (!form.cost || Number(form.cost) <= 0) e.cost = 'Enter valid cost.';
    if (!form.station.trim()) e.station = 'Fuel station is required.';
    if (!form.date) e.date = 'Date is required.';
    return e;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const log = addFuelLog({
      ...form,
      driverName: form.driverName || user?.name || 'Driver',
      quantity: Number(form.quantity),
      cost: Number(form.cost),
    });
    addNotification('Fuel Added', `Fuel log added: ${form.quantity}L at ${form.station} for ₹${form.cost}.`);
    setShowAdd(false);
    setForm(BLANK);
    setErrors({});
  };

  const openEdit = (log) => {
    setSelected(log);
    setForm({ ...log });
    setErrors({});
    setShowEdit(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    updateFuelLog(selected.id, { ...form, quantity: Number(form.quantity), cost: Number(form.cost) });
    addNotification('Fuel Log Updated', `Fuel log ${selected.id} has been updated.`);
    setShowEdit(false);
    setSelected(null);
  };

  const handleDelete = () => {
    deleteFuelLog(selected.id);
    addNotification('Fuel Log Deleted', `Fuel log ${selected.id} has been removed.`);
    setShowDelete(false);
    setSelected(null);
  };

  const filtered = fuelLogs.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.vehicle?.toLowerCase().includes(q) || l.station?.toLowerCase().includes(q) || l.driverName?.toLowerCase().includes(q);
    const matchDate = !dateFilter || l.date === dateFilter;
    return matchSearch && matchDate;
  });

  const FuelForm = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
          Vehicle Number <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input style={inputStyle(!!errors.vehicle)} value={form.vehicle} onChange={e => setField('vehicle', e.target.value)} placeholder="e.g. TN-01-AB-1234" />
        {errors.vehicle && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '2px' }}>{errors.vehicle}</p>}
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Driver Name</label>
        <input style={inputStyle(false)} value={form.driverName} onChange={e => setField('driverName', e.target.value)} placeholder={user?.name} />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
          Fuel Quantity (L) <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input type="number" min="0.1" step="0.1" style={inputStyle(!!errors.quantity)} value={form.quantity} onChange={e => setField('quantity', e.target.value)} placeholder="e.g. 85" />
        {errors.quantity && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '2px' }}>{errors.quantity}</p>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
          Cost (₹) <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input type="number" min="1" style={inputStyle(!!errors.cost)} value={form.cost} onChange={e => setField('cost', e.target.value)} placeholder="e.g. 7735" />
        {errors.cost && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '2px' }}>{errors.cost}</p>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
          Fuel Station <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input style={inputStyle(!!errors.station)} value={form.station} onChange={e => setField('station', e.target.value)} placeholder="e.g. IOCL Chennai" />
        {errors.station && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '2px' }}>{errors.station}</p>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
          Date <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input type="date" style={inputStyle(!!errors.date)} value={form.date} onChange={e => setField('date', e.target.value)} max={new Date().toISOString().split('T')[0]} />
        {errors.date && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '2px' }}>{errors.date}</p>}
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Remarks</label>
        <textarea rows={2} style={{ ...inputStyle(false), resize: 'vertical' }} value={form.remarks} onChange={e => setField('remarks', e.target.value)} placeholder="Optional notes..." />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Fuel Logs</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Track and manage vehicle fuel usage records.</p>
        </div>
        <Button onClick={() => { setForm({ ...BLANK, driverName: user?.name || '' }); setErrors({}); setShowAdd(true); }}>
          <Plus size={16} /> Add Fuel Log
        </Button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { l: 'Total Logs', v: stats.totalFuelLogs, color: '#000080' },
          { l: 'Total Fuel', v: `${stats.totalFuelQty.toFixed(1)} L`, color: '#3B82F6' },
          { l: 'Total Cost', v: `₹${stats.totalFuelCost.toLocaleString('en-IN')}`, color: '#22C55E' },
        ].map(({ l, v, color }) => (
          <div key={l} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Droplet size={18} style={{ color }} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '2px' }}>{l}</p>
              <p style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{v}</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.4rem 0.75rem', background: 'var(--bg-primary)' }}>
            <Search size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <input type="text" placeholder="Search by vehicle, station, driver…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'none', fontSize: '0.875rem', color: 'var(--text-primary)', width: '100%', fontFamily: 'inherit' }} />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 0 }}><X size={14} /></button>}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
              style={{ padding: '0.4rem 0.625rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.875rem', color: 'var(--text-primary)', background: 'var(--bg-secondary)', outline: 'none', fontFamily: 'inherit' }} />
            {dateFilter && <button onClick={() => setDateFilter('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}><X size={14} /></button>}
          </div>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Showing <strong>{filtered.length}</strong> of <strong>{fuelLogs.length}</strong> logs
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '2px solid var(--border-color)' }}>
                {['#', 'Vehicle', 'Driver', 'Quantity', 'Cost', 'Station', 'Date', 'Remarks', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No fuel logs found. Click "Add Fuel Log" to get started.
                </td></tr>
              ) : filtered.map((log, i) => (
                <tr key={log.id}
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-primary)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{i + 1}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{log.vehicle}</td>
                  <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>{log.driverName}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#3B82F6' }}>{log.quantity} L</td>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#22C55E' }}>₹{Number(log.cost).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>{log.station}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{log.date}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.remarks || '—'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button title="Edit" onClick={() => openEdit(log)}
                        style={{ padding: '0.3rem 0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                        <Pencil size={13} />
                      </button>
                      <button title="Delete" onClick={() => { setSelected(log); setShowDelete(true); }}
                        style={{ padding: '0.3rem 0.5rem', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--danger)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Fuel Log" size="md"
        footer={<>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button type="submit" form="add-fuel-form">Submit Log</Button>
        </>}>
        <form id="add-fuel-form" onSubmit={handleAdd}><FuelForm /></form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title={`Edit Fuel Log — ${selected?.id}`} size="md"
        footer={<>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button type="submit" form="edit-fuel-form">Save Changes</Button>
        </>}>
        <form id="edit-fuel-form" onSubmit={handleEdit}><FuelForm /></form>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Fuel Log" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </>}>
        <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Delete fuel log <strong>{selected?.id}</strong>?</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--danger)', fontWeight: 500 }}>This action cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  );
};

export default FuelLogs;
