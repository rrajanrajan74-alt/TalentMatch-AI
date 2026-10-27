import { Job, Candidate } from '../types/index.js';

export interface MatchScoreResult {
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedPreferredSkills: string[];
}

export class MatchingService {
  /**
   * Calculates transparent resume-job match score based on:
   * Skill Match (60%), Experience Match (25%), Education Match (15%)
   */
  public calculateMatch(
    candidateSkills: string[],
    candidateExpYears: number,
    candidateEducation: string,
    job: Job
  ): MatchScoreResult {
    // 1. Skill Match Calculation
    const requiredSkills = job.required_skills || [];
    const preferredSkills = job.preferred_skills || [];

    // Normalize comparison strings
    const lowerCandidateSkills = new Set(candidateSkills.map(s => s.toLowerCase().trim()));

    const matchedRequired: string[] = [];
    const missingRequired: string[] = [];

    for (const req of requiredSkills) {
      if (lowerCandidateSkills.has(req.toLowerCase().trim())) {
        matchedRequired.push(req);
      } else {
        missingRequired.push(req);
      }
    }

    const matchedPreferred: string[] = [];
    for (const pref of preferredSkills) {
      if (lowerCandidateSkills.has(pref.toLowerCase().trim())) {
        matchedPreferred.push(pref);
      }
    }

    // Required skills provide base up to 85%, preferred skills provide up to 15% bonus
    let skillScore = 0;
    if (requiredSkills.length > 0) {
      const requiredRatio = matchedRequired.length / requiredSkills.length;
      let preferredRatio = 1;
      if (preferredSkills.length > 0) {
        preferredRatio = matchedPreferred.length / preferredSkills.length;
      }
      skillScore = (requiredRatio * 85) + (preferredRatio * 15);
    } else {
      skillScore = 80;
    }
    skillScore = Math.min(100, Math.max(10, Math.round(skillScore)));

    // 2. Experience Match Calculation
    // Parse required experience from job (e.g. "3+ years", "3-5 years", "2 years")
    const jobExpMatch = (job.experience_required || '').match(/(\d+(?:\.\d+)?)/);
    const requiredYears = jobExpMatch ? parseFloat(jobExpMatch[1]) : 2;

    let experienceScore = 0;
    if (candidateExpYears >= requiredYears) {
      // Full marks, plus bonus if slightly higher
      const bonus = Math.min(15, (candidateExpYears - requiredYears) * 3);
      experienceScore = Math.min(100, 85 + bonus);
    } else {
      // Pro-rated score
      const ratio = candidateExpYears / Math.max(1, requiredYears);
      experienceScore = Math.min(100, Math.max(20, Math.round(ratio * 90)));
    }
    experienceScore = Math.round(experienceScore);

    // 3. Education Match Calculation
    let educationScore = 75;
    const lowerCandEdu = (candidateEducation || '').toLowerCase();
    const lowerJobEdu = (job.education || '').toLowerCase();

    if (lowerCandEdu.includes('ph') || lowerCandEdu.includes('doctor')) {
      educationScore = 100;
    } else if (lowerCandEdu.includes('master') || lowerCandEdu.includes('m.tech') || lowerCandEdu.includes('ms')) {
      educationScore = lowerJobEdu.includes('master') ? 100 : 95;
    } else if (lowerCandEdu.includes('bachelor') || lowerCandEdu.includes('b.tech') || lowerCandEdu.includes('bs')) {
      educationScore = lowerJobEdu.includes('master') ? 80 : 90;
    } else if (lowerCandEdu.includes('diploma') || lowerCandEdu.includes('associate')) {
      educationScore = 70;
    }

    // 4. Overall Transparent Formula:
    // (skillMatch * 0.60) + (experienceMatch * 0.25) + (educationMatch * 0.15)
    const overallScore = Math.round(
      (skillScore * 0.60) +
      (experienceScore * 0.25) +
      (educationScore * 0.15)
    );

    return {
      overallScore: Math.min(100, Math.max(15, overallScore)),
      skillScore,
      experienceScore,
      educationScore,
      matchedSkills: matchedRequired,
      missingSkills: missingRequired,
      matchedPreferredSkills: matchedPreferred,
    };
  }
}

export const matchingService = new MatchingService();
export default matchingService;
