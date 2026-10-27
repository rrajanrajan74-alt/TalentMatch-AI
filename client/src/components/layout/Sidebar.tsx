import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  UploadCloud,
  Award,
  BarChart3,
  Settings,
  Sparkles,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/jobs/create', label: 'Create Job', icon: PlusCircle },
    { to: '/candidates', label: 'Candidates', icon: Users },
    { to: '/resumes/upload', label: 'Upload Resume', icon: UploadCloud },
    { to: '/rankings', label: 'Ranked Applicants', icon: Award },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 40
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: '#1e1b4b', // deep navy purple
          color: '#e0e7ff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          transition: 'transform 0.3s ease'
        }}
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
      >
        {/* Brand Header */}
        <div>
          <div
            style={{
              padding: '1.4rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  TalentMatch <span style={{ color: '#818cf8' }}>AI</span>
                </h1>
                <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500 }}>
                  Screening & Analytics
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                display: 'none',
                color: '#94a3b8',
                padding: '0.25rem'
              }}
              className="sidebar-close-btn"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '1.25rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.7rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: isActive ? '#ffffff' : '#c7d2fe',
                    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                    border: isActive ? '1px solid rgba(129, 140, 248, 0.35)' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  })}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Feature Promo */}
        <div style={{ padding: '1.25rem 1rem' }}>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
              color: '#c7d2fe'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontWeight: 700, marginBottom: '0.35rem' }}>
              <Sparkles size={14} />
              <span>Transparent Matching</span>
            </div>
            <p style={{ lineHeight: 1.4, color: '#94a3b8' }}>
              Formula: 60% Skills + 25% Experience + 15% Education.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
