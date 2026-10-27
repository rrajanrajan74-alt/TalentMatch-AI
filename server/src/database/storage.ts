import { pool, checkDbConnection, isDbConnected } from './connection.js';
import { User, Job, Candidate, Resume, Application, MatchResult, CandidateWithMatch, DashboardAnalytics } from '../types/index.js';
import crypto from 'crypto';

class StorageRepository {
  // In-memory backing store for local development resiliency
  public users: Map<string, User> = new Map();
  public jobs: Map<string, Job> = new Map();
  public candidates: Map<string, Candidate> = new Map();
  public resumes: Map<string, Resume> = new Map();
  public applications: Map<string, Application> = new Map();
  public matchResults: Map<string, MatchResult> = new Map();

  constructor() {
    // Seed initial data immediately into memory store
    this.seedInMemory();
  }

  // USERS
  public async getUserByEmail(email: string): Promise<User | null> {
    if (isDbConnected()) {
      try {
        const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err: any) {
        console.warn('[Storage] DB query error, falling back to memory:', err.message);
      }
    }
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }

  public async getUserById(id: string): Promise<User | null> {
    if (isDbConnected()) {
      try {
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err: any) {
        console.warn('[Storage] DB query error, falling back to memory:', err.message);
      }
    }
    return this.users.get(id) || null;
  }

  public async createUser(user: Omit<User, 'id'>): Promise<User> {
    const id = crypto.randomUUID();
    const newUser: User = {
      id,
      ...user,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isDbConnected()) {
      try {
        await pool.query(
          `INSERT INTO users (id, name, email, password_hash, role, company)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [newUser.id, newUser.name, newUser.email, newUser.password_hash, newUser.role, newUser.company]
        );
      } catch (err: any) {
        console.warn('[Storage] DB insert error, stored in memory:', err.message);
      }
    }
    this.users.set(id, newUser);
    return newUser;
  }

  // JOBS
  public async getJobs(): Promise<Job[]> {
    if (isDbConnected()) {
      try {
        const res = await pool.query(`
          SELECT j.*, 
                 COUNT(a.id)::int as applications_count
          FROM jobs j
          LEFT JOIN applications a ON j.id = a.job_id
          GROUP BY j.id
          ORDER BY j.created_at DESC
        `);
        if (res.rows.length > 0) return res.rows;
      } catch (err: any) {
        console.warn('[Storage] DB getJobs error, fallback:', err.message);
      }
    }

    const list = Array.from(this.jobs.values()).map(job => {
      let count = 0;
      for (const app of this.applications.values()) {
        if (app.job_id === job.id) count++;
      }
      return { ...job, applications_count: count };
    });
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async getJobById(id: string): Promise<Job | null> {
    if (isDbConnected()) {
      try {
        const res = await pool.query(`
          SELECT j.*, 
                 COUNT(a.id)::int as applications_count
          FROM jobs j
          LEFT JOIN applications a ON j.id = a.job_id
          WHERE j.id = $1
          GROUP BY j.id
        `, [id]);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err: any) {
        console.warn('[Storage] DB getJobById error, fallback:', err.message);
      }
    }
    const job = this.jobs.get(id);
    if (!job) return null;
    let count = 0;
    for (const app of this.applications.values()) {
      if (app.job_id === job.id) count++;
    }
    return { ...job, applications_count: count };
  }

  public async createJob(jobData: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'applications_count'>): Promise<Job> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const job: Job = {
      id,
      ...jobData,
      applications_count: 0,
      created_at: now,
      updated_at: now
    };

    if (isDbConnected()) {
      try {
        await pool.query(
          `INSERT INTO jobs (id, title, department, location, employment_type, experience_required, salary_range, description, required_skills, preferred_skills, education, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            job.id, job.title, job.department, job.location, job.employment_type,
            job.experience_required, job.salary_range, job.description,
            job.required_skills, job.preferred_skills, job.education, job.status
          ]
        );
      } catch (err: any) {
        console.warn('[Storage] DB createJob error, stored in memory:', err.message);
      }
    }

    this.jobs.set(id, job);
    return job;
  }

  public async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    const existing = await this.getJobById(id);
    if (!existing) return null;

    const updated: Job = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (isDbConnected()) {
      try {
        await pool.query(
          `UPDATE jobs SET 
             title = COALESCE($2, title),
             department = COALESCE($3, department),
             location = COALESCE($4, location),
             employment_type = COALESCE($5, employment_type),
             experience_required = COALESCE($6, experience_required),
             salary_range = COALESCE($7, salary_range),
             description = COALESCE($8, description),
             required_skills = COALESCE($9, required_skills),
             preferred_skills = COALESCE($10, preferred_skills),
             education = COALESCE($11, education),
             status = COALESCE($12, status),
             updated_at = NOW()
           WHERE id = $1`,
          [
            id, updates.title, updates.department, updates.location, updates.employment_type,
            updates.experience_required, updates.salary_range, updates.description,
            updates.required_skills, updates.preferred_skills, updates.education, updates.status
          ]
        );
      } catch (err: any) {
        console.warn('[Storage] DB updateJob error, fallback to memory:', err.message);
      }
    }

