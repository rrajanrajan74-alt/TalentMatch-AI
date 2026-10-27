import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Sliders,
  BarChart3,
  Users,
  Briefcase,
  UploadCloud,
  ShieldCheck,
  FileText,
  Target,
  TrendingUp,
  Award,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStartScreening = () => {
    if (isAuthenticated) {
      navigate('/resumes/upload');
    } else {
      navigate('/login');
    }
  };

  const handleExplorePlatform = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      const el = document.getElementById('product-preview');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/login');
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#0f172a' }}>
      {/* 1. Header Navigation */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(67, 56, 202, 0.25)'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                TalentMatch <span style={{ color: '#4338ca' }}>AI</span>
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              fontSize: '0.92rem',
              fontWeight: 500,
              color: '#475569'
            }}
            className="landing-nav"
          >
            <a href="#product-preview" style={{ transition: 'color 0.15s ease' }}>
              Product
            </a>
            <a href="#how-it-works" style={{ transition: 'color 0.15s ease' }}>
              How It Works
            </a>
            <a href="#benefits" style={{ transition: 'color 0.15s ease' }}>
              Benefits
            </a>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn btn-primary btn-sm"
                style={{ padding: '0.55rem 1.15rem' }}
              >
                Go to Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    padding: '0.5rem 0.85rem'
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.55rem 1.15rem' }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section
        style={{
          padding: '4.5rem 1.5rem 3.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          textAlign: 'center',
          background: 'radial-gradient(ellipse at 50% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            backgroundColor: '#eef2ff',
            border: '1px solid #c7d2fe',
            color: '#3730a3',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}
        >
          <Sparkles size={14} color="#4338ca" />
          <span>Intelligent Resume Screening & Recruitment Analytics Platform</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.75rem)',
            fontWeight: 850,
            color: '#0f172a',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '920px',
            margin: '0 auto 1.35rem'
          }}
        >
          Find the right talent.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #312e81 0%, #4338ca 60%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Not just another resume.
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#475569',
            maxWidth: '720px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.6
          }}
        >
          Automate resume screening, eliminate hiring bias with transparent 3-factor matching,
          and surface top applicants in seconds with explainable scoring and full-funnel analytics.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}
        >
          <button
            onClick={handleStartScreening}
            className="btn btn-primary"
            style={{ padding: '0.8rem 1.75rem', fontSize: '1rem', borderRadius: '10px' }}
          >
            <UploadCloud size={18} />
            <span>Start Screening</span>
          </button>
          <button
            onClick={handleExplorePlatform}
            className="btn btn-secondary"
            style={{ padding: '0.8rem 1.75rem', fontSize: '1rem', borderRadius: '10px' }}
          >
            <span>Explore Platform</span>
            <ChevronRight size={17} />
          </button>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.75rem',
            fontSize: '0.85rem',
            color: '#64748b'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>Zero black-box scoring</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>Multi-format parser (PDF, DOCX, TXT)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>Weighted 3-factor matching</span>
          </div>
        </div>
      </section>

      {/* 3. Product Preview Showcase (#product-preview) */}
      <section
        id="product-preview"
        style={{
          padding: '2.5rem 1.5rem 5rem',
          maxWidth: '1240px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}
        >
          {/* Top Window Bar */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', marginLeft: '0.5rem' }}>
                TalentMatch AI · Live Evaluation Console
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#4338ca', fontWeight: 600 }}>
              Job: Senior Full-Stack Engineer (Requisition #REQ-101)
            </div>
          </div>

          {/* Interactive Mock Preview Grid */}
          <div
            style={{
              padding: '1.75rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              backgroundColor: '#fafafa'
            }}
          >
            {/* Left Card: Candidate Evaluation Detail */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>Priya Sharma</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.15rem' }}>
                    Senior Software Engineer · 6.5 Years Experience · B.Tech Computer Science
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1 }}>94%</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Excellent</div>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Technical Skills Match (60% weight)</span>
                    <strong style={{ color: '#059669' }}>95%</strong>
                  </div>
                  <div style={{ height: '7px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '95%', height: '100%', backgroundColor: '#059669', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Experience Level (25% weight)</span>
                    <strong style={{ color: '#2563eb' }}>92%</strong>
                  </div>
                  <div style={{ height: '7px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '92%', height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Education & Degree (15% weight)</span>
                    <strong style={{ color: '#7c3aed' }}>95%</strong>
                  </div>
                  <div style={{ height: '7px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '95%', height: '100%', backgroundColor: '#7c3aed', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>

              {/* Matched Skills Pills */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
                  Matched Required Skills
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {['React.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'].map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        border: '1px solid #bfdbfe'
                      }}
                    >
                      ✓ {skill}
                    </span>
                  ))}
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px'
                    }}
                  >
                    + Redis (Preferred)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Instant Leaderboard */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={18} color="#4338ca" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Applicant Rankings</h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Showing all eligible</span>
                </div>

                {/* Candidate Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[
                    { rank: 1, name: 'Priya Sharma', score: 94, status: 'Shortlisted', color: '#059669', badgeBg: '#ecfdf5' },
                    { rank: 2, name: 'Marcus Chen', score: 89, status: 'Screening', color: '#2563eb', badgeBg: '#eff6ff' },
                    { rank: 3, name: 'Aisha Patel', score: 82, status: 'Interview', color: '#7c3aed', badgeBg: '#f5f3ff' },
                    { rank: 4, name: 'David Kim', score: 76, status: 'Applied', color: '#d97706', badgeBg: '#fffbeb' }
                  ].map((row) => (
                    <div
                      key={row.rank}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: row.rank === 1 ? '#4338ca' : '#e2e8f0',
                            color: row.rank === 1 ? '#ffffff' : '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          {row.rank}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{row.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Status: {row.status}</div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: row.color,
                          backgroundColor: row.badgeBg,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px'
                        }}
                      >
                        {row.score}% Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: '#64748b'
                }}
              >
                <span>Full funnel conversion tracked</span>
                <Link to="/login" style={{ color: '#4338ca', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  View Live Leaderboard <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Three Core Benefits (#benefits) */}
      <section
        id="benefits"
        style={{
          padding: '4.5rem 1.5rem',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#4338ca',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              Enterprise Capabilities
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
                fontWeight: 800,
                color: '#0f172a',
                marginTop: '0.4rem',
                letterSpacing: '-0.02em'
              }}
            >
              Designed for High-Volume Technical Hiring
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Built specifically to replace subjective manual screening with objective, verifiable candidate match scores.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {/* Benefit 1 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '2rem',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#eef2ff',
                    color: '#4338ca',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  <FileText size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Intelligent Resume Screening
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Multi-format resume ingestion supporting PDF, DOCX, and plain text. Boundary-aware
                  regular expressions accurately detect complex symbols like C++, C#, .NET, Node.js, and CI/CD
                  without false positive collisions.
                </p>
              </div>

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.82rem',
                  color: '#059669',
                  fontWeight: 600
                }}
              >
                <CheckCircle2 size={16} />
                <span>Zero substring false positives</span>
              </div>
            </div>

            {/* Benefit 2 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '2rem',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  <Sliders size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Explainable Candidate Matching
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Every match score provides complete mathematical transparency. Candidates are evaluated
                  across 3 dimensions: Technical Skills (60%), Experience Level (25%), and Education (15%),
                  with custom weight adjustments directly in recruiter settings.
                </p>
              </div>

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.82rem',
                  color: '#2563eb',
                  fontWeight: 600
                }}
              >
                <CheckCircle2 size={16} />
                <span>Auditable, bias-free score formula</span>
              </div>
            </div>

            {/* Benefit 3 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '2rem',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#f5f3ff',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  <BarChart3 size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Recruitment Analytics
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Gain real-time visibility into your hiring pipeline. Monitor application velocity, stage conversion
                  percentages from applied to hired, score distributions, and in-demand skill requirements across
                  all departments.
                </p>
              </div>

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.82rem',
                  color: '#7c3aed',
                  fontWeight: 600
                }}
              >
                <CheckCircle2 size={16} />
                <span>Dynamic funnel calculation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Four Workflow Steps (#how-it-works) */}
      <section
        id="how-it-works"
        style={{
          padding: '5rem 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#4338ca',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            End-to-End Workflow
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: '#0f172a',
              marginTop: '0.4rem',
              letterSpacing: '-0.02em'
            }}
          >
            How TalentMatch AI Accelerates Hiring
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Four straightforward steps from job requisition to finalized hiring decision.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            position: 'relative'
          }}
        >
          {/* Step 1 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.75rem',
              position: 'relative',
              transition: 'transform 0.2s ease'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#4338ca',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                marginBottom: '1rem'
              }}
            >
              1
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Create Job
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55 }}>
              Specify title, department, required technical skills, preferred qualifications, and minimum years
              of experience.
            </p>
          </div>

          {/* Step 2 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.75rem',
              position: 'relative',
              transition: 'transform 0.2s ease'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                marginBottom: '1rem'
              }}
            >
              2
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Upload Resumes
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55 }}>
              Drag and drop resumes in batch. The parser extracts candidates, contact details, degrees,
              and skills automatically.
            </p>
          </div>

          {/* Step 3 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.75rem',
              position: 'relative',
              transition: 'transform 0.2s ease'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                marginBottom: '1rem'
              }}
            >
              3
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Compare Candidates
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55 }}>
              Review comprehensive leaderboards displaying all applicants, matching tiers, missing skills,
              and detailed scorecards.
            </p>
          </div>

          {/* Step 4 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.75rem',
              position: 'relative',
              transition: 'transform 0.2s ease'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#059669',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                marginBottom: '1rem'
              }}
            >
              4
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Make Decisions
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55 }}>
              Transition candidates to Shortlisted, Interview, or Hired status with one click, updating
              funnel analytics in real time.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Final Call to Action */}
      <section
        style={{
          padding: '4.5rem 1.5rem',
          backgroundColor: '#1e1b4b', // deep navy purple
          color: '#ffffff',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 850,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
              color: '#ffffff'
            }}
          >
            Find the right talent. Not just another resume.
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#c7d2fe',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}
          >
            Join recruiters and engineering managers who use TalentMatch AI to streamline candidate evaluation,
            eliminate manual screening fatigue, and build high-performing teams.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/login"
              className="btn"
              style={{
                backgroundColor: '#ffffff',
                color: '#1e1b4b',
                fontWeight: 700,
                padding: '0.8rem 1.85rem',
                borderRadius: '10px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
              }}
            >
              <span>Launch TalentMatch AI</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="btn"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.8rem 1.6rem',
                borderRadius: '10px'
              }}
            >
              <span>Explore Features</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. Professional Footer */}
      <footer
        style={{
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          padding: '3.5rem 1.5rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Col 1: Brand Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Sparkles size={16} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                TalentMatch <span style={{ color: '#818cf8' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', lineHeight: 1.6, color: '#94a3b8' }}>
              Intelligent Resume Screening & Recruitment Analytics Platform.
              Fast, transparent, and explainable candidate matching.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h5 style={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              Platform
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.84rem' }}>
              <li>
                <Link to="/login" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                  Recruiter Sign In
                </Link>
              </li>
              <li>
                <a href="#product-preview" style={{ color: '#94a3b8' }}>
                  Live Evaluation Console
                </a>
              </li>
              <li>
                <a href="#how-it-works" style={{ color: '#94a3b8' }}>
                  4-Step Workflow
                </a>
              </li>
              <li>
                <a href="#benefits" style={{ color: '#94a3b8' }}>
                  Features & Benefits
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Technology */}
          <div>
            <h5 style={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              Technology Stack
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.84rem' }}>
              <li>React 18 & TypeScript Frontend</li>
              <li>Node.js & Express REST Backend</li>
              <li>Dual PostgreSQL / In-Memory Driver</li>
              <li>Boundary-Aware Regex Skill Engine</li>
            </ul>
          </div>

          {/* Col 4: Compliance & Architecture */}
          <div>
            <h5 style={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              System Integrity
            </h5>
            <p style={{ fontSize: '0.84rem', lineHeight: 1.55, color: '#94a3b8', marginBottom: '0.75rem' }}>
              Designed with complete score explainability and deterministic matching formula.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#10b981' }}>
              <ShieldCheck size={16} />
              <span>Enterprise Ready v1.0.0</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#64748b'
          }}
        >
          <span>© 2026 TalentMatch AI. All rights reserved.</span>
          <span>Designed for HR Teams & Engineering Recruiters.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
