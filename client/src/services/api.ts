import { Job, CandidateWithMatch, DashboardAnalytics, User } from '../types/index';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('tm_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const errorMsg = data?.message || res.statusText || 'An error occurred while fetching data.';
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // AUTH
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async register(name: string, email: string, password: string, company?: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, company })
    });
    return handleResponse(res);
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // JOBS
  async getJobs(): Promise<{ jobs: Job[]; source?: string }> {
    const res = await fetch(`${API_BASE}/jobs`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async getJobById(id: string): Promise<{ job: Job; source?: string }> {
    const res = await fetch(`${API_BASE}/jobs/${id}`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async createJob(jobData: Partial<Job>): Promise<{ job: Job; message: string }> {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData)
    });
    return handleResponse(res);
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<{ job: Job }> {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  async deleteJob(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // CANDIDATES
  async getCandidates(params?: {
    jobId?: string;
    status?: string;
    search?: string;
    minScore?: number;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }): Promise<{ candidates: CandidateWithMatch[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const res = await fetch(`${API_BASE}/candidates?${query.toString()}`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async getCandidateById(id: string): Promise<{ candidate: CandidateWithMatch }> {
    const res = await fetch(`${API_BASE}/candidates/${id}`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async updateCandidateStatus(id: string, status: string, applicationId?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, applicationId })
    });
    return handleResponse(res);
  },

  async deleteCandidate(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // RESUMES
  async uploadResume(formData: FormData): Promise<any> {
    const token = localStorage.getItem('tm_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/resumes/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    return handleResponse(res);
  },

  // RANKINGS
  async getJobRankings(jobId: string): Promise<{ job: Job; rankings: CandidateWithMatch[]; source?: string }> {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/rankings`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  // MATCHING
  async analyzeMatch(payload: {
    jobId: string;
    candidateId?: string;
    resumeText?: string;
    skills?: string[];
    experienceYears?: number;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/matching/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // ANALYTICS
  async getDashboardAnalytics(): Promise<{ data: DashboardAnalytics; source?: string }> {
    const res = await fetch(`${API_BASE}/analytics/dashboard`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async getJobsAnalytics(): Promise<{ data: any[]; source?: string }> {
    const res = await fetch(`${API_BASE}/analytics/jobs`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  // HEALTH CHECK
  async checkHealth(): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  }
};

export default api;
