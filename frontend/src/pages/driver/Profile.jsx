import React, { useState, useRef, useContext } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { useTrips } from '../../context/TripsContext';
import { User, Mail, Phone, Shield, Star, Calendar, Camera, Save, CheckCircle } from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '0.625rem 0.875rem',
  border: '1px solid var(--border-color)', borderRadius: '6px',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)',
  fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const { stats } = useTrips();

  const fileRef = useRef(null);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contact: user?.contact || '',
    licenseNum: user?.licenseNum || 'LIC-00001',
    licenseExpiry: user?.licenseExpiry || '2028-12-31',
    avatar: user?.avatar || null,
  });

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setField('avatar', ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    updateUser(form);
    addNotification('Profile Updated', `Profile information for ${form.name} has been saved.`);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = (form.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const safetyScore = user?.safetyScore ?? 95;
  const safetyColor = safetyScore >= 90 ? '#22C55E' : safetyScore >= 70 ? '#F59E0B' : '#EF4444';

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>My Profile</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>View and update your driver profile information.</p>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Avatar Card */}
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                  {form.avatar ? (
                    <img src={form.avatar} alt="Avatar" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-light)' }} />
                  ) : (
                    <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, border: '3px solid var(--accent-light)', margin: '0 auto' }}>
                      {initials}
                    </div>
                  )}
                  <button type="button" onClick={() => fileRef.current?.click()}
                    style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-primary)', border: '2px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Camera size={13} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                </div>

                <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{form.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{user?.role}</p>

                <span style={{ display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}>
                  ● {user?.status || 'Available'}
                </span>
              </div>

              {/* Safety Score */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Safety Score</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 800, color: safetyColor, lineHeight: 1 }}>{safetyScore}</p>
                <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, margin: '0.625rem 0 0.25rem' }}>
                  <div style={{ height: '100%', width: `${safetyScore}%`, background: safetyColor, borderRadius: 3 }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Out of 100</p>
              </div>
            </Card>

            {/* Stats */}
            <Card title="Trip Stats" icon={<Star size={16} />}>
              {[
                { l: 'Total Trips', v: stats.pending + stats.active + stats.completed + stats.cancelled },
                { l: 'Completed', v: stats.completed },
                { l: 'Distance', v: `${stats.totalDistance} km` },
                { l: 'Fuel Logs', v: stats.totalFuelLogs },
              ].map(({ l, v }) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{l}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Personal Info */}
            <Card title="Personal Information" icon={<User size={18} />}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Full Name *</label>
                  <input style={inputStyle} value={form.name} onChange={e => setField('name', e.target.value)} required placeholder="Your full name" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Email</label>
                  <input type="email" style={{ ...inputStyle, opacity: 0.75 }} value={form.email} readOnly title="Email cannot be changed" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Phone</label>
                  <input style={inputStyle} value={form.contact} onChange={e => setField('contact', e.target.value)} placeholder="+91 98765 43210" />
                </div>
              </div>
            </Card>

            {/* License Info */}
            <Card title="License Information" icon={<Shield size={18} />}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>License Number</label>
                  <input style={inputStyle} value={form.licenseNum} onChange={e => setField('licenseNum', e.target.value)} placeholder="LIC-00001" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>License Expiry</label>
                  <input type="date" style={inputStyle} value={form.licenseExpiry} onChange={e => setField('licenseExpiry', e.target.value)} />
                </div>

                {/* Read-only info */}
                {[
                  { l: 'Driver ID', v: user?.id },
                  { l: 'Role', v: user?.role },
                  { l: 'Account Status', v: 'Active' },
                  { l: 'Safety Score', v: `${safetyScore} / 100` },
                ].map(({ l, v }) => (
                  <div key={l} style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '3px' }}>{l}</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Save button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.5rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9375rem', fontFamily: 'inherit' }}>
                <Save size={16} /> Save Profile
              </button>
              {saved && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#16a34a', fontWeight: 600, fontSize: '0.875rem' }}>
                  <CheckCircle size={16} /> Profile saved!
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default Profile;
