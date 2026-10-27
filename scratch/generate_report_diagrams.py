import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs('diagrams', exist_ok=True)

# ----------------------------------------------------------------------
# 1. Figure 4.1: Layered System Architecture
# ----------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(12, 7.5), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Title
ax.text(50, 96, "TalentMatch AI -- Layered System Architecture", 
        fontsize=14, fontweight='bold', ha='center', va='center', fontfamily='serif')

tiers = [
    {
        "title": "PRESENTATION LAYER (Frontend SPA - React 18 + TypeScript + Vite)",
        "y": 78, "h": 13,
        "items": ["Landing Page Portal", "Recruiter Dashboard", "Job Requisitions", "Resume Upload Workbench", 
                  "Candidate Profile & Scores", "Leaderboard Rankings", "Recruitment Analytics", "Recruiter Settings"]
    },
    {
        "title": "API GATEWAY & SECURITY LAYER (Express 4 REST Server)",
        "y": 60, "h": 12,
        "items": ["Express REST Router (/api/*)", "Cryptographic JWT Auth Middleware", "RBAC Route Guards", 
                  "In-Memory Sliding Rate Limiter", "CORS & Helmet Security Headers"]
    },
    {
        "title": "DOMAIN BUSINESS LOGIC LAYER",
        "y": 42, "h": 12,
        "items": ["Boundary-Aware Skill Extractor", "3-Factor Match Engine (60/25/15)", "Full-Funnel Analytics Engine", 
                  "Candidate Ranking Service", "Audit Trail & Activity Logger"]
    },
    {
        "title": "RESUME INGESTION & DOCUMENT PARSING LAYER",
        "y": 24, "h": 12,
        "items": ["Multer Multi-File Buffer", "PDF Document Parser", "Word DOCX Parser", 
                  "Plain Text Normalizer", "Header & Contact Extraction"]
    },
    {
        "title": "DATA PERSISTENCE & CACHING LAYER",
        "y": 6, "h": 12,
        "items": ["In-Memory Seeded Relational Store", "PostgreSQL Storage Schema (Normalized)", 
                  "LocalStorage Preference & Weight Cache"]
    }
]

for tier in tiers:
    # Outer box
    rect = patches.FancyBboxPatch((4, tier["y"]), 92, tier["h"], 
                                  boxstyle="round,pad=0.3,rounding_size=1", 
                                  facecolor='#f8fafc', edgecolor='#0f172a', linewidth=1.5)
    ax.add_patch(rect)
    # Header text
    ax.text(6, tier["y"] + tier["h"] - 2.8, tier["title"], 
            fontsize=9.5, fontweight='bold', color='#1e1b4b', fontfamily='serif')
    
    # Inner boxes
    n = len(tier["items"])
    w = 88 / n
    for j, item in enumerate(tier["items"]):
        bx = 6 + j * w
        by = tier["y"] + 1.8
        bw = w - 1.2
        bh = tier["h"] - 5.5
        box = patches.FancyBboxPatch((bx, by), bw, bh, 
                                     boxstyle="round,pad=0.2,rounding_size=0.6",
                                     facecolor='#ffffff', edgecolor='#64748b', linewidth=0.8)
        ax.add_patch(box)
        # wrap text if too long
        words = item.split()
        if len(words) > 2 and len(item) > 18:
            mid = len(words) // 2
            txt = " ".join(words[:mid]) + "\n" + " ".join(words[mid:])
        else:
            txt = item
        ax.text(bx + bw / 2, by + bh / 2, txt, 
                fontsize=7.2, ha='center', va='center', color='#0f172a', fontfamily='serif')

plt.tight_layout()
plt.savefig('diagrams/fig4_1_architecture.png', bbox_inches='tight')
plt.close()
print("Generated: diagrams/fig4_1_architecture.png")

# ----------------------------------------------------------------------
# 2. Figure 4.2: UML Class Diagram
# ----------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(13, 8), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

ax.text(50, 97, "TalentMatch AI -- UML Class Diagram & Relational Entity Mappings", 
        fontsize=13, fontweight='bold', ha='center', va='center', fontfamily='serif')

