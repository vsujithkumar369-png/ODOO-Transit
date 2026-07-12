import React, { useContext, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { useTrips } from '../../context/TripsContext';
import { useNotifications } from '../../context/NotificationContext';
import { Navigation, Truck, MapPin, Package, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const PROGRESS_STEPS = [0, 25, 50, 75, 100];

const CurrentTrip = () => {
  const { activeTrip, updateProgress, completeTrip } = useTrips();
  const { addNotification } = useNotifications();

  const [showComplete, setShowComplete] = useState(false);
  const [newProgress, setNewProgress] = useState(activeTrip?.progress || 0);

  const handleUpdateProgress = () => {
    if (!activeTrip) return;
    updateProgress(activeTrip.id, newProgress);
    addNotification('Trip Progress', `Trip ${activeTrip.id} progress updated to ${newProgress}%.`);
  };

  const handleComplete = () => {
    if (!activeTrip) return;
    completeTrip(activeTrip.id);
    addNotification('Trip Completed', `Trip ${activeTrip.id} from ${activeTrip.source} to ${activeTrip.destination} has been completed! 🎉`);
    setShowComplete(false);
  };

  if (!activeTrip) {
    return (
      <DashboardLayout>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Current Trip</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Your active trip details and progress tracker.</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Navigation size={48} style={{ color: 'var(--border-color)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Active Trip</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You don't have any trip in progress right now.<br />Go to My Trips and start one.
          </p>
          <Button onClick={() => window.location.href = '/driver/my-trips'}>Go to My Trips</Button>
        </div>
      </DashboardLayout>
    );
  }

  const progress = activeTrip.progress || 0;
  const coveredKm = Math.round(activeTrip.distance * progress / 100);
  const remainingKm = activeTrip.distance - coveredKm;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Current Trip</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Track your active trip progress in real-time.</p>
      </div>

      {/* Active Banner */}
      <div style={{
        background: 'rgba(0,0,128,0.06)', border: '1px solid var(--accent-primary)',
        borderRadius: '8px', padding: '0.875rem 1.25rem', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <Navigation size={18} style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9375rem' }}>
          {activeTrip.id} — In Progress
        </span>
        <StatusBadge status={activeTrip.status} />
      </div>

      <div className="responsive-grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Trip Info */}
        <Card title="Trip Information" icon={<MapPin size={18} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              ['Trip ID', activeTrip.id],
              ['Status', <StatusBadge status={activeTrip.status} />],
              ['From', activeTrip.source],
              ['To', activeTrip.destination],
              ['Total Distance', `${activeTrip.distance} km`],
              ['Start Date', activeTrip.startDate],
            ].map(([l, v]) => (
              <div key={l} style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '3px' }}>{l}</p>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Vehicle & Cargo */}
        <Card title="Vehicle & Cargo" icon={<Truck size={18} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              ['Vehicle', activeTrip.vehicle],
              ['Cargo Type', activeTrip.cargoType],
              ['Cargo Weight', `${activeTrip.cargoWeight} kg`],
              ['End Date', activeTrip.endDate || 'Not set'],
            ].map(([l, v]) => (
              <div key={l} style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '3px' }}>{l}</p>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Progress Tracker */}
      <Card title="Trip Progress Tracker" icon={<TrendingUp size={18} />}>
        <div style={{ marginBottom: '1.5rem' }}>
          {/* Route visual */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600 }}>📍 {activeTrip.source}</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{progress}%</span>
            <span style={{ fontWeight: 600 }}>🏁 {activeTrip.destination}</span>
          </div>

          {/* Progress bar */}
          <div style={{ height: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.625rem' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-primary)', borderRadius: '6px', transition: 'width 0.5s ease' }} />
          </div>

          {/* Step markers */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {PROGRESS_STEPS.map(step => (
              <span key={step} style={{ fontSize: '0.75rem', fontWeight: 600, color: step <= progress ? 'var(--accent-primary)' : 'var(--border-color)' }}>
                {step}%
              </span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { l: 'Covered', v: `${coveredKm} km`, icon: <TrendingUp size={16} />, color: 'var(--success)' },
            { l: 'Remaining', v: `${remainingKm} km`, icon: <Navigation size={16} />, color: 'var(--accent-primary)' },
            { l: 'Current Progress', v: `${progress}%`, icon: <Clock size={16} />, color: 'var(--warning)' },
          ].map(({ l, v, icon, color }) => (
            <div key={l} style={{ textAlign: 'center', padding: '0.875rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div style={{ color, display: 'flex', justifyContent: 'center', marginBottom: '0.375rem' }}>{icon}</div>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{v}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Update Progress */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Update Progress
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {PROGRESS_STEPS.map(step => (
                <button key={step} onClick={() => setNewProgress(step)}
                  style={{
                    padding: '0.375rem 0.875rem', borderRadius: '20px',
                    border: '1px solid',
                    borderColor: newProgress === step ? 'var(--accent-primary)' : 'var(--border-color)',
                    background: newProgress === step ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: newProgress === step ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}>
                  {step}%
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
            <Button onClick={handleUpdateProgress} disabled={newProgress === progress}>
              Update Progress
            </Button>
            <Button variant="success" onClick={() => setShowComplete(true)}>
              <CheckCircle size={15} /> Complete Trip
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirm Complete Modal */}
      <Modal isOpen={showComplete} onClose={() => setShowComplete(false)} title="Complete Trip" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setShowComplete(false)}>Cancel</Button>
          <Button variant="success" onClick={handleComplete}>
            <CheckCircle size={14} /> Yes, Complete
          </Button>
        </>}>
        <p style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Are you sure you want to mark <strong>{activeTrip?.id}</strong> as <strong>Completed</strong>?
        </p>
        <div style={{ padding: '0.875rem', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <p><strong>Route:</strong> {activeTrip?.source} → {activeTrip?.destination}</p>
          <p><strong>Distance:</strong> {activeTrip?.distance} km</p>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--danger)', marginTop: '0.75rem', fontWeight: 500 }}>
          This action cannot be undone.
        </p>
      </Modal>
    </DashboardLayout>
  );
};

export default CurrentTrip;
