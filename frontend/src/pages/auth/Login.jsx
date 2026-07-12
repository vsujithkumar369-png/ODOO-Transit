import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      if (data && data.token) {
        navigate('/');
      } else {
        setError('Invalid credentials, please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '1rem'}}>
      <Card title="TransitOps Login" className="login-card" style={{width: '100%', maxWidth: '480px', padding: '1rem'}}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <div style={{marginBottom: '1.25rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '500'}}>Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}} 
              placeholder="manager@transitops.com"
            />
          </div>
          <div style={{marginBottom: '1.75rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '500'}}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}} 
              placeholder="••••••••"
            />
          </div>
          <Button variant="primary" type="submit" disabled={loading} style={{width: '100%', padding: '0.75rem', fontSize: '1rem'}}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem'}}>
            <span style={{color: 'var(--text-secondary)'}}>Don't have an account? </span>
            <a href="/register" style={{color: 'var(--accent-primary)', fontWeight: '600'}}>Register here</a>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default Login;
