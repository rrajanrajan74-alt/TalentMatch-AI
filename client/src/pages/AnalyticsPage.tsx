import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { DashboardAnalytics } from '../types/index';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Award,
  Clock,
  Briefcase,
  Users,
  CheckCircle2,
  RefreshCw,
  Zap,
  Filter
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [jobsData, setJobsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [dashRes, jobsRes] = await Promise.all([
        api.getDashboardAnalytics(),
        api.getJobsAnalytics()
      ]);
      setData(dashRes.data);
      setJobsData(jobsRes.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const kpis = data?.kpis || {
    totalApplications: 12,
    averageMatchScore: 82,
    shortlistedCandidates: 3,
    activeJobs: 4,
    interviewsPending: 3,
    totalCandidates: 12
  };

  const metrics = data?.metrics || {
    shortlistRate: '25%',
    interviewRate: '25%',
    hiringRate: '8%',
    averageScreeningTime: '1.4 Days'
  };

  const pipeline = data?.pipeline || {
    applied: 12,
    screening: 4,
    shortlisted: 3,
    interview: 3,
    hired: 1,
    rejected: 1
  };

  const skillsInDemand = data?.skillsInDemand || [
    { skill: 'React', count: 4 },
    { skill: 'TypeScript', count: 4 },
    { skill: 'Node.js', count: 3 },
    { skill: 'PostgreSQL', count: 3 },
    { skill: 'REST API', count: 3 },
    { skill: 'Docker', count: 3 },
    { skill: 'Redis', count: 2 },
    { skill: 'Python', count: 2 },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>HR Recruitment Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Comprehensive performance metrics, talent pipeline velocity, and skill demand insights.
          </p>
        </div>

        <button onClick={fetchAnalytics} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh Analytics
        </button>
      </div>

      {/* 6 Key Recruitment Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Applications</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-main)' }}>
            {kpis.totalApplications}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Across all open positions</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Average Match Score</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: '#4338ca' }}>
            {kpis.averageMatchScore}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '0.25rem' }}>High screening precision</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Shortlist Rate</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: '#7c3aed' }}>
            {metrics.shortlistRate}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Score ≥ 80% threshold</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Interview Rate</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: '#ea580c' }}>
            {metrics.interviewRate}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Moved to technical rounds</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Hiring Conversion</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: '#16a34a' }}>
            {metrics.hiringRate}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem' }}>Offers accepted</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Avg. Screening Time</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: '#0284c7' }}>
            {metrics.averageScreeningTime}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>-78% faster than manual</div>
        </div>
      </div>

      {/* Grid: 2 Charts per row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Chart 1: Applications by Job */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Applications by Job Opening</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Candidate volume distribution across requisitions
              </p>
            </div>
            <Briefcase size={18} color="var(--primary)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {jobsData.map((j, idx) => {
              const maxApps = Math.max(...jobsData.map(item => item.applications), 1);
              const pct = Math.round((j.applications / maxApps) * 100);

              return (
                <div key={j.id || idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{j.title}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong>{j.applications}</strong> candidates (Avg {j.averageMatchScore}%)
                    </span>
                  </div>
                  <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.max(8, pct)}%`,
                        background: 'linear-gradient(90deg, #4338ca 0%, #6366f1 100%)',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Candidate Status Funnel */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Recruitment Hiring Funnel</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                End-to-end recruitment stage conversion
              </p>
            </div>
            <Users size={18} color="#7c3aed" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {[
              { stage: '1. Applied Candidates', count: pipeline.applied, color: '#4338ca', width: '100%' },
              { stage: '2. Screening Stage', count: pipeline.screening, color: '#0284c7', width: '85%' },
              { stage: '3. Shortlisted (≥ 80%)', count: pipeline.shortlisted, color: '#7c3aed', width: '65%' },
              { stage: '4. Interview Rounds', count: pipeline.interview, color: '#ea580c', width: '45%' },
              { stage: '5. Hired & Accepted', count: pipeline.hired, color: '#16a34a', width: '25%' },
            ].map((st, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: st.width,
                    backgroundColor: st.color,
                    opacity: 0.1,
                    zIndex: 0
                  }}
                />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', zIndex: 1, color: 'var(--text-main)' }}>
                  {st.stage}
                </span>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', zIndex: 1, color: st.color }}>
                  {st.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Skills in High Demand */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Top Technical Skills in Demand</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Most requested skills across active job positions
              </p>
            </div>
            <Award size={18} color="#059669" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
            {skillsInDemand.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.85rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {s.skill}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  Required in <strong>{s.count}</strong> jobs
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Candidate Status Breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Candidates by Status</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Current distribution of active applicant states
              </p>
            </div>
            <PieChart size={18} color="#f59e0b" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
            {[
              { label: 'Screening', count: pipeline.screening, color: '#0284c7' },
              { label: 'Shortlisted', count: pipeline.shortlisted, color: '#7c3aed' },
              { label: 'Interview', count: pipeline.interview, color: '#ea580c' },
              { label: 'Hired', count: pipeline.hired, color: '#16a34a' },
              { label: 'Rejected', count: pipeline.rejected, color: '#dc2626' },
            ].map((item, idx) => {
              const total = pipeline.applied || 1;
              const pct = Math.round((item.count / total) * 100);

              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: item.color, borderRadius: '5px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
