import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Login = () => {
  return (
    <div style={{display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)'}}>
      <Card title="TransitOps Login" className="login-card" style={{width: '400px'}}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{marginBottom: '1rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Email</label>
            <input type="email" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'white'}} placeholder="admin@transitops.com"/>
          </div>
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Password</label>
            <input type="password" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'white'}} placeholder="••••••••"/>
          </div>
          <Button variant="primary" style={{width: '100%'}}>Sign In</Button>
        </form>
      </Card>
    </div>
  );
};
export default Login;
