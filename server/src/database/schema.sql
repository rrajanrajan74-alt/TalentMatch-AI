-- TalentMatch AI Database Schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'recruiter',
    company VARCHAR(255) DEFAULT 'TalentMatch AI Demo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    employment_type VARCHAR(50) DEFAULT 'Full-time',
    experience_required VARCHAR(50) NOT NULL,
    salary_range VARCHAR(100),
    description TEXT NOT NULL,
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    preferred_skills TEXT[] DEFAULT '{}',
    education VARCHAR(100) DEFAULT 'Bachelor''s Degree',
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(100),
    current_title VARCHAR(255),
    experience_years NUMERIC(4,1) DEFAULT 0,
    education VARCHAR(255),
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resumes (
    id VARCHAR(36) PRIMARY KEY,
    candidate_id VARCHAR(36) REFERENCES candidates(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    raw_text TEXT,
    parsed_skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS candidate_skills (
    candidate_id VARCHAR(36) REFERENCES candidates(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    years_experience NUMERIC(4,1) DEFAULT 1.0,
    confidence_score NUMERIC(5,2) DEFAULT 90.0,
    PRIMARY KEY (candidate_id, skill_name)
);

CREATE TABLE IF NOT EXISTS job_skills (
    job_id VARCHAR(36) REFERENCES jobs(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    is_required BOOLEAN DEFAULT true,
    PRIMARY KEY (job_id, skill_name)
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(36) PRIMARY KEY,
    candidate_id VARCHAR(36) REFERENCES candidates(id) ON DELETE CASCADE,
    job_id VARCHAR(36) REFERENCES jobs(id) ON DELETE CASCADE,
    resume_id VARCHAR(36) REFERENCES resumes(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Screening',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS match_results (
    id VARCHAR(36) PRIMARY KEY,
    application_id VARCHAR(36) REFERENCES applications(id) ON DELETE CASCADE,
    job_id VARCHAR(36) REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id VARCHAR(36) REFERENCES candidates(id) ON DELETE CASCADE,
    overall_score NUMERIC(5,2) NOT NULL,
    skill_score NUMERIC(5,2) NOT NULL,
    experience_score NUMERIC(5,2) NOT NULL,
    education_score NUMERIC(5,2) NOT NULL,
    matched_skills TEXT[] DEFAULT '{}',
    missing_skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id VARCHAR(36) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_match_job_score ON match_results(job_id, overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_name ON candidate_skills(skill_name);
