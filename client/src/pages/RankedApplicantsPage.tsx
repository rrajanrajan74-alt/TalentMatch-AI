import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Job, CandidateWithMatch } from '../types/index';
import ScoreBadge from '../components/common/ScoreBadge';
import StatusBadge from '../components/common/StatusBadge';
import {
  Award,
  Zap,
  Briefcase,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trophy,
  ArrowUpDown,
  UploadCloud
} from 'lucide-react';

export const RankedApplicantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(searchParams.get('jobId') || '');
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [rankings, setRankings] = useState<CandidateWithMatch[]>([]);
  const [source, setSource] = useState<string>('database');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load all jobs first
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await api.getJobs();
        setJobs(res.jobs);
        const initialJobId = searchParams.get('jobId') || (res.jobs.length > 0 ? res.jobs[0].id : '');
        setSelectedJobId(initialJobId);
      } catch (err) {
        console.error('Failed to load jobs:', err);
      }
    }
    loadJobs();
  }, []);

  // Fetch rankings whenever selectedJobId changes
  const fetchRankings = async (jobId: string) => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await api.getJobRankings(jobId);
      setRankings(res.rankings);
      setCurrentJob(res.job);
      if (res.source) setSource(res.source);
    } catch (err) {
      console.error('Failed to load rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      setSearchParams({ jobId: selectedJobId });
      fetchRankings(selectedJobId);
    }
  }, [selectedJobId]);

  // Filter rankings by search & status
  const filteredRankings = rankings.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(search.toLowerCase()) ||
      cand.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cand.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={24} color="#eab308" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Ranked Applicants</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Dynamic candidate leaderboard ranked automatically by multi-factor resume match score.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Redis Cache Status Pill */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: source === 'redis_cache' ? '#eff6ff' : '#f8fafc',
              color: source === 'redis_cache' ? '#1d4ed8' : '#64748b',
              border: source === 'redis_cache' ? '1px solid #bfdbfe' : '1px solid #e2e8f0'
            }}
            title="Redis in-memory caching response"
          >
            <Zap size={13} color={source === 'redis_cache' ? '#2563eb' : '#94a3b8'} />
            <span>{source === 'redis_cache' ? 'Cached via Redis' : 'Calculated from DB'}</span>
          </span>

          <button onClick={() => fetchRankings(selectedJobId)} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh
          </button>

          <button onClick={() => navigate(`/resumes/upload?jobId=${selectedJobId}`)} className="btn btn-primary btn-sm">
            <UploadCloud size={14} /> Add Candidate to Job
          </button>
        </div>
      </div>

      {/* Job Selector Card */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#fafbfc'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <Briefcase size={20} color="var(--primary)" />
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
              SELECT JOB OPENING FOR LEADERBOARD:
            </label>
            <select
              className="form-select"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              style={{ fontWeight: 600, fontSize: '0.95rem', backgroundColor: '#ffffff' }}
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.department}) — {j.applications_count || 0} Applicants
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentJob && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxWidth: '420px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Required:</span>
            {currentJob.required_skills?.map((s, idx) => (
              <span key={idx} className="tag tag-success" style={{ fontSize: '0.7rem' }}>{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* Filter and Search within Rankings */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search ranked candidate by name or email..."
              className="form-input"
              style={{ paddingLeft: '2.3rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Screening">Screening</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredRankings.length}</strong> ranked candidates
        </div>
      </div>

      {/* Rankings Leaderboard Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>Rank</th>
                <th>Candidate</th>
                <th>Match Score</th>
                <th>Matched Skills</th>
                <th>Missing Skills</th>
                <th>Experience</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Calculating candidate rankings...
                  </td>
                </tr>
              ) : filteredRankings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem' }}>
                    <Award size={36} color="#cbd5e1" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                    <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>No candidates applied to this job yet</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Upload candidate resumes to rank them against this role.
                    </p>
                    <button
                      onClick={() => navigate(`/resumes/upload?jobId=${selectedJobId}`)}
                      className="btn btn-primary btn-sm"
                    >
                      <UploadCloud size={14} /> Upload Resume
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRankings.map((c) => {
                  const isTop1 = c.rank === 1;
                  const isTop2 = c.rank === 2;
                  const isTop3 = c.rank === 3;

                  return (
                    <tr
                      key={c.candidate_id || c.id}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isTop1 ? '#fffdf5' : 'inherit'
                      }}
                      onClick={() => navigate(`/candidates/${c.candidate_id || c.id}`)}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            backgroundColor: isTop1 ? '#fef08a' : isTop2 ? '#e2e8f0' : isTop3 ? '#fed7aa' : '#f1f5f9',
                            color: isTop1 ? '#854d0e' : isTop2 ? '#475569' : isTop3 ? '#9a3412' : '#64748b',
                            border: isTop1 ? '1px solid #facc15' : isTop2 ? '1px solid #cbd5e1' : isTop3 ? '1px solid #fdba74' : 'none'
                          }}
                        >
                          #{c.rank}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {c.email}
                          </div>
                        </div>
                      </td>
                      <td>
                        <ScoreBadge score={c.match_score} />
                      </td>
                      <td style={{ maxWidth: '220px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {(c.matched_skills || []).slice(0, 3).map((s, idx) => (
                            <span key={idx} className="tag tag-success" style={{ fontSize: '0.7rem' }}>
                              ✓ {s}
                            </span>
                          ))}
                          {(c.matched_skills || []).length > 3 && (
                            <span className="tag" style={{ fontSize: '0.7rem' }}>
                              +{(c.matched_skills || []).length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {(c.missing_skills || []).length > 0 ? (
                            c.missing_skills.slice(0, 2).map((s, idx) => (
                              <span key={idx} className="tag tag-danger" style={{ fontSize: '0.7rem' }}>
                                ✗ {s}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                              None (Full Match)
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {c.experience_years} Years
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={c.status || c.application_status || 'Screening'} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => navigate(`/candidates/${c.candidate_id || c.id}`)}
                          className="btn btn-outline btn-sm"
                        >
                          <Eye size={13} />
                          <span>Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RankedApplicantsPage;
