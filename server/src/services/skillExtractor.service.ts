export interface SkillDefinition {
  name: string;
  category: 'Language' | 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Cloud' | 'AI/ML' | 'Tools' | 'Methodology';
  aliases: string[];
}

export const SKILL_DICTIONARY: SkillDefinition[] = [
  // Languages
  { name: 'JavaScript', category: 'Language', aliases: ['javascript', 'js', 'es6', 'ecmascript'] },
  { name: 'TypeScript', category: 'Language', aliases: ['typescript', 'ts'] },
  { name: 'Python', category: 'Language', aliases: ['python', 'py', 'python3'] },
  { name: 'Java', category: 'Language', aliases: ['java', 'core java', 'j2ee'] },
  { name: 'C++', category: 'Language', aliases: ['c++', 'cpp'] },
  { name: 'C#', category: 'Language', aliases: ['c#', 'csharp', 'dotnet', '.net'] },
  { name: 'Go', category: 'Language', aliases: ['golang', 'go language', 'go lang'] },
  { name: 'Rust', category: 'Language', aliases: ['rust'] },
  { name: 'Ruby', category: 'Language', aliases: ['ruby'] },
  { name: 'PHP', category: 'Language', aliases: ['php', 'php7', 'php8'] },
  { name: 'SQL', category: 'Language', aliases: ['sql', 't-sql', 'pl/sql'] },
  { name: 'HTML', category: 'Language', aliases: ['html', 'html5'] },
  { name: 'CSS', category: 'Language', aliases: ['css', 'css3', 'scss', 'sass', 'less'] },
  { name: 'Swift', category: 'Language', aliases: ['swift'] },
  { name: 'Kotlin', category: 'Language', aliases: ['kotlin'] },

  // Frontend
  { name: 'React', category: 'Frontend', aliases: ['react', 'react.js', 'reactjs'] },
  { name: 'Angular', category: 'Frontend', aliases: ['angular', 'angularjs', 'angular.js'] },
  { name: 'Vue', category: 'Frontend', aliases: ['vue', 'vue.js', 'vuejs'] },
  { name: 'Next.js', category: 'Frontend', aliases: ['next.js', 'nextjs', 'next js'] },
  { name: 'Redux', category: 'Frontend', aliases: ['redux', 'redux-toolkit', 'rtk'] },
  { name: 'TailwindCSS', category: 'Frontend', aliases: ['tailwind', 'tailwindcss'] },
  { name: 'Bootstrap', category: 'Frontend', aliases: ['bootstrap', 'bootstrap5'] },
  { name: 'Vite', category: 'Frontend', aliases: ['vite', 'vitejs'] },
  { name: 'Webpack', category: 'Frontend', aliases: ['webpack'] },

  // Backend
  { name: 'Node.js', category: 'Backend', aliases: ['node.js', 'nodejs', 'node'] },
  { name: 'Express.js', category: 'Backend', aliases: ['express.js', 'expressjs', 'express'] },
  { name: 'NestJS', category: 'Backend', aliases: ['nestjs', 'nest.js'] },
  { name: 'Spring Boot', category: 'Backend', aliases: ['spring boot', 'springboot', 'spring framework', 'spring'] },
  { name: 'Django', category: 'Backend', aliases: ['django'] },
  { name: 'Flask', category: 'Backend', aliases: ['flask'] },
  { name: 'FastAPI', category: 'Backend', aliases: ['fastapi'] },
  { name: 'REST API', category: 'Backend', aliases: ['rest api', 'rest apis', 'restful', 'restful api', 'rest'] },
  { name: 'GraphQL', category: 'Backend', aliases: ['graphql', 'apollo graphql'] },
  { name: 'Microservices', category: 'Backend', aliases: ['microservices', 'microservice architecture'] },

  // Database
  { name: 'PostgreSQL', category: 'Database', aliases: ['postgresql', 'postgres', 'pgsql'] },
  { name: 'MySQL', category: 'Database', aliases: ['mysql'] },
  { name: 'MongoDB', category: 'Database', aliases: ['mongodb', 'mongo'] },
  { name: 'Redis', category: 'Database', aliases: ['redis'] },
  { name: 'SQLite', category: 'Database', aliases: ['sqlite', 'sqlite3'] },
  { name: 'Elasticsearch', category: 'Database', aliases: ['elasticsearch', 'elastic search'] },
  { name: 'DynamoDB', category: 'Database', aliases: ['dynamodb'] },

  // Cloud & DevOps
  { name: 'Docker', category: 'DevOps', aliases: ['docker', 'containerization'] },
  { name: 'Kubernetes', category: 'DevOps', aliases: ['kubernetes', 'k8s'] },
  { name: 'AWS', category: 'Cloud', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'] },
  { name: 'Azure', category: 'Cloud', aliases: ['azure', 'microsoft azure'] },
  { name: 'GCP', category: 'Cloud', aliases: ['gcp', 'google cloud', 'google cloud platform'] },
  { name: 'CI/CD', category: 'DevOps', aliases: ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment'] },
  { name: 'Git', category: 'Tools', aliases: ['git'] },
  { name: 'GitHub', category: 'Tools', aliases: ['github'] },
  { name: 'GitLab', category: 'Tools', aliases: ['gitlab'] },
  { name: 'Terraform', category: 'DevOps', aliases: ['terraform'] },
  { name: 'Linux', category: 'DevOps', aliases: ['linux', 'ubuntu', 'centos', 'debian'] },
  { name: 'Nginx', category: 'DevOps', aliases: ['nginx'] },
  { name: 'Jenkins', category: 'DevOps', aliases: ['jenkins'] },

  // AI & Data
  { name: 'Machine Learning', category: 'AI/ML', aliases: ['machine learning', 'ml'] },
  { name: 'Deep Learning', category: 'AI/ML', aliases: ['deep learning', 'dl'] },
  { name: 'TensorFlow', category: 'AI/ML', aliases: ['tensorflow', 'tf'] },
  { name: 'PyTorch', category: 'AI/ML', aliases: ['pytorch', 'torch'] },
  { name: 'NLP', category: 'AI/ML', aliases: ['nlp', 'natural language processing'] },
  { name: 'Computer Vision', category: 'AI/ML', aliases: ['computer vision', 'opencv'] },
  { name: 'Pandas', category: 'AI/ML', aliases: ['pandas'] },
  { name: 'NumPy', category: 'AI/ML', aliases: ['numpy'] },
  { name: 'Scikit-Learn', category: 'AI/ML', aliases: ['scikit-learn', 'sklearn'] },
  { name: 'Data Analysis', category: 'AI/ML', aliases: ['data analysis', 'data analytics'] },

  // Tools & Methodologies
  { name: 'Agile', category: 'Methodology', aliases: ['agile', 'scrum', 'kanban'] },
  { name: 'Jira', category: 'Tools', aliases: ['jira'] },
  { name: 'Unit Testing', category: 'Tools', aliases: ['unit testing', 'jest', 'mocha', 'cypress'] },
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class SkillExtractorService {
  /**
   * Extracts recognized technical skills from given text.
   * Uses case-insensitive word-boundary regular expressions to prevent
   * false-positive substring matches (e.g. 'ml' in HTML/YAML, 'java' in JavaScript).
   */
  public extractSkills(text: string): string[] {
    if (!text || typeof text !== 'string') return [];

    const foundSkills = new Set<string>();

    for (const skill of SKILL_DICTIONARY) {
      const candidates = [skill.name, ...skill.aliases];
      for (const alias of candidates) {
        const trimmed = alias.trim();
        if (!trimmed) continue;

        const escaped = escapeRegex(trimmed);
        const pattern = new RegExp(`(?:^|[^a-zA-Z0-9_#+])(?:${escaped})(?:$|[^a-zA-Z0-9_#+])`, 'i');

        if (pattern.test(text)) {
          foundSkills.add(skill.name);
          break;
        }
      }
    }

    return Array.from(foundSkills);
  }

  /**
   * Estimates years of experience from resume text.
   */
  public extractExperience(text: string): number {
    if (!text) return 2.0;

    let maxExp = 0;

    // Pattern 1: "5+ years", "4 years of experience", "3 yrs exp"
    const expRegex = /(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)(?:\s*(?:of)?\s*(?:experience|exp|work))?/gi;
    let match;
    while ((match = expRegex.exec(text)) !== null) {
      const val = parseFloat(match[1]);
      if (val > 0 && val < 40 && val > maxExp) {
        maxExp = val;
      }
    }

    // Pattern 2: Calculate from date ranges like "2019 - 2024" or "2020 - Present"
    const currentYear = new Date().getFullYear();
    const dateRangeRegex = /(?:20\d\d|19\d\d)\s*[-–to]+\s*(?:20\d\d|19\d\d|present|current|now)/gi;
    const ranges = text.match(dateRangeRegex);
    if (ranges && ranges.length > 0) {
      let rangeYears = 0;
      for (const r of ranges) {
        const parts = r.split(/[-–to]+/i).map(p => p.trim());
        if (parts.length === 2) {
          const startYear = parseInt(parts[0], 10);
          const endYear = /present|current|now/i.test(parts[1]) ? currentYear : parseInt(parts[1], 10);
          if (startYear >= 1990 && endYear <= currentYear + 1 && endYear >= startYear) {
            rangeYears += (endYear - startYear);
          }
        }
      }
      if (rangeYears > maxExp && rangeYears < 40) {
        maxExp = rangeYears;
      }
    }

    // Default reasonable fallback if no explicit year found
    return maxExp > 0 ? maxExp : 2.5;
  }

  /**
   * Extracts education level from resume text.
   */
  public extractEducation(text: string): string {
    if (!text) return "Bachelor's Degree";

    const lower = text.toLowerCase();

    if (/ph\.?d|doctorate|doctor of philosophy/i.test(lower)) {
      return "Ph.D. / Doctorate";
    }
    if (/master(?:'?s)?|m\.tech|m\.s\.|msc|mca|mba/i.test(lower)) {
      return "Master's Degree";
    }
    if (/bachelor(?:'?s)?|b\.tech|b\.e\.|b\.s\.|bsc|bca/i.test(lower)) {
      return "Bachelor's Degree";
    }
    if (/diploma|associate(?:'?s)?/i.test(lower)) {
      return "Associate Degree / Diploma";
    }

    return "Bachelor's Degree in Computer Science or related field";
  }

  /**
   * Extracts candidate contact info (name, email, phone) if not provided
   */
  public extractContactInfo(text: string): { email?: string; phone?: string; name?: string } {
    const result: { email?: string; phone?: string; name?: string } = {};

    // Email
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
    if (emailMatch) {
      result.email = emailMatch[1];
    }

    // Phone
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      result.phone = phoneMatch[0];
    }

    // Candidate Name (often first non-empty line of resume)
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2 && l.length < 50);
    if (lines.length > 0) {
      const ignoredHeaders = new Set([
        'resume', 'curriculum vitae', 'cv', 'profile', 'summary', 'professional summary',
        'executive summary', 'personal profile', 'contact', 'contact info', 'experience',
        'work experience', 'education', 'skills', 'technical skills', 'objective', 'about me'
      ]);
      for (const line of lines) {
        const clean = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
        if (ignoredHeaders.has(clean)) continue;
        if (/^[a-zA-Z\s.-]+$/.test(line) && line.split(' ').length >= 1 && line.split(' ').length <= 4) {
          result.name = line;
          break;
        }
      }
    }

    return result;
  }
}

export const skillExtractorService = new SkillExtractorService();
export default skillExtractorService;