classes = [
    {
        "name": "<<Interface>>\nUser",
        "attrs": ["- id: number (PK)", "- name: string", "- email: string", "- password_hash: string", "- role: string", "- company: string"],
        "methods": ["+ verifyPassword(): bool", "+ generateToken(): string"],
        "x": 4, "y": 66, "w": 20, "h": 26
    },
    {
        "name": "<<Interface>>\nJob",
        "attrs": ["- id: string (PK)", "- title: string", "- department: string", "- min_experience: number", "- required_skills: string[]", "- preferred_skills: string[]", "- status: string"],
        "methods": ["+ getRequirements(): string[]", "+ validateSkills(): bool"],
        "x": 28, "y": 66, "w": 22, "h": 26
    },
    {
        "name": "<<Interface>>\nCandidate",
        "attrs": ["- id: string (PK)", "- name: string", "- email: string", "- phone: string", "- experience_years: number", "- education_degree: string", "- skills: string[]"],
        "methods": ["+ parseContact(): void", "+ extractSkills(): string[]"],
        "x": 54, "y": 66, "w": 21, "h": 26
    },
    {
        "name": "<<Interface>>\nAuditLog",
        "attrs": ["- id: string (PK)", "- user_id: number (FK)", "- action: string", "- entity: string", "- entity_id: string", "- timestamp: Date"],
        "methods": ["+ recordLog(): void"],
        "x": 78, "y": 66, "w": 18, "h": 26
    },
    {
        "name": "<<Interface>>\nJobApplication",
        "attrs": ["- id: string (PK)", "- job_id: string (FK)", "- candidate_id: string (FK)", "- status: ApplicationStatus", "- applied_at: Date", "- stage_updated_at: Date"],
        "methods": ["+ updateStage(stage): void", "+ getTimeline(): Event[]"],
        "x": 16, "y": 24, "w": 24, "h": 28
    },
    {
        "name": "<<Interface>>\nMatchScore",
        "attrs": ["- id: string (PK)", "- job_id: string (FK)", "- candidate_id: string (FK)", "- overall_score: number", "- skill_score: number", "- experience_score: number", "- education_score: number", "- matched_skills: string[]"],
        "methods": ["+ calculateWeighted(): number", "+ getTier(): string"],
        "x": 44, "y": 24, "w": 25, "h": 28
    },
    {
        "name": "<<Interface>>\nScoringWeights",
        "attrs": ["- skill_weight: number = 60", "- experience_weight: number = 25", "- education_weight: number = 15"],
        "methods": ["+ validateSum(): bool", "+ resetDefaults(): void"],
        "x": 73, "y": 24, "w": 23, "h": 28
    }
]

for c in classes:
    # Outer box
    rect = patches.Rectangle((c["x"], c["y"]), c["w"], c["h"], 
                             facecolor='#f8fafc', edgecolor='#0f172a', linewidth=1.2)
    ax.add_patch(rect)
    # Header banner
    head_h = 5.5
    hrect = patches.Rectangle((c["x"], c["y"] + c["h"] - head_h), c["w"], head_h, 
                              facecolor='#e0e7ff', edgecolor='#0f172a', linewidth=1)
    ax.add_patch(hrect)
    ax.text(c["x"] + c["w"]/2, c["y"] + c["h"] - head_h/2, c["name"], 
            fontsize=7.5, fontweight='bold', ha='center', va='center', fontfamily='serif')
    
    # Attributes
    curr_y = c["y"] + c["h"] - head_h - 1.8
    for attr in c["attrs"]:
        ax.text(c["x"] + 0.8, curr_y, attr, fontsize=6.5, fontfamily='monospace', color='#0f172a')
        curr_y -= 1.9
    
    # Divider line
    div_y = c["y"] + len(c["methods"]) * 2.2 + 2.0
    ax.plot([c["x"], c["x"] + c["w"]], [div_y, div_y], color='#64748b', linewidth=0.8)
    
    # Methods
    curr_m_y = div_y - 1.8
    for m in c["methods"]:
        ax.text(c["x"] + 0.8, curr_m_y, m, fontsize=6.5, fontfamily='monospace', color='#1e1b4b', fontweight='bold')
        curr_m_y -= 2.0

# Relationships (arrows)
# Job to JobApplication
ax.annotate("", xy=(24, 52), xytext=(35, 66),
            arrowprops=dict(arrowstyle="->", color="#0f172a", lw=1.2, ls="--"))
ax.text(28, 59, "1 : N", fontsize=7.5, fontweight='bold', fontfamily='serif')

# Candidate to JobApplication
ax.annotate("", xy=(30, 52), xytext=(58, 66),
            arrowprops=dict(arrowstyle="->", color="#0f172a", lw=1.2, ls="--"))
ax.text(46, 59, "1 : N", fontsize=7.5, fontweight='bold', fontfamily='serif')

# Job & Candidate to MatchScore
ax.annotate("", xy=(52, 52), xytext=(42, 66),
            arrowprops=dict(arrowstyle="->", color="#0f172a", lw=1.2, ls="--"))
ax.annotate("", xy=(58, 52), xytext=(65, 66),
            arrowprops=dict(arrowstyle="->", color="#0f172a", lw=1.2, ls="--"))
