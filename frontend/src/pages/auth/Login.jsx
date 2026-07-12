import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

const QUICK_LOGINS = [
  { label: 'Driver', email: 'driver@transitops.com', password: 'driver123' },
  { label: 'Fleet Manager', email: 'manager@transitops.com', password: 'manager123' },
  { label: 'Safety Officer', email: 'safety@transitops.com', password: 'safety123' },
  { label: 'Financial Analyst', email: 'analyst@transitops.com', password: 'analyst123' },
];

const Login = () => {
  const [email, setEmail] = useState('driver@transitops.com');
  const [password, setPassword] = useState('driver123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      // Redirect by role
      if (user.role === 'Driver') {
        navigate('/driver/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuick = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>🚛 TransitOps</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Enterprise Fleet Management System</p>
        </div>

        <Card title="">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Welcome back</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Sign in to your account to continue</p>

          {/* Quick login */}
          <div style={{ marginBottom: '1.5rem', padding: '0.875rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.625rem' }}>
              Quick Login
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {QUICK_LOGINS.map(q => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => fillQuick(q)}
                  style={{
                    padding: '0.3rem 0.875rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    border: `1px solid ${email === q.email ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    borderRadius: '20px',
                    background: email === q.email ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: email === q.email ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '0.75rem', marginBottom: '1rem',
                backgroundColor: 'rgba(239,68,68,0.08)',
                color: 'var(--danger)',
                borderRadius: '6px',
                border: '1px solid rgba(239,68,68,0.3)',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1.125rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                style={{
                  width: '100%', padding: '0.625rem 0.875rem',
                  borderRadius: '6px', border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)',
                  fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
                }}
                placeholder="driver@transitops.com"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                style={{
                  width: '100%', padding: '0.625rem 0.875rem',
                  borderRadius: '6px', border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)',
                  fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
                }}
                placeholder="••••••••"
              />
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem', justifyContent: 'center' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Card>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Default password for each demo account is shown in Quick Login section.
        </p>
      </div>
    </div>
  );
};

export default Login;
