import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import useAuth from '../../hooks/useAuth';
import { useTrips } from '../../context/TripsContext';
import { useNotifications } from '../../context/NotificationContext';
import { Map, Plus, Search, Eye, Play, CheckCircle, Pencil, Trash2, X, Filter } from 'lucide-react';

const STATUSES = ['All', 'Pending', 'Active', 'Completed', 'Cancelled'];
const CARGO_TYPES = ['Electronics', 'Textiles', 'Auto Parts', 'FMCG', 'Machinery', 'Chemicals', 'Food', 'Other'];

const BLANK_FORM = {
  source: '', destination: '', vehicle: '',
  cargoType: 'Electronics', cargoWeight: '',
  startDate: '', endDate: '', distance: '', status: 'Pending',
};

const FormField = ({ label, required, error, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
      {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
    </label>
    {children}
    {error && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem' }}>{error}</p>}
  </div>
);

const inputStyle = (hasErr) => ({
  width: '100%', padding: '0.625rem 0.875rem',
  border: `1px solid ${hasErr ? 'var(--danger)' : 'var(--border-color)'}`,
  borderRadius: '6px', background: 'var(--bg-secondary)',
  color: 'var(--text-primary)', fontSize: '0.9rem',
  outline: 'none', fontFamily: 'inherit',
});

const MyTrips = () => {
  const { user } = useAuth();
  const { trips, addTrip, updateTrip, deleteTrip, startTrip, completeTrip } = useTrips();
  const { addNotification } = useNotifications();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Filter trips
  const filtered = trips.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || t.id?.toLowerCase().includes(q)
      || t.source?.toLowerCase().includes(q)
      || t.destination?.toLowerCase().includes(q)
      || t.vehicle?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const validate = () => {
    const e = {};
    if (!form.source.trim()) e.source = 'Source is required.';
    if (!form.destination.trim()) e.destination = 'Destination is required.';
    if (!form.vehicle.trim()) e.vehicle = 'Vehicle is required.';
    if (!form.cargoWeight || Number(form.cargoWeight) <= 0) e.cargoWeight = 'Enter valid cargo weight.';
    if (!form.startDate) e.startDate = 'Start date is required.';
    if (!form.distance || Number(form.distance) <= 0) e.distance = 'Enter valid distance.';
    return e;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    const newTrip = addTrip({ ...form, cargoWeight: Number(form.cargoWeight), distance: Number(form.distance) });
    addNotification('Trip Assigned', `New trip ${newTrip.id} from ${form.source} to ${form.destination} has been added.`);
    setShowAddModal(false);
    setForm(BLANK_FORM);
    setFormErrors({});
  };

  const openEdit = (trip) => {
    setSelectedTrip(trip);
    setForm({ ...trip });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    updateTrip(selectedTrip.id, { ...form, cargoWeight: Number(form.cargoWeight), distance: Number(form.distance) });
    addNotification('Trip Updated', `Trip ${selectedTrip.id} details have been updated.`);
    setShowEditModal(false);
    setSelectedTrip(null);
  };

  const handleStart = (trip) => {
    startTrip(trip.id);
    addNotification('Trip Started', `Trip ${trip.id} from ${trip.source} to ${trip.destination} is now active.`);
  };

  const handleComplete = (trip) => {
    completeTrip(trip.id);
    addNotification('Trip Completed', `Trip ${trip.id} to ${trip.destination} has been completed.`);
  };

  const handleDelete = () => {
    if (!selectedTrip) return;
    deleteTrip(selectedTrip.id);
    addNotification('Trip Removed', `Trip ${selectedTrip.id} has been deleted.`);
    setShowDeleteModal(false);
    setSelectedTrip(null);
  };

  const setField = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (formErrors[k]) setFormErrors(p => ({ ...p, [k]: undefined })); };

  const TripForm = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <FormField label="Source" required error={formErrors.source}>
        <input style={inputStyle(!!formErrors.source)} value={form.source} onChange={e => setField('source', e.target.value)} placeholder="e.g. Chennai" />
      </FormField>
      <FormField label="Destination" required error={formErrors.destination}>
        <input style={inputStyle(!!formErrors.destination)} value={form.destination} onChange={e => setField('destination', e.target.value)} placeholder="e.g. Bangalore" />
      </FormField>
      <FormField label="Vehicle Number" required error={formErrors.vehicle}>
        <input style={inputStyle(!!formErrors.vehicle)} value={form.vehicle} onChange={e => setField('vehicle', e.target.value)} placeholder="e.g. TN-01-AB-1234" />
      </FormField>
      <FormField label="Cargo Type">
        <select style={inputStyle(false)} value={form.cargoType} onChange={e => setField('cargoType', e.target.value)}>
          {CARGO_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </FormField>
      <FormField label="Cargo Weight (kg)" required error={formErrors.cargoWeight}>
        <input type="number" min="1" style={inputStyle(!!formErrors.cargoWeight)} value={form.cargoWeight} onChange={e => setField('cargoWeight', e.target.value)} placeholder="e.g. 2500" />
      </FormField>
      <FormField label="Distance (km)" required error={formErrors.distance}>
        <input type="number" min="1" style={inputStyle(!!formErrors.distance)} value={form.distance} onChange={e => setField('distance', e.target.value)} placeholder="e.g. 346" />
      </FormField>
      <FormField label="Start Date" required error={formErrors.startDate}>
        <input type="date" style={inputStyle(!!formErrors.startDate)} value={form.startDate} onChange={e => setField('startDate', e.target.value)} />
      </FormField>
      <FormField label="End Date">
        <input type="date" style={inputStyle(false)} value={form.endDate} onChange={e => setField('endDate', e.target.value)} />
      </FormField>
      {showEditModal && (
        <FormField label="Status" style={{ gridColumn: '1/-1' }}>
          <select style={inputStyle(false)} value={form.status} onChange={e => setField('status', e.target.value)}>
            {STATUSES.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>My Trips</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manage, start, and complete your assigned trips.</p>
        </div>
        <Button onClick={() => { setForm(BLANK_FORM); setFormErrors({}); setShowAddModal(true); }}>
          <Plus size={16} /> Add Trip
        </Button>
      </div>

      <Card>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.4rem 0.75rem', background: 'var(--bg-primary)' }}>
            <Search size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by ID, route, vehicle…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'none', fontSize: '0.875rem', color: 'var(--text-primary)', width: '100%', fontFamily: 'inherit' }}
            />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 0 }}><X size={14} /></button>}
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
            {STATUSES.map(s => (
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
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Showing <strong>{filtered.length}</strong> of <strong>{trips.length}</strong> trips
        </p>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '2px solid var(--border-color)' }}>
                {['Trip ID', 'Route', 'Vehicle', 'Cargo', 'Dist.', 'Dates', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No trips found. {search ? 'Try a different search.' : 'Click "Add Trip" to create one.'}
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
                  <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>{trip.cargoType} / {trip.cargoWeight}kg</td>
                  <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>{trip.distance} km</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{trip.startDate}{trip.endDate ? ` → ${trip.endDate}` : ''}</td>
                  <td style={{ padding: '0.75rem' }}><StatusBadge status={trip.status} /></td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'nowrap' }}>
                      <button title="View" onClick={() => { setSelectedTrip(trip); setShowViewModal(true); }}
                        style={{ padding: '0.3rem 0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                        <Eye size={13} />
                      </button>
                      {trip.status !== 'Completed' && trip.status !== 'Cancelled' && (
                        <button title="Edit" onClick={() => openEdit(trip)}
                          style={{ padding: '0.3rem 0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                          <Pencil size={13} />
                        </button>
                      )}
                      {trip.status === 'Pending' && (
                        <button title="Start Trip" onClick={() => handleStart(trip)}
                          style={{ padding: '0.3rem 0.625rem', border: 'none', borderRadius: '4px', background: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                          <Play size={11} /> Start
                        </button>
                      )}
                      {trip.status === 'Active' && (
                        <button title="Complete" onClick={() => handleComplete(trip)}
                          style={{ padding: '0.3rem 0.625rem', border: 'none', borderRadius: '4px', background: '#22C55E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                          <CheckCircle size={11} /> Done
                        </button>
                      )}
                      <button title="Delete" onClick={() => { setSelectedTrip(trip); setShowDeleteModal(true); }}
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
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Trip" size="lg"
        footer={<>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button type="submit" form="add-trip-form">Add Trip</Button>
        </>}>
        <form id="add-trip-form" onSubmit={handleAddSubmit}><TripForm /></form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Trip — ${selectedTrip?.id}`} size="lg"
        footer={<>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button type="submit" form="edit-trip-form">Save Changes</Button>
        </>}>
        <form id="edit-trip-form" onSubmit={handleEditSubmit}><TripForm /></form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title={`Trip Details — ${selectedTrip?.id}`} size="md"
        footer={<Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>}>
        {selectedTrip && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              ['Trip ID', selectedTrip.id],
              ['Status', <StatusBadge status={selectedTrip.status} />],
              ['Vehicle', selectedTrip.vehicle],
              ['Cargo Type', selectedTrip.cargoType],
              ['Cargo Weight', `${selectedTrip.cargoWeight} kg`],
              ['Distance', `${selectedTrip.distance} km`],
              ['Source', selectedTrip.source],
              ['Destination', selectedTrip.destination],
              ['Start Date', selectedTrip.startDate],
              ['End Date', selectedTrip.endDate || '—'],
              ['Progress', `${selectedTrip.progress}%`],
              ['Created', selectedTrip.createdAt],
            ].map(([l, v]) => (
              <div key={l} style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '3px' }}>{l}</p>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Trip" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </>}>
        <p style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Are you sure you want to delete <strong>{selectedTrip?.id}</strong>?
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--danger)', fontWeight: 500 }}>This action cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  );
};

export default MyTrips;
