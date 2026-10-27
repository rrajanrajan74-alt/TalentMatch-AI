import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Job } from '../types/index';
import {
  Briefcase,
  PlusCircle,
  Search,
  Filter,
  Users,
  Eye,
  Trash2,
  Edit3,
  Calendar,
  MapPin,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.getJobs();
      setJobs(res.jobs);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this job opening? This will also remove associated rankings.')) {
      try {
        await api.deleteJob(id);
        setJobs(jobs.filter(j => j.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete job');
      }
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase()) ||
      job.required_skills.some(s => s.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = departmentFilter === 'all' || job.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const departments = Array.from(new Set(jobs.map(j => j.department)));

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Job Openings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Manage active job positions, required skills, and candidate screening criteria.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchJobs} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => navigate('/jobs/create')} className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Create Job Position
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
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
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by job title, department, or required skill..."
              className="form-input"
              style={{ paddingLeft: '2.3rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '200px' }}>
            <select
              className="form-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredJobs.length}</strong> of {jobs.length} jobs
        </div>
      </div>

      {/* Jobs Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Required Skills</th>
                <th style={{ textAlign: 'center' }}>Applications</th>
                <th>Status</th>
                <th>Created Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading job listings...
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                    <Briefcase size={36} color="#cbd5e1" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                    <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>No matching job openings found</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Try adjusting your search criteria or create a new job position.
                    </p>
                    <button onClick={() => navigate('/jobs/create')} className="btn btn-primary btn-sm">
                      <PlusCircle size={14} /> Create Job
                    </button>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedJobForModal(job)}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                          {job.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          <MapPin size={12} />
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.employment_type}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="tag" style={{ background: '#f8fafc', fontWeight: 600 }}>
                        {job.department}
                      </span>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {job.required_skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="tag tag-success" style={{ fontSize: '0.7rem' }}>
                            {skill}
                          </span>
                        ))}
                        {job.required_skills.length > 3 && (
                          <span className="tag" style={{ fontSize: '0.7rem' }}>
                            +{job.required_skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: '#f1f5f9'
                        }}
                      >
                        <Users size={13} color="var(--primary)" />
                        <span>{job.applications_count || 0}</span>
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: job.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                          color: job.status === 'Active' ? '#059669' : '#64748b',
                          border: job.status === 'Active' ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
                        }}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/rankings?jobId=${job.id}`)}
                          className="btn btn-outline btn-sm"
                          title="View Ranked Candidates"
                        >
                          <Users size={14} />
                          <span>Rankings</span>
                        </button>
                        <button
                          onClick={() => setSelectedJobForModal(job)}
                          className="btn btn-secondary btn-sm"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteJob(job.id, e)}
                          className="btn btn-danger btn-sm"
                          title="Delete Job"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJobForModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
            backdropFilter: 'blur(3px)'
          }}
          onClick={() => setSelectedJobForModal(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="tag" style={{ marginBottom: '0.4rem' }}>{selectedJobForModal.department}</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedJobForModal.title}</h2>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  <span>{selectedJobForModal.location}</span>
                  <span>•</span>
                  <span>{selectedJobForModal.employment_type}</span>
                  <span>•</span>
                  <span>{selectedJobForModal.salary_range}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobForModal(null)}
                style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Job Description
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                {selectedJobForModal.description}
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Required Skills (60% Weight in Scoring)
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedJobForModal.required_skills.map((s, idx) => (
                  <span key={idx} className="tag tag-success" style={{ fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>

            {selectedJobForModal.preferred_skills && selectedJobForModal.preferred_skills.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Preferred Skills (Bonus Weight)
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedJobForModal.preferred_skills.map((s, idx) => (
                    <span key={idx} className="tag" style={{ fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Experience Required</span>
                <strong>{selectedJobForModal.experience_required}</strong>
              </div>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Required Education</span>
                <strong>{selectedJobForModal.education}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setSelectedJobForModal(null);
                  navigate(`/resumes/upload?jobId=${selectedJobForModal.id}`);
                }}
                className="btn btn-secondary"
              >
                Upload Resume For This Job
              </button>
              <button
                onClick={() => {
                  setSelectedJobForModal(null);
                  navigate(`/rankings?jobId=${selectedJobForModal.id}`);
                }}
                className="btn btn-primary"
              >
                View Ranked Applicants
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
