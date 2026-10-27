import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Mail, User, Building, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password, company);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginAsDemo();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top left, #1e1b4b 0%, #0f172a 100%)',
        padding: '1.5rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
        className="animate-fade-in"
      >
        {/* Header Branding */}
        <div
          style={{
            background: 'var(--primary-gradient)',
            padding: '2.25rem 2rem',
            textAlign: 'center',
            color: '#ffffff'
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Sparkles size={28} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '0.4rem' }}>
            TalentMatch AI
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#c7d2fe', fontWeight: 500, lineHeight: 1.4 }}>
            Intelligent Resume Screening & Recruitment Analytics
          </p>
        </div>

        {/* Form Container */}
        <div style={{ padding: '2rem' }}>
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                color: '#b91c1c',
                fontSize: '0.85rem',
                marginBottom: '1.25rem'
              }}
            >
              {error}
            </div>
          )}

          {/* Quick Demo Access Banner */}
          <div
            style={{
              backgroundColor: '#f5f3ff',
              border: '1px solid #ddd6fe',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.825rem', color: '#4338ca' }}>
                Instant Recruiter Demo
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6366f1' }}>
                Prefilled with 4 jobs & 12 ranked candidates
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn btn-sm btn-primary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              <span>1-Click Login</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '2.3rem' }}
                      placeholder="e.g. Sarah Jenkins"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '2.3rem' }}
                      placeholder="e.g. Acme Corp"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.3rem' }}
                  placeholder="recruiter@talentmatch.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.3rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.8rem' }}
            >
              {loading ? 'Authenticating...' : isRegister ? 'Create Recruiter Account' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  style={{ color: 'var(--primary)', fontWeight: 700 }}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                New to TalentMatch AI?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  style={{ color: 'var(--primary)', fontWeight: 700 }}
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderTop: '1px solid var(--border-light)',
            padding: '1rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>PostgreSQL & Redis Backed • Enterprise Grade Security</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '400px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Password Reset</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              For the demo environment, you can use the default credential:
            </p>
            <div
              style={{
                backgroundColor: '#f1f5f9',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                marginBottom: '1.25rem'
              }}
            >
              <div><strong>Email:</strong> recruiter@talentmatch.ai</div>
              <div><strong>Password:</strong> password123</div>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Close & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
