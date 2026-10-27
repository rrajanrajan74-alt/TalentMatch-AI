import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, ArrowLeft, Plus, X, Sparkles, Check } from 'lucide-react';

const COMMON_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'Python', 'SQL', 'REST API', 'GraphQL',
  'Next.js', 'TailwindCSS', 'Redux', 'Machine Learning', 'PyTorch', 'Git', 'GitHub'
];

export const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    employment_type: 'Full-time',
    experience_required: '3+ years',
    salary_range: '$120,000 - $150,000',
    description: '',
    education: "Bachelor's Degree in Computer Science or related field",
  });

  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'PostgreSQL']);
  const [newReqSkill, setNewReqSkill] = useState('');

  const [preferredSkills, setPreferredSkills] = useState<string[]>(['Docker', 'Redis', 'GitHub']);
  const [newPrefSkill, setNewPrefSkill] = useState('');

  // 1-Click preset templates
  const loadPreset = (preset: string) => {
    if (preset === 'fullstack') {
      setFormData({
        title: 'Full Stack Developer',
        department: 'Engineering',
        location: 'San Francisco, CA (Hybrid)',
        employment_type: 'Full-time',
        experience_required: '3-5 years',
        salary_range: '$125,000 - $150,000',
        description: 'We are seeking a Full Stack Developer proficient in modern React, TypeScript, and Node.js backend architecture. You will be responsible for creating clean APIs with PostgreSQL and optimizing user journeys.',
        education: "Bachelor's Degree in Computer Science or related field",
      });
      setRequiredSkills(['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'REST API']);
      setPreferredSkills(['Docker', 'Redis', 'GitHub']);
    } else if (preset === 'ai') {
      setFormData({
        title: 'AI / Machine Learning Engineer',
        department: 'AI Research',
        location: 'Remote (US)',
        employment_type: 'Full-time',
        experience_required: '3+ years',
        salary_range: '$140,000 - $180,000',
        description: 'Join our AI team to build predictive and LLM-assisted systems. Experience in Python, PyTorch, SQL, data pipelines, and machine learning model evaluation is key.',
        education: "Master's Degree in AI, Computer Science, or Data Science",
      });
      setRequiredSkills(['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'SQL', 'Data Analysis']);
      setPreferredSkills(['Docker', 'AWS', 'NLP']);
    } else if (preset === 'cloud') {
      setFormData({
        title: 'Cloud Infrastructure & DevOps Engineer',
        department: 'Infrastructure',
        location: 'New York, NY',
        employment_type: 'Full-time',
        experience_required: '4+ years',
        salary_range: '$135,000 - $165,000',
        description: 'Design and manage Kubernetes clusters, AWS infrastructure, PostgreSQL database backups, and low-latency Redis caching layers.',
        education: "Bachelor's Degree in Engineering",
      });
      setRequiredSkills(['Docker', 'Kubernetes', 'AWS', 'Linux', 'PostgreSQL', 'Redis', 'CI/CD']);
      setPreferredSkills(['Terraform', 'Nginx', 'GitHub']);
    }
  };

  const handleAddReqSkill = () => {
    if (newReqSkill.trim() && !requiredSkills.includes(newReqSkill.trim())) {
      setRequiredSkills([...requiredSkills, newReqSkill.trim()]);
      setNewReqSkill('');
    }
  };

  const handleRemoveReqSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleAddPrefSkill = () => {
    if (newPrefSkill.trim() && !preferredSkills.includes(newPrefSkill.trim())) {
      setPreferredSkills([...preferredSkills, newPrefSkill.trim()]);
      setNewPrefSkill('');
    }
  };

  const handleRemovePrefSkill = (skill: string) => {
    setPreferredSkills(preferredSkills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requiredSkills.length === 0) {
      setError('Please add at least one required skill for resume matching.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.createJob({
        ...formData,
        required_skills: requiredSkills,
        preferred_skills: preferredSkills
      });
      navigate('/jobs');
    } catch (err: any) {
      setError(err.message || 'Failed to create job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/jobs')} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Jobs
        </button>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Create Job Opening</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Define role requirements, mandatory skills, and candidate evaluation criteria.
          </p>
        </div>
      </div>

      {/* Preset Fast Fill Bar */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#f5f3ff',
          borderColor: '#ddd6fe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#4f46e5" />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#312e81' }}>
            Quick Template Presets:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => loadPreset('fullstack')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            Full Stack Developer
          </button>
          <button
            type="button"
            onClick={() => loadPreset('ai')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            AI / ML Engineer
          </button>
          <button
            type="button"
            onClick={() => loadPreset('cloud')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            DevOps & Cloud
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '0.85rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}
        >
          {error}
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Job Title */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Full Stack Developer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Department */}
          <div className="form-group">
            <label className="form-label">Department *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Engineering, AI Research, Product"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. San Francisco, CA (Hybrid) or Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          {/* Employment Type */}
          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select
              className="form-select"
              value={formData.employment_type}
              onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
            >
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Experience Required */}
          <div className="form-group">
            <label className="form-label">Experience Required *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 3-5 years or 3+ years"
              value={formData.experience_required}
              onChange={(e) => setFormData({ ...formData, experience_required: e.target.value })}
              required
            />
          </div>

          {/* Salary Range */}
          <div className="form-group">
            <label className="form-label">Salary Range</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. $120,000 - $145,000"
              value={formData.salary_range}
              onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
            />
          </div>

          {/* Education */}
          <div className="form-group">
            <label className="form-label">Required Education</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Bachelor's Degree in Computer Science"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            />
          </div>
        </div>

        {/* Job Description */}
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label className="form-label">Job Description *</label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="Detailed description of responsibilities, requirements, and day-to-day workflow..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        {/* Required Skills (Weighted 60%) */}
        <div style={{ marginTop: '1.25rem', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ marginBottom: 0, fontWeight: 700, color: 'var(--text-main)' }}>
              Required Skills (60% Match Weight) *
            </label>
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
              Primary Matching Factor
            </span>
          </div>

          {/* Active Required Skills Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {requiredSkills.map((skill) => (
              <span key={skill} className="tag tag-success" style={{ fontWeight: 600, paddingRight: '0.3rem' }}>
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveReqSkill(skill)}
                  style={{ marginLeft: '0.35rem', color: '#065f46' }}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          {/* Add skill input */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ maxWidth: '280px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              placeholder="Type skill & press Add..."
              value={newReqSkill}
              onChange={(e) => setNewReqSkill(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddReqSkill(); } }}
            />
            <button type="button" onClick={handleAddReqSkill} className="btn btn-secondary btn-sm">
              <Plus size={14} /> Add Skill
            </button>
          </div>

          {/* Quick Suggestions */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Quick suggestions: {COMMON_SKILLS.slice(0, 10).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => {
                  if (!requiredSkills.includes(skill)) setRequiredSkills([...requiredSkills, skill]);
                }}
                style={{
                  marginRight: '0.4rem',
                  color: requiredSkills.includes(skill) ? '#059669' : 'var(--primary)',
                  fontWeight: 600,
                  textDecoration: requiredSkills.includes(skill) ? 'line-through' : 'underline'
                }}
              >
                +{skill}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Skills (Bonus) */}
        <div style={{ marginTop: '1.25rem', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ marginBottom: 0, fontWeight: 700, color: 'var(--text-main)' }}>
              Preferred / Nice-to-Have Skills
            </label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Bonus scoring up to 15%
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {preferredSkills.map((skill) => (
              <span key={skill} className="tag" style={{ fontWeight: 600, paddingRight: '0.3rem' }}>
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePrefSkill(skill)}
                  style={{ marginLeft: '0.35rem', color: 'var(--text-secondary)' }}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ maxWidth: '280px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              placeholder="e.g. Docker, Redis..."
              value={newPrefSkill}
              onChange={(e) => setNewPrefSkill(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPrefSkill(); } }}
            />
            <button type="button" onClick={handleAddPrefSkill} className="btn btn-secondary btn-sm">
              <Plus size={14} /> Add Preferred
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving Job Position...' : 'Create & Publish Job Opening'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPage;
