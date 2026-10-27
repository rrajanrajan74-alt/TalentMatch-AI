import { Request, Response, NextFunction } from 'express';
import { storage } from '../database/storage.js';
import { matchingService } from '../services/matching.service.js';
import { skillExtractorService } from '../services/skillExtractor.service.js';

export class MatchingController {
  public async analyzeMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId, candidateId, resumeText, skills, experienceYears, education } = req.body;

      if (!jobId) {
        return res.status(400).json({ success: false, message: 'jobId is required for match analysis.' });
      }

      const job = await storage.getJobById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      let candidateSkills: string[] = [];
      let candidateExp: number = 2.0;
      let candidateEdu: string = "Bachelor's Degree";

      if (candidateId) {
        const candidate = await storage.getCandidateById(candidateId);
        if (candidate) {
          candidateSkills = candidate.skills || [];
          candidateExp = Number(candidate.experience_years);
          candidateEdu = candidate.education;
        }
      } else if (resumeText) {
        candidateSkills = skillExtractorService.extractSkills(resumeText);
        candidateExp = skillExtractorService.extractExperience(resumeText);
        candidateEdu = skillExtractorService.extractEducation(resumeText);
      } else if (skills) {
        candidateSkills = Array.isArray(skills) ? skills : [skills];
        candidateExp = experienceYears ? Number(experienceYears) : 2.0;
        candidateEdu = education || "Bachelor's Degree";
      }

      const result = matchingService.calculateMatch(candidateSkills, candidateExp, candidateEdu, job);

      return res.json({
        success: true,
        jobId: job.id,
        jobTitle: job.title,
        analysis: result,
        explanation: {
          formula: 'Overall = (SkillMatch × 60%) + (ExperienceMatch × 25%) + (EducationMatch × 15%)',
          weights: { skills: '60%', experience: '25%', education: '15%' }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  public async getJobMatching(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;
      const job = await storage.getJobById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      const rankings = await storage.getJobRankings(jobId);
      return res.json({ success: true, job, candidates: rankings });
    } catch (err) {
      next(err);
    }
  }

  public async getCandidateMatching(req: Request, res: Response, next: NextFunction) {
    try {
      const { candidateId } = req.params;
      const candidate = await storage.getCandidateById(candidateId);
      if (!candidate) {
        return res.status(404).json({ success: false, message: 'Candidate not found' });
      }

      return res.json({ success: true, candidate });
    } catch (err) {
      next(err);
    }
  }
}

export const matchingController = new MatchingController();
export default matchingController;
