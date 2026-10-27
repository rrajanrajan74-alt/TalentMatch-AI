import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Job } from '../types/index';
import ScoreBadge from '../components/common/ScoreBadge';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Phone,
  Briefcase,
  Check,
  RefreshCw
} from 'lucide-react';

const PROCESSING_STEPS = [
  'Uploading resume file...',
  'Extracting resume text...',
  'Analyzing & extracting technical skills...',
  'Comparing qualifications with job requirements...',
  'Calculating weighted match score...',
  'Completed!'
];

export const ResumeUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(searchParams.get('jobId') || '');
  const [file, setFile] = useState<File | null>(null);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [location, setLocation] = useState('Remote');

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await api.getJobs();
        setJobs(res.jobs);
        if (!selectedJobId && res.jobs.length > 0) {
          setSelectedJobId(res.jobs[0].id);
        }
      } catch {
        // ignore
      }
    }
    loadJobs();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const validateAndSetFile = (f: File) => {
    const validExts = ['.pdf', '.docx', '.doc', '.txt'];
    const lower = f.name.toLowerCase();
    const isValid = validExts.some(ext => lower.endsWith(ext));

    if (!isValid) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
    setError(null);
    setFile(f);

    // Auto-fill candidate name if empty from file name
    if (!candidateName) {
      const cleanName = f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setCandidateName(cleanName);
    }
  };

  // Sample Resume Creator for 1-click test
  const handleUseSampleResume = (role: 'fullstack' | 'frontend' | 'ai') => {
    let content = '';
    let name = '';
    let email = '';
    let phone = '+1 (555) 345-6789';

    if (role === 'fullstack') {
      name = 'Aditya Verma';
      email = 'aditya.verma@example.com';
      content = `ADITYA VERMA
Senior Software Engineer - San Francisco, CA
aditya.verma@example.com | +1 555-345-6789

SUMMARY:
Results-driven Full Stack Developer with 4.5+ years of experience engineering scalable web applications with React, TypeScript, Node.js, Express.js, and PostgreSQL. Proficient in Redis caching, Docker containerization, REST API design, and Git.

EXPERIENCE:
Staff Software Engineer - CloudScale Systems (2021 - Present)
- Engineered React frontend SPAs utilizing TypeScript and responsive CSS.
- Developed backend microservices using Node.js, Express.js, and PostgreSQL databases.
- Integrated Redis for low-latency session and data caching.
- Containerized development and production pipelines with Docker and GitHub Actions.

EDUCATION:
Bachelor of Technology in Computer Science - 2020

TECHNICAL SKILLS:
React, TypeScript, JavaScript, Node.js, Express.js, PostgreSQL, Redis, Docker, REST API, Git, GitHub, HTML, CSS`;
    } else if (role === 'frontend') {
      name = 'Chloe Bennett';
      email = 'chloe.bennett@example.com';
      content = `CHLOE BENNETT
Senior UI Engineer - Austin, TX
chloe.bennett@example.com

SUMMARY:
Creative frontend specialist with 5 years experience crafting web applications with React, TypeScript, Next.js, Redux, and TailwindCSS.

TECHNICAL SKILLS:
React, TypeScript, Next.js, Redux, TailwindCSS, HTML, CSS, JavaScript, Vite, GraphQL`;
    } else {
      name = 'Vikram Malhotra';
      email = 'vikram.m@example.com';
      content = `VIKRAM MALHOTRA
Machine Learning Engineer - Boston, MA
vikram.m@example.com

SUMMARY:
Machine Learning specialist with 3.5 years experience in Python, PyTorch, TensorFlow, NLP, and SQL database pipelines. Master of Science in Data Science.

TECHNICAL SKILLS:
Python, Machine Learning, Deep Learning, PyTorch, TensorFlow, SQL, Data Analysis, NLP, Docker, AWS`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const sampleFile = new File([blob], `${name.replace(/\s+/g, '_')}_Resume.txt`, { type: 'text/plain' });
    setFile(sampleFile);
    setCandidateName(name);
    setCandidateEmail(email);
    setCandidatePhone(phone);
    setError(null);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a resume file to upload.');
      return;
    }
    if (!selectedJobId) {
      setError('Please select a target job opening.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStepIndex(0);

    // Animate stepped progress
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PROCESSING_STEPS.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('name', candidateName);
      formData.append('email', candidateEmail);
      formData.append('phone', candidatePhone);
      formData.append('location', location);
      formData.append('jobId', selectedJobId);

      const res = await api.uploadResume(formData);

      clearInterval(stepInterval);
      setCurrentStepIndex(PROCESSING_STEPS.length - 1); // Completed
      setResult(res);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      setError(err.message || 'Failed to process resume.');
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ maxWidth: '900px' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Resume Screening & Upload</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Upload PDF or DOCX candidate resumes for instant NLP skill extraction and transparent job match scoring.
        </p>
      </div>

      {/* Quick Test Demo Presets */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#eff6ff',
          borderColor: '#bfdbfe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#2563eb" />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e40af' }}>
            Instant Test Candidates (No file needed):
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleUseSampleResume('fullstack')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            Aditya Verma (Full Stack)
          </button>
          <button
            type="button"
            onClick={() => handleUseSampleResume('frontend')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            Chloe Bennett (Frontend)
          </button>
          <button
            type="button"
            onClick={() => handleUseSampleResume('ai')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            Vikram Malhotra (AI/ML)
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.875rem'
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stepped Processing Modal / Overlay */}
      {isProcessing && (
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            AI Resume Analysis in Progress
          </h3>

          <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left' }}>
            {PROCESSING_STEPS.map((step, idx) => {
              const isDone = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.7rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isCurrent ? '#f5f3ff' : isDone ? '#f0fdf4' : '#f8fafc',
                    border: isCurrent ? '1px solid #c7d2fe' : isDone ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isDone ? '#10b981' : isCurrent ? '#6366f1' : '#cbd5e1',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {isDone ? <Check size={14} /> : isCurrent ? '•' : idx + 1}
                  </div>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: isCurrent ? 700 : isDone ? 600 : 500,
                      color: isCurrent ? '#312e81' : isDone ? '#065f46' : '#94a3b8'
                    }}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {currentStepIndex === PROCESSING_STEPS.length - 1 && result && (
            <div
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={24} />
                <span>Screening Complete!</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#065f46', marginBottom: '1.25rem' }}>
                Candidate <strong>{result.candidate?.name}</strong> successfully matched with <strong>{result.job?.title}</strong>.
              </p>

              {result.matchResult && (
                <div style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
                  <ScoreBadge score={result.matchResult.overall_score} size="lg" />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsProcessing(false);
                    setResult(null);
                    setFile(null);
                    setCandidateName('');
                    setCandidateEmail('');
                  }}
                  className="btn btn-secondary"
                >
                  Upload Another
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/candidates/${result.candidate?.id}`)}
                  className="btn btn-primary"
                >
                  View Full Candidate Profile <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Form */}
      {!isProcessing && (
        <form onSubmit={handleUploadSubmit} className="card" style={{ padding: '2rem' }}>
          {/* Target Job Selector */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Select Job Position to Match Against *</label>
            <select
              className="form-select"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              required
            >
              <option value="">-- Choose Job Opening --</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.department}) • Required: {j.required_skills.slice(0, 3).join(', ')}...
                </option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: isDragging ? '2px dashed var(--primary)' : '2px dashed #cbd5e1',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: isDragging ? '#eef2ff' : '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '1.75rem'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  validateAndSetFile(e.target.files[0]);
                }
              }}
              accept=".pdf,.docx,.doc,.txt"
              style={{ display: 'none' }}
            />

            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: isDragging ? '#e0e7ff' : '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'var(--primary)'
              }}
            >
              <UploadCloud size={28} />
            </div>

            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              {file ? file.name : 'Drag and drop candidate resume here'}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Supports PDF, DOCX, and TXT files up to 10MB
            </p>

            {file && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginTop: '0.85rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#ecfdf5',
                  color: '#047857',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <CheckCircle2 size={14} />
                <span>File attached: {(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </div>

          {/* Candidate Profile Details (Auto-extracted or filled) */}
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Candidate Information (Optional or Auto-Extracted)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Candidate Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.3rem' }}
                  placeholder="Extracted from resume or enter manually"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Candidate Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.3rem' }}
                  placeholder="candidate@example.com"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.3rem' }}
                  placeholder="+1 (555) 000-0000"
                  value={candidatePhone}
                  onChange={(e) => setCandidatePhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. San Francisco, CA or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => navigate('/candidates')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!file || !selectedJobId}
            >
              <UploadCloud size={16} />
              <span>Upload & Analyze Match</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResumeUploadPage;
