# TalentMatch AI — Intelligent Resume Screening & Recruitment Analytics Platform

A production-style, high-performance **AI Resume Screening and Recruitment Analytics Platform** designed for recruiters and HR professionals to automate candidate evaluations, perform transparent skill extraction, compute weighted candidate-job match scores, dynamically rank applicants, and analyze recruitment pipeline metrics.

---

## 🌟 Key Features

1. **Job Description & Requirements Management**
   - Create, edit, and organize job openings with required and preferred skill tags.
   - Pre-configured role templates (*Full Stack Developer*, *AI/ML Engineer*, *Cloud Infrastructure*).
   - Real-time applicant counts per job position.

2. **Drag & Drop Resume Upload & Parsing**
   - Direct file upload support for **PDF**, **DOCX**, and **TXT** formats.
   - Automatic text normalization and contact details extraction (name, email, phone).
   - 1-click built-in test candidate presets for instant demonstration.

3. **Multi-Factor Transparent Matching Engine**
   - **No black-box ML claims**: Transparent, explainable weighted scoring formula:
     $$\text{Overall Score} = (\text{Skill Match} \times 0.60) + (\text{Experience Match} \times 0.25) + (\text{Education Match} \times 0.15)$$
   - Real-time detection of matched vs. missing skills with visual indicators (`✓` / `✗`).

4. **Dynamic Applicant Ranking (Leaderboard)**
   - Automatic candidate ranking calculated dynamically from stored match scores.
   - Filter by status, search by candidate name or skill.
   - High-throughput **Redis caching** (`rankings:${jobId}`) with TTL and automatic invalidation on updates.

5. **Detailed Candidate Screening Profile**
   - Complete candidate view: contact details, experience level, education, and raw resume summary.
   - Visual breakdown progress bars (Skills Match 90%, Experience Match 85%, Education Match 100%).
   - Direct recruiter decision workflows: **Shortlist**, **Move to Interview**, **Mark as Hired**, **Reject**, or **Download Profile**.

6. **HR Recruitment Analytics Dashboard**
   - 6 Core KPIs: Total Candidates, Active Openings, Applications Received, Shortlisted, Average Match Score, Interviews Pending.
   - Interactive visual funnels: Applications → Screening → Shortlisted → Interview → Hired.
   - Candidate Match Score Distribution brackets (`80-100%`, `60-79%`, `40-59%`, `<40%`).
   - Top Technical Skills in Demand and Applications by Job Opening charts.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Modern CSS (Design Tokens & Variables), React Router v6, Lucide Icons |
| **Backend** | Node.js (v20+), Express.js, TypeScript |
| **Database** | PostgreSQL (Primary Relational Database) |
| **Caching** | Redis (In-Memory Leaderboard & Analytics Caching) |
| **Parsing** | `pdf-parse` (PDF extraction), `mammoth` (DOCX extraction), Custom Skill Dictionary (70+ Tech Skills) |
| **Security** | JWT Authentication, Bcrypt Password Hashing, CORS, Input Sanitization |
| **DevOps** | Docker, Docker Compose, Nginx Multi-stage builds |

---

## 🏛️ Architecture & Data Flow

```
[Candidate / Recruiter]
         │
         ▼
[React 18 + Vite SPA (Port 3000)]
         │
         ▼ REST API
[Express.js + TypeScript Server (Port 5000)]
    ├── Auth & JWT Verification Middleware
    ├── Multer File Upload Handler (uploads/)
    ├── Resume Parser (PDF/DOCX Extraction)
    ├── Skill Extractor (70+ Technical Skills & Aliases)
    ├── Matching Engine (60% Skills / 25% Exp / 15% Edu)
    │
    ├── [Redis Cache Engine (Port 6379)]
    │     ├── Job Listings (TTL 180s)
    │     ├── Job Rankings (TTL 300s)
    │     └── Dashboard Analytics (TTL 180s)
    │
    └── [PostgreSQL Relational DB (Port 5432)]
          ├── users
          ├── jobs
          ├── candidates
          ├── resumes
          ├── applications
          └── match_results
```

---

## 🗄️ Database Schema

The PostgreSQL schema is fully normalized and includes:
- `users`: Recruiter credentials and organizations.
- `jobs`: Requisitions, required skills array, preferred skills array, experience, salary.
- `candidates`: Candidate profiles, experience in years, education degree, contact details.
- `resumes`: Uploaded file metadata, raw text, and parsed technical skills array.
- `applications`: Links candidate to specific job openings with workflow status.
- `match_results`: Multi-factor scores (`overall_score`, `skill_score`, `experience_score`, `education_score`, `matched_skills`, `missing_skills`).

