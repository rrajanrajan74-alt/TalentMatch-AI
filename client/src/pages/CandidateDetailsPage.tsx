import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CandidateWithMatch } from '../types/index';
import ScoreBadge from '../components/common/ScoreBadge';
import StatusBadge from '../components/common/StatusBadge';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  Download,
  Award,
  Sparkles,
  UserCheck,
  UserX,
  Clock,
  FileText
} from 'lucide-react';

export const CandidateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState<CandidateWithMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchCandidate = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.getCandidateById(id);
      setCandidate(res.candidate);
    } catch (err: any) {
      setError(err.message || 'Candidate not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    if (!candidate) return;
    try {
      await api.updateCandidateStatus(candidate.id, status, candidate.application_id);
      setCandidate({ ...candidate, application_status: status as any });
      setActionSuccess(`Status updated to "${status}"`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDownloadResume = () => {
    if (!candidate) return;
    const content = `TALENTMATCH AI - CANDIDATE RESUME PROFILE
===============================================
Name: ${candidate.name}
Email: ${candidate.email}
Phone: ${candidate.phone}
Location: ${candidate.location}
Role Target: ${candidate.job_title}
Experience: ${candidate.experience_years} Years
Education: ${candidate.education}

SUMMARY:
${candidate.summary}

SKILLS:
${(candidate.skills || candidate.matched_skills || []).join(', ')}

MATCH ANALYSIS WITH JOB (${candidate.job_title}):
- Overall Match Score: ${candidate.match_score}%
- Skill Score: ${candidate.skill_score}%
- Experience Score: ${candidate.experience_score}%
- Education Score: ${candidate.education_score}%

Matched Skills:
${(candidate.matched_skills || []).map(s => `[✓] ${s}`).join('\n')}

Missing Required Skills:
${(candidate.missing_skills || []).map(s => `[✗] ${s}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.name.replace(/\s+/g, '_')}_Screening_Profile.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading Candidate Profile...</p>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="page-wrapper">
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: '1rem' }}>{error || 'Candidate not found'}</p>
          <button onClick={() => navigate('/candidates')} className="btn btn-primary">
            <ArrowLeft size={16} /> Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in" style={{ maxWidth: '1100px' }}>
      {/* Top Navigation & Feedback */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={() => navigate('/candidates')} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Candidates
        </button>

        {actionSuccess && (
          <div
            style={{
              padding: '0.4rem 0.9rem',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 'var(--radius-md)',
              color: '#065f46',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{actionSuccess}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleDownloadResume} className="btn btn-secondary btn-sm">
            <Download size={14} /> Download Resume
          </button>
          <button
            onClick={() => handleUpdateStatus('Shortlisted')}
            className={`btn btn-sm ${candidate.application_status === 'Shortlisted' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <UserCheck size={14} /> Shortlist
          </button>
          <button
            onClick={() => handleUpdateStatus('Interview')}
            className={`btn btn-sm ${candidate.application_status === 'Interview' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Clock size={14} /> Move to Interview
          </button>
          <button
            onClick={() => handleUpdateStatus('Rejected')}
            className="btn btn-danger btn-sm"
          >
            <UserX size={14} /> Reject
          </button>
        </div>
      </div>

      {/* Main Candidate Card */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '16px',
                background: 'var(--primary-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 800,
                boxShadow: '0 8px 16px rgba(67, 56, 202, 0.25)'
              }}
            >
              {candidate.name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{candidate.name}</h1>
                <StatusBadge status={candidate.application_status} />
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
                {candidate.current_title} • Applied for <span style={{ color: 'var(--primary)' }}>{candidate.job_title}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} /> {candidate.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={14} /> {candidate.phone || 'N/A'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} /> {candidate.location}
                </span>
              </div>
            </div>
          </div>

          <div>
            <ScoreBadge score={candidate.match_score} size="lg" />
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Profile & Experience) vs Right Column (Match Analysis) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Background & Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Resume Summary */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--primary)" />
              <span>Resume Summary</span>
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
              {candidate.summary || 'Candidate resume uploaded. Proven experience with relevant technical competencies.'}
            </p>
          </div>

          {/* Experience & Education */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Experience & Qualifications
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.5rem', background: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
                  <Briefcase size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Experience Level</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {candidate.experience_years} Years of hands-on professional experience
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.5rem', background: '#f5f3ff', borderRadius: '8px', color: '#7c3aed' }}>
                  <GraduationCap size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Education</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {candidate.education}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Extracted Skills */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              Extracted Technical Skills ({((candidate.skills || candidate.matched_skills || []).length)})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {(candidate.skills || candidate.matched_skills || []).map((skill, idx) => (
                <span key={idx} className="tag tag-success" style={{ fontWeight: 600 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Match Analysis & Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Transparent Score Breakdown Card */}
          <div className="card" style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}>
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} color="var(--primary)" />
                  <span>Resume-Job Match Analysis</span>
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Transparent multi-factor resume evaluation
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {candidate.match_score}%
                </span>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>OVERALL MATCH</div>
              </div>
            </div>

            {/* Formula Breakdown Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
              {/* Skill Match (60%) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span>Skills Match (60% Weight)</span>
                  <span style={{ color: '#059669' }}>{candidate.skill_score}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${candidate.skill_score}%`, backgroundColor: '#10b981', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Experience Match (25%) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span>Experience Match (25% Weight)</span>
                  <span style={{ color: '#2563eb' }}>{candidate.experience_score}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${candidate.experience_score}%`, backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Education Match (15%) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span>Education Match (15% Weight)</span>
                  <span style={{ color: '#7c3aed' }}>{candidate.education_score}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${candidate.education_score}%`, backgroundColor: '#8b5cf6', borderRadius: '4px' }} />
                </div>
              </div>
            </div>

            {/* Matched Skills with Checkmarks */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} />
                <span>Matched Required Skills ({(candidate.matched_skills || []).length})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(candidate.matched_skills || []).length > 0 ? (
                  candidate.matched_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="tag tag-success"
                      style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <CheckCircle2 size={12} />
                      <span>{skill}</span>
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No direct required skills matched</span>
                )}
              </div>
            </div>

            {/* Missing Skills with Red Crosses */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <XCircle size={16} />
                <span>Missing Required Skills ({(candidate.missing_skills || []).length})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(candidate.missing_skills || []).length > 0 ? (
                  candidate.missing_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="tag tag-danger"
                      style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <XCircle size={12} />
                      <span>{skill}</span>
                    </span>
                  ))
                ) : (
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: '#059669',
                      fontWeight: 600,
                      backgroundColor: '#ecfdf5',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px'
                    }}
                  >
                    ✓ All required skills matched!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              Recruiter Decision
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Update applicant stage in the recruitment funnel. This will recalculate hiring pipeline analytics.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                onClick={() => handleUpdateStatus('Shortlisted')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'center' }}
              >
                Shortlist
              </button>
              <button
                onClick={() => handleUpdateStatus('Interview')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'center' }}
              >
                Schedule Interview
              </button>
              <button
                onClick={() => handleUpdateStatus('Hired')}
                className="btn btn-success btn-sm"
                style={{ justifyContent: 'center' }}
              >
                Mark as Hired
              </button>
              <button
                onClick={() => handleUpdateStatus('Rejected')}
                className="btn btn-danger btn-sm"
                style={{ justifyContent: 'center' }}
              >
                Reject Applicant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsPage;
