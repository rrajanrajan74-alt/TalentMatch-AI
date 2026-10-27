import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { CandidateWithMatch, Job } from '../types/index';
import ScoreBadge from '../components/common/ScoreBadge';
import StatusBadge from '../components/common/StatusBadge';
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  UserCheck
} from 'lucide-react';

export const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [candidates, setCandidates] = useState<CandidateWithMatch[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state from URL or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [jobId, setJobId] = useState(searchParams.get('jobId') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [minScore, setMinScore] = useState<string>(searchParams.get('minScore') || '0');
  const [sortBy, setSortBy] = useState<'score' | 'experience' | 'name' | 'date'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await api.getCandidates({
        search,
        jobId,
        status,
        minScore: minScore ? Number(minScore) : undefined,
        sortBy,
        sortOrder,
        page,
        limit: 8
      });
      setCandidates(res.candidates);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.getJobs();
      setJobs(res.jobs);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [page, jobId, status, minScore, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCandidates();
  };

  const handleUpdateStatus = async (cand: CandidateWithMatch, newStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.updateCandidateStatus(cand.id, newStatus, cand.application_id);
      setCandidates(candidates.map(c => c.id === cand.id ? { ...c, application_status: newStatus as any } : c));
    } catch (err: any) {
      alert(err.message || 'Failed to update candidate status');
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Candidate Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Browse, filter, and review applicants screened across active job positions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchCandidates} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => navigate('/resumes/upload')} className="btn btn-primary btn-sm">
            <UploadCloud size={16} /> Upload Resume
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search candidate name, email, or skill..."
              className="form-input"
              style={{ paddingLeft: '2.3rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* Job Filter */}
          <div style={{ minWidth: '180px' }}>
            <select
              className="form-select"
              value={jobId}
              onChange={(e) => { setJobId(e.target.value); setPage(1); }}
            >
              <option value="all">All Jobs</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '150px' }}>
            <select
              className="form-select"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="all">All Statuses</option>
              <option value="Screening">Screening</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Match Score Filter */}
          <div style={{ minWidth: '170px' }}>
            <select
              className="form-select"
              value={minScore}
              onChange={(e) => { setMinScore(e.target.value); setPage(1); }}
            >
              <option value="0">All Match Scores</option>
              <option value="80">≥ 80% (Excellent)</option>
              <option value="60">≥ 60% (Strong+)</option>
              <option value="40">≥ 40% (Moderate+)</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ minWidth: '170px' }}>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="score">Sort by Match Score</option>
              <option value="experience">Sort by Experience</option>
              <option value="name">Sort by Candidate Name</option>
              <option value="date">Sort by Applied Date</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn btn-secondary btn-sm"
            title="Toggle sort direction"
            style={{ height: '38px', padding: '0 0.8rem' }}
          >
            <ArrowUpDown size={14} />
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Candidate Name</th>
                <th>Applied Job</th>
                <th>Match Score</th>
                <th>Experience</th>
                <th>Top Skills</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading candidate records...
                  </td>
                </tr>
              ) : candidates.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                    <Users size={36} color="#cbd5e1" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                    <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>No matching candidates found</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Try adjusting the filter criteria or upload a new resume.
                    </p>
                    <button onClick={() => navigate('/resumes/upload')} className="btn btn-primary btn-sm">
                      <UploadCloud size={14} /> Upload Resume
                    </button>
                  </td>
                </tr>
              ) : (
                candidates.map((cand) => (
                  <tr
                    key={cand.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/candidates/${cand.id}`)}
                  >
                    <td>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: cand.rank === 1 ? '#eab308' : cand.rank === 2 ? '#94a3b8' : cand.rank === 3 ? '#b45309' : 'var(--text-muted)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: cand.rank && cand.rank <= 3 ? '#f8fafc' : 'transparent',
                          border: cand.rank && cand.rank <= 3 ? '1px solid #e2e8f0' : 'none'
                        }}
                      >
                        #{cand.rank}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{cand.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cand.email}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>
                        {cand.job_title}
                      </span>
                    </td>
                    <td>
                      <ScoreBadge score={cand.match_score} />
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {cand.experience_years} Years
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {(cand.skills || cand.matched_skills || []).slice(0, 3).map((skill, i) => (
                          <span key={i} className="tag" style={{ fontSize: '0.7rem' }}>
                            {skill}
                          </span>
                        ))}
                        {(cand.skills || []).length > 3 && (
                          <span className="tag" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            +{(cand.skills || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={cand.application_status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/candidates/${cand.id}`)}
                          className="btn btn-outline btn-sm"
                          title="View Profile & Full Breakdown"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                        {cand.application_status !== 'Shortlisted' && (
                          <button
                            onClick={(e) => handleUpdateStatus(cand, 'Shortlisted', e)}
                            className="btn btn-success btn-sm"
                            title="Shortlist Candidate"
                          >
                            <CheckCircle2 size={13} />
                          </button>
                        )}
                        {cand.application_status !== 'Rejected' && (
                          <button
                            onClick={(e) => handleUpdateStatus(cand, 'Rejected', e)}
                            className="btn btn-danger btn-sm"
                            title="Reject Candidate"
                          >
                            <XCircle size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: '#fafbfc'
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total candidates)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="btn btn-secondary btn-sm"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;