    this.jobs.set(id, updated);
    return updated;
  }

  public async deleteJob(id: string): Promise<boolean> {
    if (isDbConnected()) {
      try {
        await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
      } catch (err: any) {
        console.warn('[Storage] DB deleteJob error:', err.message);
      }
    }
    return this.jobs.delete(id);
  }

  // CANDIDATES & MATCHES
  public async getCandidates(filters?: {
    jobId?: string;
    status?: string;
    search?: string;
    minScore?: number;
    sortBy?: 'score' | 'experience' | 'name' | 'date';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ candidates: CandidateWithMatch[]; total: number; page: number; totalPages: number }> {
    let list: CandidateWithMatch[] = [];

    // Construct enriched list
    for (const app of this.applications.values()) {
      const candidate = this.candidates.get(app.candidate_id);
      const job = this.jobs.get(app.job_id);
      const match = Array.from(this.matchResults.values()).find(m => m.application_id === app.id);

      if (candidate && job) {
        list.push({
          ...candidate,
          application_id: app.id,
          job_id: job.id,
          job_title: job.title,
          application_status: app.status,
          match_score: match ? Number(match.overall_score) : 70,
          skill_score: match ? Number(match.skill_score) : 70,
          experience_score: match ? Number(match.experience_score) : 70,
          education_score: match ? Number(match.education_score) : 75,
          matched_skills: match ? match.matched_skills : [],
          missing_skills: match ? match.missing_skills : [],
          applied_at: app.created_at
        });
      }
    }

    // Apply filters
    if (filters?.jobId && filters.jobId !== 'all') {
      list = list.filter(c => c.job_id === filters.jobId);
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter(c => c.application_status.toLowerCase() === filters.status?.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.job_title.toLowerCase().includes(q) ||
        (c.skills && c.skills.some(s => s.toLowerCase().includes(q)))
      );
    }
    if (filters?.minScore !== undefined) {
      list = list.filter(c => c.match_score >= filters.minScore!);
    }

    // Sorting
    const order = filters?.sortOrder === 'asc' ? 1 : -1;
    if (filters?.sortBy === 'experience') {
      list.sort((a, b) => (Number(a.experience_years) - Number(b.experience_years)) * order);
    } else if (filters?.sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name) * order);
    } else if (filters?.sortBy === 'date') {
      list.sort((a, b) => (new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime()) * order);
    } else {
      // Default sort by match score desc
      list.sort((a, b) => (b.match_score - a.match_score) * (order === 1 ? -1 : 1));
    }

    // Assign rank
    list = list.map((c, index) => ({ ...c, rank: index + 1 }));

    const total = list.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      candidates: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  public async getCandidateById(id: string): Promise<CandidateWithMatch | null> {
    const candidate = this.candidates.get(id);
    if (!candidate) return null;

    // Find latest application
    let latestApp: Application | undefined;
    for (const app of this.applications.values()) {
      if (app.candidate_id === id) {
        if (!latestApp || new Date(app.created_at) > new Date(latestApp.created_at)) {
          latestApp = app;
        }
      }
    }

    const job = latestApp ? this.jobs.get(latestApp.job_id) : undefined;
    const match = latestApp ? Array.from(this.matchResults.values()).find(m => m.application_id === latestApp?.id) : undefined;

    return {
      ...candidate,
      application_id: latestApp?.id || '',
      job_id: job?.id || '',
      job_title: job?.title || 'General Applicant',
      application_status: latestApp?.status || 'Screening',
      match_score: match ? Number(match.overall_score) : 75,
      skill_score: match ? Number(match.skill_score) : 75,
      experience_score: match ? Number(match.experience_score) : 75,
      education_score: match ? Number(match.education_score) : 80,
      matched_skills: match ? match.matched_skills : (candidate.skills || []),
      missing_skills: match ? match.missing_skills : [],
      applied_at: latestApp?.created_at || candidate.created_at
    };
  }

  public async createCandidate(data: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>): Promise<Candidate> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const candidate: Candidate = {
      id,
      ...data,
      created_at: now,
      updated_at: now
    };

    if (isDbConnected()) {
      try {
        await pool.query(
          `INSERT INTO candidates (id, name, email, phone, location, current_title, experience_years, education, summary)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            candidate.id, candidate.name, candidate.email, candidate.phone,
            candidate.location, candidate.current_title, candidate.experience_years,
            candidate.education, candidate.summary
          ]
        );
      } catch (err: any) {
        console.warn('[Storage] DB createCandidate error:', err.message);
      }
    }

    this.candidates.set(id, candidate);
    return candidate;
  }

  public async updateApplicationStatus(applicationId: string, status: Application['status']): Promise<Application | null> {
    const app = this.applications.get(applicationId);
    if (!app) return null;

    app.status = status;
    app.updated_at = new Date().toISOString();

    if (isDbConnected()) {
      try {
        await pool.query(
          `UPDATE applications SET status = $2, updated_at = NOW() WHERE id = $1`,
          [applicationId, status]
        );
      } catch (err: any) {
        console.warn('[Storage] DB updateApplicationStatus error:', err.message);
      }
    }

    this.applications.set(applicationId, app);
    return app;
  }

  public async deleteCandidate(id: string): Promise<boolean> {
    if (isDbConnected()) {
      try {
        await pool.query('DELETE FROM candidates WHERE id = $1', [id]);
      } catch (err: any) {
        console.warn('[Storage] DB deleteCandidate error:', err.message);
      }
    }

    // Clean memory
    this.candidates.delete(id);
    for (const [appId, app] of this.applications.entries()) {
      if (app.candidate_id === id) {
        this.applications.delete(appId);
        for (const [matchId, match] of this.matchResults.entries()) {
          if (match.application_id === appId) {
            this.matchResults.delete(matchId);
          }
        }
      }
    }
    return true;
  }

  // RESUMES
  public async createResume(resumeData: Omit<Resume, 'id' | 'created_at'>): Promise<Resume> {
    const id = crypto.randomUUID();
    const resume: Resume = {
      id,
      ...resumeData,
      created_at: new Date().toISOString()
    };

    if (isDbConnected()) {
      try {
        await pool.query(
          `INSERT INTO resumes (id, candidate_id, file_name, file_path, file_type, raw_text, parsed_skills)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            resume.id, resume.candidate_id, resume.file_name,
            resume.file_path, resume.file_type, resume.raw_text,
            resume.parsed_skills
          ]
        );
      } catch (err: any) {
        console.warn('[Storage] DB createResume error:', err.message);
      }
    }

    this.resumes.set(id, resume);
    return resume;
  }

  public async getResumeById(id: string): Promise<Resume | null> {
    return this.resumes.get(id) || null;
  }

  // APPLICATIONS & MATCHES
  public async createApplication(appData: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const app: Application = {
      id,
      ...appData,
      created_at: now,
      updated_at: now
    };

    if (isDbConnected()) {
      try {
        await pool.query(
          `INSERT INTO applications (id, candidate_id, job_id, resume_id, status)
           VALUES ($1, $2, $3, $4, $5)`,
          [app.id, app.candidate_id, app.job_id, app.resume_id, app.status]
        );
      } catch (err: any) {
        console.warn('[Storage] DB createApplication error:', err.message);
      }
    }

    this.applications.set(id, app);
    return app;
  }

  public async createMatchResult(matchData: Omit<MatchResult, 'id' | 'created_at'>): Promise<MatchResult> {
    const id = crypto.randomUUID();
    const match: MatchResult = {
      id,
      ...matchData,
      created_at: new Date().toISOString()
    };

    if (isDbConnected()) {
      try {
        await pool.query(
          `INSERT INTO match_results (id, application_id, job_id, candidate_id, overall_score, skill_score, experience_score, education_score, matched_skills, missing_skills)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            match.id, match.application_id, match.job_id, match.candidate_id,
            match.overall_score, match.skill_score, match.experience_score,
            match.education_score, match.matched_skills, match.missing_skills
          ]
        );
      } catch (err: any) {
        console.warn('[Storage] DB createMatchResult error:', err.message);
      }
    }

    this.matchResults.set(id, match);
    return match;
  }

  // RANKINGS BY JOB
  public async getJobRankings(jobId: string): Promise<CandidateWithMatch[]> {
    const res = await this.getCandidates({ jobId, sortBy: 'score', sortOrder: 'desc', limit: 1000 });
    return res.candidates;
  }

  // ANALYTICS
  public async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    const allCandidates = await this.getCandidates({ limit: 1000 });
    const jobs = await this.getJobs();

    const activeJobs = jobs.filter(j => j.status === 'Active').length;
    const totalApplications = allCandidates.total;
    const totalCandidates = this.candidates.size;

    let shortlisted = 0;
    let interviews = 0;
    let hired = 0;
    let rejected = 0;
    let screening = 0;
    let applied = totalApplications; // Total candidate applications received at stage 1
    let scoreSum = 0;

    const brackets = {
      '80-100%': 0,
      '60-79%': 0,
      '40-59%': 0,
      'Below 40%': 0,
    };

    for (const c of allCandidates.candidates) {
      scoreSum += c.match_score;

      if (c.match_score >= 80) brackets['80-100%']++;
      else if (c.match_score >= 60) brackets['60-79%']++;
      else if (c.match_score >= 40) brackets['40-59%']++;
      else brackets['Below 40%']++;

      switch (c.application_status) {
        case 'Screening': screening++; break;
        case 'Shortlisted': shortlisted++; break;
        case 'Interview': interviews++; break;
        case 'Hired': hired++; break;
        case 'Rejected': rejected++; break;
        default: screening++; break;
      }
    }

    const averageMatchScore = totalApplications > 0 ? Math.round(scoreSum / totalApplications) : 0;

    const scoreDistribution = Object.entries(brackets).map(([bracket, count]) => ({
      bracket,
      count,
      percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0
    }));

    // Top recent applications
    const recentApplications = allCandidates.candidates.slice(0, 6).map(c => ({
      id: c.application_id,
      candidate_id: c.id,
      candidate_name: c.name,
      email: c.email,
      job_id: c.job_id,
      job_title: c.job_title,
      match_score: c.match_score,
      status: c.application_status,
      applied_date: c.applied_at
    }));

    // Skills demand aggregated across jobs
    const skillCounts: Record<string, number> = {};
    for (const j of jobs) {
      for (const s of (j.required_skills || [])) {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      }
    }
    const skillsInDemand = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      kpis: {
        totalCandidates,
        activeJobs,
        totalApplications,
        shortlistedCandidates: shortlisted,
        averageMatchScore,
        interviewsPending: interviews
      },
      pipeline: {
        applied,
        screening,
        shortlisted,
        interview: interviews,
        hired,
        rejected
      },
      scoreDistribution,
      recentApplications,
      skillsInDemand
    };
  }

  // SEED INITIAL DATA
  private seedInMemory() {
    // 1. Recruiter user (password: password123, bcrypt hashed)
    const recruiter: User = {
      id: 'usr-admin-01',
      name: 'Sarah Jenkins',
      email: 'recruiter@talentmatch.ai',
      password_hash: '$2a$10$wO3f18e9V6fK7Tsh.Q2KXe3D635q5u4h5q.k5vE3O27w5qgK6B87u', // password123
      role: 'recruiter',
      company: 'TalentMatch AI Technologies',
      created_at: new Date('2026-01-15T09:00:00Z').toISOString(),
      updated_at: new Date('2026-01-15T09:00:00Z').toISOString()
    };
    this.users.set(recruiter.id, recruiter);

    // 2. Realistic Jobs
    const jobsData: Job[] = [
      {
        id: 'job-fs-01',
        title: 'Full Stack Developer',
        department: 'Engineering',
        location: 'San Francisco, CA (Hybrid)',
        employment_type: 'Full-time',
        experience_required: '3-5 years',
        salary_range: '$120,000 - $145,000',
        description: 'Seeking a talented Full Stack Developer proficient in React, TypeScript, and Node.js. You will lead end-to-end feature delivery, build scalable APIs with PostgreSQL, and optimize caching with Redis.',
        required_skills: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'REST API'],
        preferred_skills: ['Docker', 'Redis', 'GitHub'],
        education: "Bachelor's Degree in Computer Science or related field",
        status: 'Active',
        created_at: new Date('2026-09-10T10:00:00Z').toISOString(),
        updated_at: new Date('2026-09-10T10:00:00Z').toISOString()
      },
      {
        id: 'job-fe-02',
        title: 'Senior Frontend Engineer',
        department: 'Product UI',
        location: 'Remote (US/Canada)',
        employment_type: 'Full-time',
        experience_required: '4+ years',
        salary_range: '$130,000 - $160,000',
        description: 'Design and build world-class user interfaces using React, TypeScript, Next.js, and modern CSS. You will collaborate closely with product designers to ship responsive, pixel-perfect experiences.',
        required_skills: ['React', 'TypeScript', 'Next.js', 'Redux', 'TailwindCSS', 'HTML', 'CSS'],
        preferred_skills: ['Vite', 'GraphQL', 'Unit Testing'],
        education: "Bachelor's Degree",
        status: 'Active',
        created_at: new Date('2026-09-15T11:30:00Z').toISOString(),
        updated_at: new Date('2026-09-15T11:30:00Z').toISOString()
      },
      {
        id: 'job-be-03',
        title: 'Backend & Cloud Platform Engineer',
        department: 'Infrastructure',
        location: 'New York, NY (Hybrid)',
        employment_type: 'Full-time',
        experience_required: '3+ years',
        salary_range: '$125,000 - $155,000',
        description: 'We are looking for an experienced backend engineer to architect resilient microservices, configure PostgreSQL clusters, implement low-latency Redis caching, and deploy containerized workloads to AWS.',
        required_skills: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'REST API', 'Microservices'],
        preferred_skills: ['Kubernetes', 'CI/CD', 'Terraform'],
        education: "Bachelor's or Master's Degree in Computer Science",
        status: 'Active',
        created_at: new Date('2026-09-18T08:45:00Z').toISOString(),
        updated_at: new Date('2026-09-18T08:45:00Z').toISOString()
      },
      {
        id: 'job-ml-04',
        title: 'AI / Machine Learning Engineer',
        department: 'AI Research',
        location: 'Boston, MA (On-site)',
        employment_type: 'Full-time',
        experience_required: '2-4 years',
        salary_range: '$140,000 - $175,000',
        description: 'Build predictive and generative machine learning models using Python, PyTorch, and NLP. Integrate AI inference pipelines with modern web services and databases.',
        required_skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'SQL', 'Data Analysis'],
        preferred_skills: ['NLP', 'Docker', 'AWS'],
        education: "Master's Degree in AI, Computer Science, or Data Science",
        status: 'Active',
        created_at: new Date('2026-09-22T14:15:00Z').toISOString(),
        updated_at: new Date('2026-09-22T14:15:00Z').toISOString()
      }
    ];

    for (const j of jobsData) {
      this.jobs.set(j.id, j);
    }

    // 3. Realistic Candidates across various score ranges
    const rawCandidates: Array<{
      cand: Candidate;
      jobId: string;
      skills: string[];
      overallScore: number;
      skillScore: number;
      expScore: number;
      eduScore: number;
      matched: string[];
      missing: string[];
      status: Application['status'];
    }> = [
      {
        cand: {
          id: 'cand-01',
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA',
          current_title: 'Senior Full Stack Engineer',
          experience_years: 5.5,
          education: "Master's Degree in Computer Science",
          summary: 'Accomplished full-stack developer with over 5 years of experience building reactive SPAs with React, TypeScript, and robust microservices using Node.js, Express, and PostgreSQL. Experienced with Docker, Redis caching, and CI/CD pipelines.',
          skills: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'REST API', 'GitHub', 'HTML', 'CSS'],
          created_at: new Date('2026-09-25T10:10:00Z').toISOString(),
          updated_at: new Date('2026-09-25T10:10:00Z').toISOString()
        },
        jobId: 'job-fs-01',
        skills: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'REST API', 'GitHub'],
        overallScore: 94,
        skillScore: 95,
        expScore: 95,
        eduScore: 90,
        matched: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'REST API'],
        missing: [],
        status: 'Shortlisted'
      },
      {
        cand: {
          id: 'cand-02',
          name: 'Arun Kumar',
          email: 'arun.kumar@example.com',
          phone: '+1 (555) 345-6789',
          location: 'San Jose, CA',
          current_title: 'Full Stack Software Engineer',
          experience_years: 4.0,
          education: "Bachelor's Degree in Software Engineering",
          summary: 'Skilled in building scalable web applications with React, TypeScript, Node.js, and PostgreSQL. Experience developing REST APIs and containerizing applications with Docker.',
          skills: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Docker', 'REST API', 'Git'],
          created_at: new Date('2026-09-26T11:20:00Z').toISOString(),
          updated_at: new Date('2026-09-26T11:20:00Z').toISOString()
        },
        jobId: 'job-fs-01',
        skills: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Docker', 'REST API'],
        overallScore: 89,
        skillScore: 88,
        expScore: 90,
        eduScore: 90,
        matched: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'REST API'],
        missing: [],
        status: 'Interview'
      },
      {
        cand: {
          id: 'cand-03',
          name: 'Divya Raj',
          email: 'divya.raj@example.com',
          phone: '+1 (555) 456-7890',
          location: 'Oakland, CA',
          current_title: 'Full Stack Web Developer',
          experience_years: 3.0,
          education: "Bachelor's Degree in Computer Science",
          summary: 'Full stack developer focused on React and Node.js. Proficient with PostgreSQL databases and RESTful API architecture. Eager to expand Docker and Redis skills.',
          skills: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'REST API', 'JavaScript', 'HTML', 'CSS'],
          created_at: new Date('2026-09-27T09:15:00Z').toISOString(),
          updated_at: new Date('2026-09-27T09:15:00Z').toISOString()
        },
        jobId: 'job-fs-01',
        skills: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'REST API', 'JavaScript'],
        overallScore: 83,
        skillScore: 80,
        expScore: 85,
        eduScore: 90,
        matched: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'REST API'],
        missing: ['TypeScript'],
        status: 'Screening'
      },
      {
        cand: {
          id: 'cand-04',
          name: 'Rahul S',
          email: 'rahul.s@example.com',
          phone: '+1 (555) 567-8901',
          location: 'Fremont, CA',
          current_title: 'Junior Web Developer',
          experience_years: 2.0,
          education: "Bachelor's Degree in Information Technology",
          summary: 'Web developer with frontend expertise in React and basic Node.js backend experience. Looking to transition into full-stack development.',
          skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Git'],
          created_at: new Date('2026-09-27T14:30:00Z').toISOString(),
          updated_at: new Date('2026-09-27T14:30:00Z').toISOString()
        },
        jobId: 'job-fs-01',
        skills: ['React', 'Node.js', 'JavaScript', 'HTML', 'CSS', 'Git'],
        overallScore: 76,
        skillScore: 68,
        expScore: 75,
        eduScore: 90,
        matched: ['React', 'Node.js'],
        missing: ['TypeScript', 'Express.js', 'PostgreSQL', 'REST API'],
        status: 'Screening'
      },
      {
        cand: {
          id: 'cand-05',
          name: 'Emily Watson',
          email: 'emily.watson@example.com',
          phone: '+1 (555) 678-9012',
          location: 'Seattle, WA',
          current_title: 'Lead Frontend Architect',
          experience_years: 6.0,
          education: "Bachelor's Degree in Computer Science",
          summary: 'High-performing Frontend Engineer specializing in React, Next.js, Redux, and TailwindCSS design systems. Passionate about web performance, bundle size optimization, and responsive design.',
          skills: ['React', 'TypeScript', 'Next.js', 'Redux', 'TailwindCSS', 'HTML', 'CSS', 'Vite', 'GraphQL'],
          created_at: new Date('2026-09-25T13:00:00Z').toISOString(),
          updated_at: new Date('2026-09-25T13:00:00Z').toISOString()
        },
        jobId: 'job-fe-02',
        skills: ['React', 'TypeScript', 'Next.js', 'Redux', 'TailwindCSS', 'HTML', 'CSS', 'Vite', 'GraphQL'],
        overallScore: 96,
        skillScore: 98,
        expScore: 95,
        eduScore: 90,
        matched: ['React', 'TypeScript', 'Next.js', 'Redux', 'TailwindCSS', 'HTML', 'CSS'],
        missing: [],
        status: 'Shortlisted'
      },
      {
        cand: {
          id: 'cand-06',
          name: 'Marcus Chen',
          email: 'marcus.chen@example.com',
          phone: '+1 (555) 789-0123',
          location: 'Vancouver, Canada',
          current_title: 'Frontend Developer',
          experience_years: 4.5,
          education: "Bachelor's Degree in Software Systems",
          summary: 'Passionate UI engineer adept with React, TypeScript, Redux, and TailwindCSS. Extensive experience writing clean CSS and optimizing interactive SPAs.',
          skills: ['React', 'TypeScript', 'Redux', 'TailwindCSS', 'HTML', 'CSS', 'JavaScript'],
          created_at: new Date('2026-09-26T16:45:00Z').toISOString(),
          updated_at: new Date('2026-09-26T16:45:00Z').toISOString()
        },
        jobId: 'job-fe-02',
        skills: ['React', 'TypeScript', 'Redux', 'TailwindCSS', 'HTML', 'CSS'],
        overallScore: 88,
        skillScore: 86,
        expScore: 90,
        eduScore: 90,
        matched: ['React', 'TypeScript', 'Redux', 'TailwindCSS', 'HTML', 'CSS'],
        missing: ['Next.js'],
        status: 'Interview'
      },
      {
        cand: {
          id: 'cand-07',
          name: 'Sarah Connor',
          email: 'sarah.connor@example.com',
          phone: '+1 (555) 890-1234',
          location: 'Austin, TX',
          current_title: 'UI/UX Developer',
          experience_years: 3.0,
          education: "Bachelor's Degree in Interactive Media",
          summary: 'Frontend developer with solid React and HTML/CSS background. Recently adopted TypeScript and TailwindCSS.',
          skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Bootstrap'],
          created_at: new Date('2026-09-28T09:20:00Z').toISOString(),
          updated_at: new Date('2026-09-28T09:20:00Z').toISOString()
        },
        jobId: 'job-fe-02',
        skills: ['React', 'JavaScript', 'HTML', 'CSS'],
        overallScore: 65,
        skillScore: 60,
        expScore: 70,
        eduScore: 75,
        matched: ['React', 'HTML', 'CSS'],
        missing: ['TypeScript', 'Next.js', 'Redux', 'TailwindCSS'],
        status: 'Screening'
      },
      {
        cand: {
          id: 'cand-08',
          name: 'David Miller',
          email: 'david.miller@example.com',
          phone: '+1 (555) 901-2345',
          location: 'New York, NY',
          current_title: 'Senior Cloud Backend Engineer',
          experience_years: 5.0,
          education: "Master's Degree in Computer Engineering",
          summary: 'Backend infrastructure specialist building high-throughput services with Node.js, Express, PostgreSQL, Redis, and Docker on AWS. Strong proponent of microservice architectures.',
          skills: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'REST API', 'Microservices', 'Kubernetes', 'CI/CD'],
          created_at: new Date('2026-09-24T10:00:00Z').toISOString(),
          updated_at: new Date('2026-09-24T10:00:00Z').toISOString()
        },
        jobId: 'job-be-03',
        skills: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'REST API', 'Microservices', 'Kubernetes'],
        overallScore: 95,
        skillScore: 96,
        expScore: 95,
        eduScore: 95,
        matched: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'REST API', 'Microservices'],
        missing: [],
        status: 'Hired'
      },
      {
        cand: {
          id: 'cand-09',
          name: 'Jessica Taylor',
          email: 'jessica.taylor@example.com',
          phone: '+1 (555) 012-3456',
          location: 'Jersey City, NJ',
          current_title: 'Backend Node.js Developer',
          experience_years: 3.5,
          education: "Bachelor's Degree in Computer Science",
          summary: 'Backend software engineer with 3+ years in Node.js, Express, PostgreSQL, Docker, and REST APIs. Experience configuring Redis caches.',
          skills: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'REST API', 'Git'],
          created_at: new Date('2026-09-25T15:10:00Z').toISOString(),
          updated_at: new Date('2026-09-25T15:10:00Z').toISOString()
        },
        jobId: 'job-be-03',
        skills: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'REST API'],
        overallScore: 85,
        skillScore: 84,
        expScore: 88,
        eduScore: 85,
        matched: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'REST API'],
        missing: ['AWS', 'Microservices'],
        status: 'Interview'
      },
      {
        cand: {
          id: 'cand-10',
          name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          phone: '+1 (555) 123-7890',
          location: 'Boston, MA',
          current_title: 'AI Research Scientist',
          experience_years: 4.0,
          education: "Master's Degree in Artificial Intelligence",
          summary: 'Specialized in computer vision and natural language processing using Python, PyTorch, and TensorFlow. Developed neural networks for feature extraction and classification with strong SQL foundations.',
          skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'SQL', 'Data Analysis', 'NLP', 'Docker'],
          created_at: new Date('2026-09-24T11:00:00Z').toISOString(),
          updated_at: new Date('2026-09-24T11:00:00Z').toISOString()
        },
        jobId: 'job-ml-04',
        skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'SQL', 'Data Analysis', 'NLP'],
        overallScore: 93,
        skillScore: 94,
        expScore: 90,
        eduScore: 95,
        matched: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'SQL', 'Data Analysis'],
        missing: [],
        status: 'Shortlisted'
      },
      {
        cand: {
          id: 'cand-11',
          name: 'Kavita Patel',
          email: 'kavita.patel@example.com',
          phone: '+1 (555) 234-8901',
          location: 'Cambridge, MA',
          current_title: 'Data Analyst / ML Practitioner',
          experience_years: 2.5,
          education: "Master's Degree in Data Analytics",
          summary: 'Data analyst transitioning to machine learning. Skilled in Python, SQL, Pandas, NumPy, and basic scikit-learn models.',
          skills: ['Python', 'SQL', 'Data Analysis', 'Pandas', 'NumPy', 'Machine Learning'],
          created_at: new Date('2026-09-27T13:40:00Z').toISOString(),
          updated_at: new Date('2026-09-27T13:40:00Z').toISOString()
        },
        jobId: 'job-ml-04',
        skills: ['Python', 'SQL', 'Data Analysis', 'Machine Learning'],
        overallScore: 78,
        skillScore: 72,
        expScore: 80,
        eduScore: 95,
        matched: ['Python', 'Machine Learning', 'SQL', 'Data Analysis'],
        missing: ['Deep Learning', 'PyTorch', 'TensorFlow'],
        status: 'Screening'
      },
      {
        cand: {
          id: 'cand-12',
          name: 'James Wilson',
          email: 'james.wilson@example.com',
          phone: '+1 (555) 345-9012',
          location: 'Chicago, IL',
          current_title: 'PHP / WordPress Developer',
          experience_years: 1.5,
          education: "Associate Degree in Web Development",
          summary: 'Junior web developer experienced in PHP, HTML, CSS, and basic JavaScript. Interested in exploring modern cloud and full-stack positions.',
          skills: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
          created_at: new Date('2026-09-28T15:00:00Z').toISOString(),
          updated_at: new Date('2026-09-28T15:00:00Z').toISOString()
        },
        jobId: 'job-fs-01',
        skills: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
        overallScore: 42,
        skillScore: 35,
        expScore: 45,
        eduScore: 65,
        matched: [],
        missing: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'REST API'],
        status: 'Rejected'
      }
    ];

    for (const item of rawCandidates) {
      this.candidates.set(item.cand.id, item.cand);

      // Create resume
      const resumeId = `res-${item.cand.id}`;
      const resume: Resume = {
        id: resumeId,
        candidate_id: item.cand.id,
        file_name: `${item.cand.name.replace(/\s+/g, '_')}_Resume.pdf`,
        file_path: `/uploads/${item.cand.name.replace(/\s+/g, '_')}_Resume.pdf`,
        file_type: 'application/pdf',
        raw_text: item.cand.summary + '\nSkills: ' + (item.skills.join(', ')),
        parsed_skills: item.skills,
        created_at: item.cand.created_at
      };
      this.resumes.set(resumeId, resume);

      // Create application
      const appId = `app-${item.cand.id}`;
      const app: Application = {
        id: appId,
        candidate_id: item.cand.id,
        job_id: item.jobId,
        resume_id: resumeId,
        status: item.status,
        created_at: item.cand.created_at,
        updated_at: item.cand.updated_at
      };
      this.applications.set(appId, app);

      // Create match result
      const matchId = `match-${item.cand.id}`;
      const match: MatchResult = {
        id: matchId,
        application_id: appId,
        job_id: item.jobId,
        candidate_id: item.cand.id,
        overall_score: item.overallScore,
        skill_score: item.skillScore,
        experience_score: item.expScore,
        education_score: item.eduScore,
        matched_skills: item.matched,
        missing_skills: item.missing,
        created_at: item.cand.created_at
      };
      this.matchResults.set(matchId, match);
    }
  }

  // Database initialization runner
  public async initDatabaseSchemaAndSeed() {
    const connected = await checkDbConnection();
    if (!connected) {
      console.log('[Storage] Running with in-memory persistence and full seed data.');
      return;
    }

    try {
      // Execute schema creation
      console.log('[Storage] Initializing PostgreSQL schema...');
      // Execute create statements
      const schemaSql = `
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
      `;
      await pool.query(schemaSql);
      console.log('[Storage] PostgreSQL schema initialized successfully.');

      // Check if jobs exist in DB
      const jobCountRes = await pool.query('SELECT COUNT(*) FROM jobs');
      if (parseInt(jobCountRes.rows[0].count, 10) === 0) {
        console.log('[Storage] Seeding initial data into PostgreSQL...');
        for (const user of this.users.values()) {
          await pool.query(
            `INSERT INTO users (id, name, email, password_hash, role, company)
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
            [user.id, user.name, user.email, user.password_hash, user.role, user.company]
          );
        }
        for (const job of this.jobs.values()) {
          await pool.query(
            `INSERT INTO jobs (id, title, department, location, employment_type, experience_required, salary_range, description, required_skills, preferred_skills, education, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (id) DO NOTHING`,
            [
              job.id, job.title, job.department, job.location, job.employment_type,
              job.experience_required, job.salary_range, job.description,
              job.required_skills, job.preferred_skills, job.education, job.status
            ]
          );
        }
        for (const cand of this.candidates.values()) {
          await pool.query(
            `INSERT INTO candidates (id, name, email, phone, location, current_title, experience_years, education, summary)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
            [
              cand.id, cand.name, cand.email, cand.phone, cand.location,
              cand.current_title, cand.experience_years, cand.education, cand.summary
            ]
          );
        }
        for (const res of this.resumes.values()) {
          await pool.query(
            `INSERT INTO resumes (id, candidate_id, file_name, file_path, file_type, raw_text, parsed_skills)
             VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
            [res.id, res.candidate_id, res.file_name, res.file_path, res.file_type, res.raw_text, res.parsed_skills]
          );
        }
        for (const app of this.applications.values()) {
          await pool.query(
            `INSERT INTO applications (id, candidate_id, job_id, resume_id, status)
             VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
            [app.id, app.candidate_id, app.job_id, app.resume_id, app.status]
          );
        }
        for (const m of this.matchResults.values()) {
          await pool.query(
            `INSERT INTO match_results (id, application_id, job_id, candidate_id, overall_score, skill_score, experience_score, education_score, matched_skills, missing_skills)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
            [m.id, m.application_id, m.job_id, m.candidate_id, m.overall_score, m.skill_score, m.experience_score, m.education_score, m.matched_skills, m.missing_skills]
          );
        }
        console.log('[Storage] PostgreSQL seeded successfully with 4 jobs and 12 applicants.');
      }
    } catch (err: any) {
      console.warn('[Storage] DB schema/seed warning:', err.message);
    }
  }
}

export const storage = new StorageRepository();
export default storage;
