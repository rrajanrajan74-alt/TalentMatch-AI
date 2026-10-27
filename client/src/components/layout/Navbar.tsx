import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  UploadCloud,
  Database,
  Zap,
  LogOut,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <header
      style={{
        height: '68px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      {/* Left: Mobile Toggle & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem',
            borderRadius: '6px',
            color: 'var(--text-secondary)'
          }}
          className="sidebar-toggle-btn"
          aria-label="Toggle Navigation"
        >
          <Menu size={22} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#f1f5f9',
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            width: '280px',
            color: 'var(--text-muted)'
          }}
        >
          <Search size={16} />
          <input
            type="text"
            placeholder="Search candidates, skills, jobs..."
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.85rem',
              width: '100%',
              color: 'var(--text-main)'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/candidates?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
              }
            }}
          />
        </div>
      </div>

      {/* Right: Status Pills, Upload CTA, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* System Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0'
            }}
            title="PostgreSQL Database Connected"
          >
            <Database size={12} />
            <span>PostgreSQL</span>
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe'
            }}
            title="Redis Caching Engine Active"
          >
            <Zap size={12} />
            <span>Redis Cache</span>
          </span>
        </div>

        {/* Upload Resume CTA */}
        <button
          onClick={() => navigate('/resumes/upload')}
          className="btn btn-primary btn-sm"
          style={{ gap: '0.4rem' }}
        >
          <UploadCloud size={16} />
          <span>Upload Resume</span>
        </button>

        {/* Recruiter Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              {user?.name?.charAt(0) || 'R'}
            </div>
            <div style={{ textAlign: 'left', display: 'none', lineHeight: 1.2 }} className="profile-text">
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user?.name || 'Sarah Jenkins'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Recruiter
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '42px',
                width: '210px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-light)',
                padding: '0.5rem',
                zIndex: 50
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name || 'Sarah Jenkins'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email || 'recruiter@talentmatch.ai'}</div>
              </div>
              <button
                onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left'
                }}
              >
                <UserIcon size={16} />
                <span>Account & Settings</span>
              </button>
              <button
                onClick={() => { setShowProfileMenu(false); logout(); navigate('/login'); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.85rem',
                  color: '#dc2626',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left'
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
