import React, { useState, useCallback } from 'react';
import { Sun, Moon, Globe, Clock, Lock, Bell, Info } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Toast from '../../components/common/Toast';

// ─── Shared field styles ───────────────────────────────────────────────────────
const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' };
const fieldWrap  = { marginBottom: '20px' };
const btnPrimary = { padding: '9px 20px', backgroundColor: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' };

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, id }) => (
  <label htmlFor={id} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
    <input type="checkbox" id={id} checked={checked} onChange={onChange} style={{ display: 'none' }} />
    <div style={{ width: '44px', height: '24px', borderRadius: '9999px', backgroundColor: checked ? '#1E3A8A' : 'var(--bg-tertiary)', transition: 'background-color 0.2s', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '2px', left: checked ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
    </div>
  </label>
);

// ─── Notification row ──────────────────────────────────────────────────────────
const NotifRow = ({ label, sublabel, checked, onChange, id }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--bg-primary)' }}>
    <div>
      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{label}</p>
      {sublabel && <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sublabel}</p>}
    </div>
    <Toggle checked={checked} onChange={onChange} id={id} />
  </div>
);

const TABS = [
  { key: 'general',       label: 'General',     Icon: Globe  },
  { key: 'appearance',    label: 'Appearance',  Icon: Sun    },
  { key: 'notifications', label: 'Notifications', Icon: Bell },
  { key: 'security',      label: 'Security',    Icon: Lock   },
  { key: 'preferences',   label: 'Preferences', Icon: Clock  },
  { key: 'about',         label: 'About',       Icon: Info   },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [toast, setToast]         = useState(null);
  const showToast = useCallback((type, msg) => setToast({ type, message: msg }), []);

  // General
  const [language, setLanguage]     = useState('en');
  const [timezone, setTimezone]     = useState('UTC+05:30');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  // Appearance
  const [darkMode, setDarkMode]     = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');
  const [density, setDensity]       = useState('comfortable');

  // Notifications
  const [notifs, setNotifs] = useState({ emailAlerts: true, pushNotifs: false, licenseAlerts: true, safetyAlerts: true, incidentAlerts: true, reportAlerts: false });
  const toggleNotif = (key) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  // Security
  const [currentPw,  setCurrentPw]  = useState('');
  const [newPw,      setNewPw]      = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');
  const [pwErrors,   setPwErrors]   = useState({});
  const [pwLoading,  setPwLoading]  = useState(false);

  // Preferences
  const [autoRefresh,   setAutoRefresh]   = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('60');
  const [defaultPage,   setDefaultPage]   = useState('dashboard');

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleSaveGeneral = async () => {
    try {
      // TODO: PUT /api/settings/general — { language, timezone, dateFormat }
      showToast('success', 'General settings saved.');
    } catch {
      showToast('error', 'Failed to save settings.');
    }
  };

  const handleDarkModeToggle = () => {
    const next = !darkMode;
    setDarkMode(next);
    // Toggle theme via data-theme attribute (theme system already reads this)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
    showToast('success', `${next ? 'Dark' : 'Light'} mode enabled.`);
  };

  const handleSaveNotifs = async () => {
    try {
      // TODO: PUT /api/settings/notifications — notifs object
      showToast('success', 'Notification preferences saved.');
    } catch {
      showToast('error', 'Failed to save notification settings.');
    }
  };

  const validatePassword = () => {
    const errs = {};
    if (!currentPw)            errs.currentPw  = 'Current password is required.';
    if (!newPw)                errs.newPw      = 'New password is required.';
    else if (newPw.length < 8) errs.newPw      = 'Password must be at least 8 characters.';
    if (newPw !== confirmPw)   errs.confirmPw  = 'Passwords do not match.';
    return errs;
  };

  const handleChangePassword = async () => {
    const errs = validatePassword();
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwLoading(true);
    setPwErrors({});
    try {
      // TODO: PUT /api/auth/change-password — { currentPassword: currentPw, newPassword: newPw }
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      showToast('success', 'Password changed successfully.');
    } catch {
      showToast('error', 'Failed to change password. Please verify your current password.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      // TODO: PUT /api/settings/preferences — { autoRefresh, refreshInterval, defaultPage }
      showToast('success', 'Preferences saved.');
    } catch {
      showToast('error', 'Failed to save preferences.');
    }
  };

  // ─── Tab content map ───────────────────────────────────────────────────────
  const tabContent = {
    general: (
      <Card title="General Settings">
        <div style={{ maxWidth: '480px' }}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={inputStyle}>
              <option value="en">English (US)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Timezone</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} style={inputStyle}>
              <option value="UTC">UTC</option>
              <option value="UTC+05:30">UTC+05:30 (IST)</option>
              <option value="UTC-05:00">UTC-05:00 (Eastern)</option>
              <option value="UTC-08:00">UTC-08:00 (Pacific)</option>
              <option value="UTC+01:00">UTC+01:00 (CET)</option>
            </select>
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Date Format</label>
            <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} style={inputStyle}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
          </div>
          <button onClick={handleSaveGeneral} style={btnPrimary}>Save Changes</button>
        </div>
      </Card>
    ),

    appearance: (
      <Card title="Appearance">
        <div style={{ maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--bg-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {darkMode ? <Moon size={20} style={{ color: 'var(--text-secondary)' }} /> : <Sun size={20} style={{ color: '#f59e0b' }} />}
              <div>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-primary)' }}>Dark Mode</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Toggle between light and dark themes</p>
              </div>
            </div>
            <Toggle checked={darkMode} onChange={handleDarkModeToggle} id="dark-mode-toggle" />
          </div>
          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>Display Density</label>
            {['compact', 'comfortable', 'spacious'].map(d => (
              <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: `1px solid ${density === d ? '#1E3A8A' : 'var(--border-color)'}`, borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', backgroundColor: density === d ? 'rgba(30,58,138,.05)' : 'transparent' }}>
                <input type="radio" name="density" value={d} checked={density === d} onChange={() => setDensity(d)} style={{ accentColor: '#1E3A8A' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{d}</span>
              </label>
            ))}
          </div>
        </div>
      </Card>
    ),

    notifications: (
      <Card title="Notifications">
        <div style={{ maxWidth: '480px' }}>
          <NotifRow label="Email Alerts"     sublabel="Receive safety alerts via email"     checked={notifs.emailAlerts}    onChange={() => toggleNotif('emailAlerts')}    id="n-email"    />
          <NotifRow label="Push Notifications" sublabel="Browser push notifications"         checked={notifs.pushNotifs}     onChange={() => toggleNotif('pushNotifs')}     id="n-push"     />
          <NotifRow label="License Alerts"   sublabel="Alerts for expiring licenses"         checked={notifs.licenseAlerts}  onChange={() => toggleNotif('licenseAlerts')}  id="n-license"  />
          <NotifRow label="Safety Alerts"    sublabel="Driver safety score warnings"         checked={notifs.safetyAlerts}   onChange={() => toggleNotif('safetyAlerts')}   id="n-safety"   />
          <NotifRow label="Incident Alerts"  sublabel="New and updated incident reports"     checked={notifs.incidentAlerts} onChange={() => toggleNotif('incidentAlerts')} id="n-incident" />
          <NotifRow label="Report Alerts"    sublabel="Generated report notifications"       checked={notifs.reportAlerts}   onChange={() => toggleNotif('reportAlerts')}   id="n-report"   />
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleSaveNotifs} style={btnPrimary}>Save Preferences</button>
          </div>
        </div>
      </Card>
    ),

    security: (
      <Card title="Security">
        <div style={{ maxWidth: '480px' }}>
          <h4 style={{ margin: '0 0 20px', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Change Password</h4>
          {[
            ['currentPw',  'Current Password',    currentPw,  setCurrentPw],
            ['newPw',      'New Password',         newPw,      setNewPw],
            ['confirmPw',  'Confirm New Password', confirmPw,  setConfirmPw],
          ].map(([key, lbl, val, set]) => (
            <div key={key} style={fieldWrap}>
              <label style={labelStyle}>{lbl} <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="password" value={val} onChange={e => set(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, borderColor: pwErrors[key] ? 'var(--danger)' : undefined }} />
              {pwErrors[key] && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px' }}>{pwErrors[key]}</p>}
            </div>
          ))}
          <button onClick={handleChangePassword} disabled={pwLoading} style={{ ...btnPrimary, opacity: pwLoading ? 0.7 : 1, cursor: pwLoading ? 'not-allowed' : 'pointer' }}>
            {pwLoading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </Card>
    ),

    preferences: (
      <Card title="Preferences">
        <div style={{ maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--bg-primary)', marginBottom: '16px' }}>
            <div>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-primary)' }}>Auto Refresh Dashboard</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Automatically refresh KPIs and alerts</p>
            </div>
            <Toggle checked={autoRefresh} onChange={() => setAutoRefresh(v => !v)} id="auto-refresh-toggle" />
          </div>
          {autoRefresh && (
            <div style={fieldWrap}>
              <label style={labelStyle}>Refresh Interval (seconds)</label>
              <select value={refreshInterval} onChange={e => setRefreshInterval(e.target.value)} style={inputStyle}>
                <option value="30">30 seconds</option>
                <option value="60">60 seconds</option>
                <option value="120">2 minutes</option>
                <option value="300">5 minutes</option>
              </select>
            </div>
          )}
          <div style={fieldWrap}>
            <label style={labelStyle}>Default Landing Page</label>
            <select value={defaultPage} onChange={e => setDefaultPage(e.target.value)} style={inputStyle}>
              <option value="dashboard">Dashboard</option>
              <option value="compliance">Driver Compliance</option>
              <option value="licenses">License Monitoring</option>
              <option value="incidents">Incident Reports</option>
              <option value="safety-reports">Safety Reports</option>
            </select>
          </div>
          <button onClick={handleSavePreferences} style={btnPrimary}>Save Preferences</button>
        </div>
      </Card>
    ),

    about: (
      <Card title="About TransitOps">
        <div style={{ maxWidth: '480px' }}>
          {[
            ['Application', 'TransitOps'],
            ['Module', 'Safety Officer Dashboard'],
            ['Version', '1.0.0'],
            ['Build', 'Production'],
            ['Stack', 'React 19 + Vite + Tailwind CSS'],
            ['Backend', 'REST API (Node.js / Express)'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--bg-primary)', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{value}</span>
            </div>
          ))}
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'rgba(30,58,138,.05)', border: '1px solid rgba(30,58,138,.15)', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              TransitOps is an enterprise-grade fleet and safety management platform built for logistics operations. This dashboard module is dedicated to the Safety Officer role.
            </p>
          </div>
        </div>
      </Card>
    ),
  };

  return (
    <DashboardLayout>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Safety Officer / Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Home &gt; Safety Officer &gt; Settings</p>
      </div>

      <div className="page-content" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Sidebar nav */}
        <div style={{ width: '220px', flexShrink: 0 }}>
          <Card>
            <nav role="navigation" aria-label="Settings navigation">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  aria-current={activeTab === tab.key ? 'page' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '4px', textAlign: 'left', fontSize: '0.875rem', fontWeight: activeTab === tab.key ? '600' : '500',
                    backgroundColor: activeTab === tab.key ? 'rgba(30,58,138,.1)' : 'transparent',
                    color: activeTab === tab.key ? '#1E3A8A' : 'var(--text-secondary)',
                  }}
                  onMouseOver={e => { if (activeTab !== tab.key) e.currentTarget.style.backgroundColor = 'var(--bg-primary)'; }}
                  onMouseOut={e  => { if (activeTab !== tab.key) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <tab.Icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {tabContent[activeTab]}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
