import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FleetManager');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await authService.register({ name, email, phone, password, role });
      if (data) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Registration failed, please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '2rem 1rem'}}>
      <Card title="TransitOps Registration" className="register-card" style={{width: '100%', maxWidth: '480px', padding: '1rem'}}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {success}
            </div>
          )}
          
          <div style={{marginBottom: '1.25rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '500'}}>Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}} 
              placeholder="Thirumurugan"
            />
          </div>

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

          <div style={{marginBottom: '1.25rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '500'}}>Phone Number</label>
            <input 
              type="tel" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}} 
              placeholder="9876543210"
            />
          </div>

          <div style={{marginBottom: '1.25rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '500'}}>Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer'}}
            >
              <option value="FleetManager">Fleet Manager</option>
              <option value="Driver">Driver</option>
              <option value="SafetyOfficer">Safety Officer</option>
              <option value="FinancialAnalyst">Financial Analyst</option>
            </select>
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
            {loading ? 'Creating Account...' : 'Register'}
          </Button>

          <div style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem'}}>
            <span style={{color: 'var(--text-secondary)'}}>Already have an account? </span>
            <a href="/login" style={{color: 'var(--accent-primary)', fontWeight: '600'}}>Sign in here</a>
          </div>
        </form>
        </Card>
    </div>
  );
};

export default Register;