---

## 📡 REST API Documentation

### Authentication
- `POST /api/auth/login` — Login recruiter with email & password. Returns JWT token.
- `POST /api/auth/register` — Register a new recruiter account.
- `GET /api/auth/me` — Retrieve current authenticated session profile.

### Jobs
- `GET /api/jobs` — Retrieve all jobs (Cached via Redis).
- `GET /api/jobs/:id` — Retrieve specific job details.
- `POST /api/jobs` — Create new job requisition (Invalidates Redis job cache).
- `PUT /api/jobs/:id` — Update job details.
- `DELETE /api/jobs/:id` — Delete job opening.

### Candidates
- `GET /api/candidates` — List candidates with search, filter (job, status, score), sorting, and pagination.
- `GET /api/candidates/:id` — Get candidate details with match analysis breakdown.
- `POST /api/candidates` — Manually add a candidate record.
- `PUT /api/candidates/:id` — Update candidate status (`Screening`, `Shortlisted`, `Interview`, `Hired`, `Rejected`).
- `DELETE /api/candidates/:id` — Remove candidate record.

### Resumes & Parsing
- `POST /api/resumes/upload` — Multipart form-data resume upload (`PDF`/`DOCX`). Automatically extracts text, identifies skills, and computes job match score.
- `GET /api/resumes/:id` — Fetch raw resume metadata and text.

### Candidate-Job Matching & Rankings
- `POST /api/matching/analyze` — On-the-fly match analysis for arbitrary text or skill sets against a job.
- `GET /api/jobs/:jobId/rankings` — Dynamic candidate leaderboard for job, ranked by match score (Cached via Redis).

### Analytics
- `GET /api/analytics/dashboard` — KPI cards, hiring pipeline, and score distributions (Cached via Redis).
- `GET /api/analytics/jobs` — Requisition volume and average score per role.

---

## 🚀 Quick Start Guide

### Default Recruiter Credentials (Demo Mode)

| Field | Value |
|---|---|
| **Email** | `recruiter@talentmatch.ai` |
| **Password** | `password123` |
| **Instant Access** | Click the **"1-Click Login"** button on the login screen |

---

### Option 1: Running with Docker Compose (Recommended)

To start the full stack (PostgreSQL, Redis, Express Backend, and React Frontend via Nginx):

```bash
# Clone and enter workspace
cd "Job desc project"

# Build and run all services
docker compose up --build
```

Access the application:
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

---

### Option 2: Running Locally for Development

#### 1. Backend Setup

```bash
cd server
npm install

# Start the backend development server
npm run dev
```

*Note: The backend connects to PostgreSQL and Redis if available, or utilizes an automatic high-performance in-memory cache and seed dataset for seamless local testing.*

#### 2. Frontend Setup

In a separate terminal:

```bash
cd client
npm install

# Start the Vite dev server
npm run dev
```

The frontend will run at `http://localhost:3000` with instant hot-module replacement and automated `/api` proxying.

---

## 📁 Monorepo Project Structure

```
Job desc project/
│
├── client/                     # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/         # Common UI & Layout components (Navbar, Sidebar, Badges)
│   │   ├── context/            # AuthContext for session management
│   │   ├── pages/              # 10 Application pages
│   │   ├── services/           # REST API client wrapper
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Route definitions
│   │   ├── index.css           # Modern CSS design system
│   │   └── main.tsx            # DOM root
│   ├── nginx.conf              # Production Nginx configuration
│   ├── Dockerfile              # Multi-stage production build
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/        # REST route controllers (Auth, Job, Candidate, Resume, Rankings, Analytics)
│   │   ├── database/           # PostgreSQL pool, DDL schema, storage layer & seeds
│   │   ├── middleware/         # JWT auth, Multer file upload, Central error handler
│   │   ├── routes/             # Express API routers
│   │   ├── services/           # Redis caching, Skill extractor, Matching engine, Resume parser
│   │   ├── types/              # Backend TypeScript types
│   │   └── server.ts           # Server entry point
│   ├── uploads/                # Resume document storage
│   ├── Dockerfile              # Backend container build
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml          # 4-tier orchestration (Postgres, Redis, API, Client)
├── .env.example                # Sample environment configuration
├── .gitignore
└── README.md
```

---

## 🔮 Future Enhancements

- OAuth2 SSO (Google Workspace, Microsoft Entra).
- Automated interview calendar scheduling via Calendly or Google Calendar API.
- Export candidate leaderboards to CSV and PDF executive summary reports.
- Webhook notifications into Slack and Microsoft Teams.
