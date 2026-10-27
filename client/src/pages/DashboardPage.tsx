import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DashboardAnalytics } from '../types/index';
import ScoreBadge from '../components/common/ScoreBadge';
import StatusBadge from '../components/common/StatusBadge';
import {
  Users,
  Briefcase,
  FileText,
  UserCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  UploadCloud,
  PlusCircle,
  Award,
  RefreshCw,
  Sparkles,
  BarChart2,
  Filter
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheSource, setCacheSource] = useState<string>('database');

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDashboardAnalytics();
      setData(res.data);
      if (res.source) setCacheSource(res.source);
    } catch (err: any) {
      setError(err.message || 'Failed to load recruitment dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !data) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid #e0e7ff',
              borderTopColor: '#4338ca',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading Recruitment Analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="page-wrapper">
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchDashboard} className="btn btn-primary">
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalCandidates: 12,
    activeJobs: 4,
    totalApplications: 12,
    shortlistedCandidates: 3,
    averageMatchScore: 82,
    interviewsPending: 3
  };

  const pipeline = data?.pipeline || {
    applied: 12,
    screening: 4,
    shortlisted: 3,
    interview: 3,
    hired: 1,
    rejected: 1
  };

  const distribution = data?.scoreDistribution || [
    { bracket: '80-100%', count: 5, percentage: 42 },
    { bracket: '60-79%', count: 4, percentage: 33 },
    { bracket: '40-59%', count: 2, percentage: 17 },
    { bracket: 'Below 40%', count: 1, percentage: 8 },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Recruitment Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Real-time screening insights, candidate rankings, and recruitment pipeline.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={fetchDashboard}
            className="btn btn-secondary btn-sm"
            title="Refresh Data"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => navigate('/jobs/create')}
            className="btn btn-secondary btn-sm"
          >
            <PlusCircle size={14} />
            <span>Post New Job</span>
          </button>

          <button
            onClick={() => navigate('/resumes/upload')}
            className="btn btn-primary btn-sm"
          >
            <UploadCloud size={14} />
            <span>Upload Resume</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {/* KPI 1 */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Candidates</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#eff6ff', color: '#2563eb' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem' }}>{kpis.totalCandidates}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#10b981', marginTop: '0.3rem' }}>
            <TrendingUp size={13} />
            <span>+3 this week</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Active Job Openings</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#f5f3ff', color: '#7c3aed' }}>
              <Briefcase size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem' }}>{kpis.activeJobs}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Across Engineering & AI</div>
        </div>

        {/* KPI 3 */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Applications Received</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#ecfdf5', color: '#059669' }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem' }}>{kpis.totalApplications}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.3rem' }}>100% Parsed & Analyzed</div>
        </div>

        {/* KPI 4 */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Shortlisted Candidates</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#fffbeb', color: '#d97706' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem' }}>{kpis.shortlistedCandidates}</div>
          <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '0.3rem' }}>Match score ≥ 80%</div>
        </div>

        {/* KPI 5 */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Average Match Score</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#fdf2f8', color: '#db2777' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem', color: '#4338ca' }}>
            {kpis.averageMatchScore}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Formula weighted</div>
        </div>

        {/* KPI 6 */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Interviews Pending</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#fff7ed', color: '#ea580c' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem' }}>{kpis.interviewsPending}</div>
          <div style={{ fontSize: '0.75rem', color: '#ea580c', marginTop: '0.3rem' }}>Ready for interview round</div>
        </div>
      </div>

      {/* Candidate Pipeline & Match Score Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Candidate Pipeline Funnel */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Candidate Pipeline</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Progression from Application to Offer
              </p>
            </div>
            <span className="tag">{pipeline.applied} In Total</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { label: 'Applications', count: pipeline.applied, color: '#6366f1', pct: 100 },
              { label: 'Screening', count: pipeline.screening, color: '#0284c7', pct: Math.round((pipeline.screening / (pipeline.applied || 1)) * 100) },
              { label: 'Shortlisted', count: pipeline.shortlisted, color: '#8b5cf6', pct: Math.round((pipeline.shortlisted / (pipeline.applied || 1)) * 100) },
              { label: 'Interview', count: pipeline.interview, color: '#f97316', pct: Math.round((pipeline.interview / (pipeline.applied || 1)) * 100) },
              { label: 'Hired', count: pipeline.hired, color: '#10b981', pct: Math.round((pipeline.hired / (pipeline.applied || 1)) * 100) },
            ].map((step, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-main)' }}>{step.label}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{step.count} candidates ({step.pct}%)</span>
                </div>
                <div style={{ height: '10px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${step.pct}%`,
                      backgroundColor: step.color,
                      borderRadius: '6px',
                      transition: 'width 0.6s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Match Score Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Match Score Distribution</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Automated resume matching breakdown
              </p>
            </div>
            <button onClick={() => navigate('/rankings')} className="btn btn-outline btn-sm">
              View Rankings
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {distribution.map((item, idx) => {
              let barColor = '#dc2626';
              let badgeType: any = 'Low';
              if (item.bracket.includes('80')) { barColor = '#059669'; badgeType = 'Excellent'; }
              else if (item.bracket.includes('60')) { barColor = '#2563eb'; badgeType = 'Strong'; }
              else if (item.bracket.includes('40')) { barColor = '#d97706'; badgeType = 'Moderate'; }

              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: barColor }} />
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.bracket}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({badgeType})</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {item.count} applicants ({item.percentage}%)
                    </span>
                  </div>
                  <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.percentage}%`,
                        backgroundColor: barColor,
                        borderRadius: '6px',
                        transition: 'width 0.6s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.85rem',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem'
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>Matching Logic Formula:</span>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
              (Skills × 60%) + (Exp × 25%) + (Edu × 15%)
            </span>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Recent Applications</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Latest candidate submissions and automated screening scores
            </p>
          </div>
          <button
            onClick={() => navigate('/candidates')}
            className="btn btn-secondary btn-sm"
          >
            <span>View All Candidates</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Applied Job</th>
                <th>Match Score</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentApplications && data.recentApplications.length > 0 ? (
                data.recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{app.candidate_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.email}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{app.job_title}</span>
                    </td>
                    <td>
                      <ScoreBadge score={app.match_score} />
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {new Date(app.applied_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => navigate(`/candidates/${app.candidate_id}`)}
                        className="btn btn-outline btn-sm"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No applications recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
