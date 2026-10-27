export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  company: string;
  created_at?: string;
  updated_at?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience_required: string;
  salary_range: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  education: string;
  status: 'Active' | 'Closed' | 'Draft';
  applications_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  current_title: string;
  experience_years: number;
  education: string;
  summary: string;
  skills?: string[];
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  candidate_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  raw_text: string;
  parsed_skills: string[];
  created_at: string;
}

export interface Application {
  id: string;
  candidate_id: string;
  job_id: string;
  resume_id?: string;
  status: 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'Hired' | 'Rejected';
  created_at: string;
  updated_at: string;
}

export interface MatchResult {
  id: string;
  application_id: string;
  job_id: string;
  candidate_id: string;
  overall_score: number;
  skill_score: number;
  experience_score: number;
  education_score: number;
  matched_skills: string[];
  missing_skills: string[];
  created_at: string;
}

export interface CandidateWithMatch extends Candidate {
  application_id: string;
  job_id: string;
  job_title: string;
  application_status: Application['status'];
  match_score: number;
  skill_score: number;
  experience_score: number;
  education_score: number;
  matched_skills: string[];
  missing_skills: string[];
  applied_at: string;
  rank?: number;
}

export interface DashboardAnalytics {
  kpis: {
    totalCandidates: number;
    activeJobs: number;
    totalApplications: number;
    shortlistedCandidates: number;
    averageMatchScore: number;
    interviewsPending: number;
  };
  pipeline: {
    applied: number;
    screening: number;
    shortlisted: number;
    interview: number;
    hired: number;
    rejected: number;
  };
  scoreDistribution: {
    bracket: string;
    count: number;
    percentage: number;
  }[];
  recentApplications: Array<{
    id: string;
    candidate_id: string;
    candidate_name: string;
    email: string;
    job_id: string;
    job_title: string;
    match_score: number;
    status: string;
    applied_date: string;
  }>;
  skillsInDemand: Array<{
    skill: string;
    count: number;
  }>;
}