ax.text(55, 57, "1 : 1", fontsize=7.5, fontweight='bold', fontfamily='serif')

# User to AuditLog
ax.annotate("", xy=(78, 79), xytext=(24, 79),
            arrowprops=dict(arrowstyle="->", color="#0f172a", lw=1.2, ls=":"))
ax.text(50, 80.5, "logs actions (1 : N)", fontsize=7.5, fontweight='bold', fontfamily='serif')

plt.tight_layout()
plt.savefig('diagrams/fig4_2_class_diagram.png', bbox_inches='tight')
plt.close()
print("Generated: diagrams/fig4_2_class_diagram.png")

# ----------------------------------------------------------------------
# 3. Figure 4.3: Sequence Diagram
# ----------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(13, 8), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

ax.text(50, 97, "End-to-End Resume Screening and Ranking Sequence Diagram", 
        fontsize=13, fontweight='bold', ha='center', va='center', fontfamily='serif')

lifelines = [
    {"name": "Recruiter SPA\n(Client)", "x": 10},
    {"name": "Express Gateway\n(API Router)", "x": 28},
    {"name": "Resume Parser\n(Multer/Ingestion)", "x": 46},
    {"name": "Skill Extractor\n(Boundary Regex)", "x": 64},
    {"name": "Matching Engine\n(3-Factor Scorer)", "x": 82},
    {"name": "Storage Engine\n(Rankings Store)", "x": 95}
]

# Draw lifeline heads
for line in lifelines:
    box = patches.Rectangle((line["x"] - 6, 88), 12, 6, 
                            facecolor='#e0e7ff', edgecolor='#1e1b4b', linewidth=1.2)
    ax.add_patch(box)
    ax.text(line["x"], 91, line["name"], fontsize=7.5, fontweight='bold', 
            ha='center', va='center', fontfamily='serif')
    # Dashed vertical line
    ax.plot([line["x"], line["x"]], [10, 88], color='#94a3b8', linestyle='--', linewidth=1)

# Sequence arrows
messages = [
    {"from": 10, "to": 28, "y": 82, "txt": "1. POST /api/resumes/upload (file, jobId)"},
    {"from": 28, "to": 46, "y": 75, "txt": "2. Ingest document buffer (PDF / DOCX / TXT)"},
    {"from": 46, "to": 28, "y": 68, "txt": "3. Return raw text & normalized content", "dashed": True},
    {"from": 28, "to": 64, "y": 61, "txt": "4. extractContactInfo() & extractSkills()"},
    {"from": 64, "to": 64, "y": 54, "txt": "   Boundary-aware regex match (prevent Java/JS, ML/HTML)"},
    {"from": 64, "to": 28, "y": 47, "txt": "5. Return candidate name & verified skills[]", "dashed": True},
    {"from": 28, "to": 82, "y": 40, "txt": "6. calculateMatch(skills, exp, edu, weights)"},
    {"from": 82, "to": 82, "y": 33, "txt": "   Overall = (0.60*S) + (0.25*E) + (0.15*D)"},
    {"from": 82, "to": 28, "y": 26, "txt": "7. Return scores, matched & missing skills", "dashed": True},
    {"from": 28, "to": 95, "y": 20, "txt": "8. Persist Candidate, MatchScore & Update Rankings"},
    {"from": 95, "to": 28, "y": 14, "txt": "9. Return rank position & updated funnel", "dashed": True},
    {"from": 28, "to": 10, "y": 9,  "txt": "10. 201 Created (Candidate, Scorecard, Rank)", "dashed": True}
]

for msg in messages:
    y = msg["y"]
    x1 = msg["from"]
    x2 = msg["to"]
    dashed = msg.get("dashed", False)
    ls = '--' if dashed else '-'
    color = '#2563eb' if not dashed else '#059669'
    
    if x1 == x2:
        # self call
        ax.annotate("", xy=(x1, y - 2), xytext=(x1, y + 2),
                    arrowprops=dict(arrowstyle="->", color="#7c3aed", lw=1.2, 
                                    connectionstyle="arc3,rad=-0.8"))
        ax.text(x1 + 1.5, y, msg["txt"], fontsize=7.2, color='#7c3aed', fontfamily='serif', fontweight='bold')
    else:
        ax.annotate("", xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(arrowstyle="->", color=color, lw=1.2, ls=ls))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 1.2, msg["txt"], fontsize=7.2, ha='center', va='bottom', 
                color='#0f172a', fontfamily='serif', fontweight='bold')

plt.tight_layout()
plt.savefig('diagrams/fig4_3_sequence_diagram.png', bbox_inches='tight')
plt.close()
print("Generated: diagrams/fig4_3_sequence_diagram.png")
