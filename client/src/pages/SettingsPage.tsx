import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Settings,
  Bell,
  Database,
  Zap,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Save,
  ShieldCheck
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(user?.email || 'recruiter@talentmatch.ai');
  const [company, setCompany] = useState(user?.company || 'TalentMatch AI Demo');

  // Matching Weights
  const [skillWeight, setSkillWeight] = useState(60);
  const [expWeight, setExpWeight] = useState(25);
  const [eduWeight, setEduWeight] = useState(15);

  // Notification Preferences
  const [notifyOnUpload, setNotifyOnUpload] = useState(true);
  const [notifyOnShortlist, setNotifyOnShortlist] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Status feedback
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Load saved preferences on mount
  useEffect(() => {
    // 1. Profile
    try {
      const savedProfile = localStorage.getItem('tm_settings_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.company) setCompany(parsed.company);
      } else if (user) {
        setName(user.name);
        setEmail(user.email);
        setCompany(user.company || 'TalentMatch AI Demo');
      }
    } catch {
      // ignore
    }

    // 2. Weights
    try {
      const savedWeights = localStorage.getItem('tm_matching_weights');
      if (savedWeights) {
        const parsed = JSON.parse(savedWeights);
        if (typeof parsed.skillWeight === 'number') setSkillWeight(parsed.skillWeight);
        if (typeof parsed.expWeight === 'number') setExpWeight(parsed.expWeight);
        if (typeof parsed.eduWeight === 'number') setEduWeight(parsed.eduWeight);
      }
    } catch {
      // ignore
    }

    // 3. Notifications
    try {
      const savedNotifications = localStorage.getItem('tm_notification_prefs');
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        if (typeof parsed.notifyOnUpload === 'boolean') setNotifyOnUpload(parsed.notifyOnUpload);
        if (typeof parsed.notifyOnShortlist === 'boolean') setNotifyOnShortlist(parsed.notifyOnShortlist);
        if (typeof parsed.weeklyDigest === 'boolean') setWeeklyDigest(parsed.weeklyDigest);
      }
    } catch {
      // ignore
    }

    // Check backend health
    fetch('/api/health')
      .then((res) => {
        if (res.ok) setBackendStatus('online');
        else setBackendStatus('offline');
      })
      .catch(() => setBackendStatus('offline'));
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const profileData = { name, email, company };
    localStorage.setItem('tm_settings_profile', JSON.stringify(profileData));
    updateUser(profileData);

    setSavedMessage('Recruiter profile updated and saved to local storage.');
    setTimeout(() => setSavedMessage(null), 3500);
  };

  const handleSaveScoringAndPrefs = () => {
    setErrorMessage(null);
    const sum = skillWeight + expWeight + eduWeight;

    if (sum !== 100) {
      setErrorMessage(`Total match formula weights must equal exactly 100% (currently ${sum}%). Please adjust the sliders before saving.`);
      return;
    }

    const weights = { skillWeight, expWeight, eduWeight };
    const notifications = { notifyOnUpload, notifyOnShortlist, weeklyDigest };

    localStorage.setItem('tm_matching_weights', JSON.stringify(weights));
    localStorage.setItem('tm_notification_prefs', JSON.stringify(notifications));

    setSavedMessage('Scoring formula weights and notification preferences successfully saved.');
    setTimeout(() => setSavedMessage(null), 3500);
  };

  const handleResetWeights = () => {
    setSkillWeight(60);
    setExpWeight(25);
    setEduWeight(15);
    localStorage.setItem('tm_matching_weights', JSON.stringify({ skillWeight: 60, expWeight: 25, eduWeight: 15 }));
    setSavedMessage('Scoring formula weights reset to default values (60% Skills / 25% Experience / 15% Education).');
    setTimeout(() => setSavedMessage(null), 3500);
  };

  const currentTotal = skillWeight + expWeight + eduWeight;

  return (
    <div className="page-wrapper animate-fade-in" style={{ maxWidth: '850px' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Platform Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Configure your recruiter profile, scoring weights, notification alerts, and database cache.
        </p>
      </div>

      {savedMessage && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={18} />
          <span>{savedMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section 1: Recruiter Profile */}
      <form onSubmit={handleSaveProfile} className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--primary)" />
            <h2 className="card-title">Recruiter Profile</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary btn-sm">
            <Save size={14} /> Save Profile Changes
          </button>
        </div>
      </form>

      {/* Section 2: Transparent Resume Matching Weights */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} color="var(--primary)" />
            <h2 className="card-title">Match Scoring Formula Weights</h2>
          </div>
          <button onClick={handleResetWeights} className="btn btn-secondary btn-sm" type="button">
            <RefreshCw size={13} /> Reset Defaults
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Customize how candidate match scores are calculated. Default weights: Skills (60%), Experience (25%), Education (15%). Total must sum to 100%.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Skill Weight */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}>
              <span>Technical Skills Weight</span>
              <span style={{ color: '#059669' }}>{skillWeight}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="80"
              value={skillWeight}
              onChange={(e) => setSkillWeight(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          {/* Experience Weight */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}>
              <span>Experience Level Weight</span>
              <span style={{ color: '#2563eb' }}>{expWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={expWeight}
              onChange={(e) => setExpWeight(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb' }}
            />
          </div>

          {/* Education Weight */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}>
              <span>Education & Degree Weight</span>
              <span style={{ color: '#7c3aed' }}>{eduWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={eduWeight}
              onChange={(e) => setEduWeight(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#7c3aed' }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: '1.25rem',
            padding: '0.85rem 1rem',
            backgroundColor: currentTotal === 100 ? '#f0fdf4' : '#fef2f2',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${currentTotal === 100 ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ fontWeight: 600, color: currentTotal === 100 ? '#166534' : '#991b1b' }}>
            Calculated Total Weight:
          </span>
          <span style={{ fontWeight: 800, color: currentTotal === 100 ? '#059669' : '#dc2626' }}>
            {currentTotal}% {currentTotal === 100 ? '(Balanced 100%)' : `(Adjustment needed: ${100 - currentTotal > 0 ? `+${100 - currentTotal}%` : `${100 - currentTotal}%`})`}
          </span>
        </div>
      </div>

      {/* Section 3: Notification Settings */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="var(--primary)" />
            <h2 className="card-title">Notification Settings</h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={notifyOnUpload}
              onChange={(e) => setNotifyOnUpload(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>New Resume Upload Notifications</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receive an alert when a candidate uploads a resume for an active job</div>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={notifyOnShortlist}
              onChange={(e) => setNotifyOnShortlist(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>High-Match Candidate Alert (≥ 80%)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Get notified immediately when an applicant achieves an Excellent Match score</div>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Weekly Recruitment Funnel Digest</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receive a summary email of applicant volume and hiring velocity</div>
            </div>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={handleSaveScoringAndPrefs}
            className="btn btn-primary btn-sm"
          >
            <Save size={14} /> Save Scoring & Preferences
          </button>
        </div>
      </div>

      {/* Section 4: System & Infrastructure Settings */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} color="var(--primary)" />
            <h2 className="card-title">System & Storage Runtime Status</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Database size={16} color="#059669" />
              <strong style={{ fontSize: '0.85rem' }}>Storage Engine</strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
              Dual Mode: In-Memory / PostgreSQL
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Seeded candidate dataset active with instant local state persistence.
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Zap size={16} color="#2563eb" />
              <strong style={{ fontSize: '0.85rem' }}>Backend API Service</strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: backendStatus === 'online' ? '#059669' : '#dc2626', fontWeight: 600 }}>
              {backendStatus === 'online' ? 'Online (Port 5000)' : backendStatus === 'checking' ? 'Checking connectivity...' : 'Offline / Reconnecting'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Express REST endpoints with JWT authentication and fallback cache.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="#10b981" />
            TalentMatch AI Engine v1.0.0
          </span>
          <span>Docker Ready / Local Standalone</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
