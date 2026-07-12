import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Configure system preferences and user account settings.</p>
      </div>

      <div className="responsive-grid-2">
        <Card title="Profile Settings">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Full Name', 'Email Address', 'Phone Number'].map(label => (
              <div key={label}>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{label}</label>
                <input
                  type="text"
                  placeholder={label}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                />
              </div>
            ))}
            <button style={{ marginTop: '0.5rem', padding: '0.65rem 1rem', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Save Changes
            </button>
          </div>
        </Card>

        <Card title="System Preferences">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Email Notifications', description: 'Receive alerts about trips and maintenance' },
              { label: 'Dark Mode', description: 'Toggle dark mode theme (coming soon)' },
              { label: 'Auto Dispatch Alerts', description: 'Send SMS on dispatch status changes' },
            ].map(pref => (
              <div key={pref.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{pref.label}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{pref.description}</div>
                </div>
                <div style={{ width: '44px', height: '24px', background: 'var(--accent-primary)', borderRadius: '12px', cursor: 'pointer' }}></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Settings;
