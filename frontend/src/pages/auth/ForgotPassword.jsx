import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Mock API call to send reset email
    setTimeout(() => {
      setSuccess(`A password reset link has been successfully sent to ${email} via Gmail.`);
      setLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <div style={{display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '1rem'}}>
      <Card title="Reset Password" style={{width: '100%', maxWidth: '480px', padding: '1rem'}}>
        <form onSubmit={handleSubmit}>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem'}}>
            Enter the email address associated with your account, and we'll send you a link to reset your password via Gmail.
          </p>

          {success && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', borderRadius: '4px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              {success}
            </div>
          )}

          <div style={{marginBottom: '1.5rem'}}>
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

          <Button variant="primary" type="submit" disabled={loading} style={{width: '100%', padding: '0.75rem', fontSize: '1rem', marginBottom: '1rem'}}>
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </Button>

          <div style={{textAlign: 'center', fontSize: '0.875rem'}}>
            <a href="/login" style={{color: 'var(--accent-primary)', fontWeight: '600'}}>Back to Sign In</a>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
