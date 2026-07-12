import React, { useState, useContext } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { NotificationContext } from '../../context/NotificationContext';
import { User, Shield, Bell, Palette, Globe, LogOut, Save, Eye, EyeOff } from 'lucide-react';

const inputStyle = (err) => ({
  width: '100%', padding: '0.625rem 0.875rem',
  border: `1px solid ${err ? 'var(--danger)' : 'var(--border-color)'}`,
  borderRadius: '6px', background: 'var(--bg-secondary)',
  color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
});

const Toggle = ({ checked, onChange }) => (
  <div onClick={() => onChange(!checked)} style={{
    width: 44, height: 24, borderRadius: 12,
    background: checked ? 'var(--accent-primary)' : 'var(--border-color)',
    cursor: 'pointer', transition: 'background 0.2s', position: 'relative', flexShrink: 0,
  }}>
    <div style={{
      width: 18, height: 18, borderRadius: '50%', background: 'white',
      position: 'absolute', top: 3, left: checked ? 23 : 3,
      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    }} />
  </div>
);

const Row = ({ label, desc, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid var(--border-color)' }}>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1px' }}>{label}</p>
      {desc && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{desc}</p>}
    </div>
    {children}
  </div>
);

const SectionHeader = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
  </div>
);

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const { addNotification } = useContext(NotificationContext);

  // Profile form
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', contact: user?.contact || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSaved, setProfileSaved] = useState(false);

  // Password form
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwSaved, setPwSaved] = useState(false);

  // Notification settings (stored in localStorage)
  const [notifSettings, setNotifSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('transitops_notif_settings') || '{"trips":true,"fuel":true,"push":false}'); }
    catch { return { trips: true, fuel: true, push: false }; }
  });

  const saveProfile = (e) => {
    e.preventDefault();
    const errs = {};
    if (!profile.name.trim()) errs.name = 'Name is required.';
    if (!profile.email.trim()) errs.email = 'Email is required.';
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }
    updateUser(profile);
    addNotification('Profile Updated', `Your profile has been updated successfully.`);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
    setProfileErrors({});
  };

  const savePassword = (e) => {
    e.preventDefault();
    const errs = {};
    const users = JSON.parse(localStorage.getItem('transitops_users') || '[]');
    const me = users.find(u => u.id === user.id);
    if (!pw.current || me?.password !== pw.current) errs.current = 'Current password is incorrect.';
    if (!pw.newPw || pw.newPw.length < 6) errs.newPw = 'Password must be at least 6 characters.';
    if (pw.newPw !== pw.confirm) errs.confirm = 'Passwords do not match.';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    const updated = users.map(u => u.id === user.id ? { ...u, password: pw.newPw } : u);
    localStorage.setItem('transitops_users', JSON.stringify(updated));
    addNotification('Password Changed', 'Your password has been updated successfully.');
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
    setPw({ current: '', newPw: '', confirm: '' });
    setPwErrors({});
  };

  const saveNotifSettings = (s) => {
    const ns = { ...notifSettings, ...s };
    setNotifSettings(ns);
    localStorage.setItem('transitops_notif_settings', JSON.stringify(ns));
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Settings</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manage your account preferences and security.</p>
      </div>

      <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Account */}
        <Card>
          <SectionHeader icon={<User size={18} />} title="Account — Profile Information" />
          <form onSubmit={saveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input style={inputStyle(!!profileErrors.name)} value={profile.name} onChange={e => { setProfile(p => ({ ...p, name: e.target.value })); setProfileErrors(p => ({ ...p, name: undefined })); }} placeholder="Your full name" />
                {profileErrors.name && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '2px' }}>{profileErrors.name}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Email <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="email" style={inputStyle(!!profileErrors.email)} value={profile.email} onChange={e => { setProfile(p => ({ ...p, email: e.target.value })); setProfileErrors(p => ({ ...p, email: undefined })); }} />
                {profileErrors.email && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '2px' }}>{profileErrors.email}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Phone</label>
                <input style={inputStyle(false)} value={profile.contact} onChange={e => setProfile(p => ({ ...p, contact: e.target.value }))} placeholder="+91 98765 43210" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit' }}>
                <Save size={15} /> Save Profile
              </button>
              {profileSaved && <span style={{ fontSize: '0.875rem', color: 'var(--success)', fontWeight: 600 }}>✓ Saved!</span>}
            </div>
          </form>
        </Card>

        {/* Security */}
        <Card>
          <SectionHeader icon={<Shield size={18} />} title="Security — Change Password" />
          <form onSubmit={savePassword}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
              {[
                { key: 'current', label: 'Current Password', ph: '••••••••' },
                { key: 'newPw', label: 'New Password', ph: 'Min. 6 characters' },
                { key: 'confirm', label: 'Confirm New Password', ph: 'Re-enter new password' },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>{label} <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw[key] ? 'text' : 'password'} style={{ ...inputStyle(!!pwErrors[key]), paddingRight: '2.5rem' }}
                      value={pw[key]} onChange={e => { setPw(p => ({ ...p, [key]: e.target.value })); setPwErrors(p => ({ ...p, [key]: undefined })); }} placeholder={ph} />
                    <button type="button" onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                      {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {pwErrors[key] && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '2px' }}>{pwErrors[key]}</p>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit' }}>
                <Shield size={15} /> Update Password
              </button>
              {pwSaved && <span style={{ fontSize: '0.875rem', color: 'var(--success)', fontWeight: 600 }}>✓ Password updated!</span>}
            </div>
          </form>
        </Card>

        {/* Notifications */}
        <Card>
          <SectionHeader icon={<Bell size={18} />} title="Notification Preferences" />
          <Row label="Trip Alerts" desc="Get notified when trips are assigned or updated.">
            <Toggle checked={notifSettings.trips} onChange={v => saveNotifSettings({ trips: v })} />
          </Row>
          <Row label="Fuel Reminders" desc="Reminders to log fuel after completing trips.">
            <Toggle checked={notifSettings.fuel} onChange={v => saveNotifSettings({ fuel: v })} />
          </Row>
          <Row label="Push Notifications" desc="Browser push notifications for real-time updates.">
            <Toggle checked={notifSettings.push} onChange={v => saveNotifSettings({ push: v })} />
          </Row>
        </Card>

        {/* Session */}
        <Card>
          <SectionHeader icon={<LogOut size={18} />} title="Session" />
          <Row label="Current Session" desc="You are currently logged in as a Driver.">
            <span style={{ padding: '3px 12px', borderRadius: '20px', background: 'rgba(34,197,94,0.12)', color: '#16a34a', fontSize: '0.8rem', fontWeight: 700 }}>
              Active
            </span>
          </Row>
          <div style={{ paddingTop: '1rem' }}>
            <button onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'none', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <LogOut size={15} /> Logout from Account
            </button>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default Settings;
