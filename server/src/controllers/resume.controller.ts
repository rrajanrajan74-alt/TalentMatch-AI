import { Request, Response, NextFunction } from 'express';
import { storage } from '../database/storage.js';
import { resumeParserService } from '../services/resumeParser.service.js';
import { skillExtractorService } from '../services/skillExtractor.service.js';
import { matchingService } from '../services/matching.service.js';
import { redisService } from '../services/redis.service.js';

export class ResumeController {
  public async uploadResume(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No resume file provided. Please upload a PDF, DOCX, or TXT file.'
        });
      }

      const { name, email, phone, jobId, location } = req.body;
      const file = req.file;

      // 1. Extract raw text from resume
      const rawText = await resumeParserService.parseFile(file.path, file.mimetype);

      // 2. Extract skills, experience, and education
      const extractedSkills = skillExtractorService.extractSkills(rawText);
      const extractedExp = skillExtractorService.extractExperience(rawText);
      const extractedEdu = skillExtractorService.extractEducation(rawText);
      const contactInfo = skillExtractorService.extractContactInfo(rawText);

      const candidateName = name || contactInfo.name || file.originalname.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      const candidateEmail = email || contactInfo.email || `${candidateName.toLowerCase().replace(/\s+/g, '.')}@candidate-upload.com`;
      const candidatePhone = phone || contactInfo.phone || '+1 (555) 000-1234';

      // 3. Create or update candidate
      let candidate = await storage.createCandidate({
        name: candidateName,
        email: candidateEmail,
        phone: candidatePhone,
        location: location || 'Remote',
        current_title: `${extractedSkills[0] || 'Software'} Specialist`,
        experience_years: extractedExp,
        education: extractedEdu,
        summary: rawText.slice(0, 350) + (rawText.length > 350 ? '...' : ''),
        skills: extractedSkills
      });

      // 4. Store resume
      const resume = await storage.createResume({
        candidate_id: candidate.id,
        file_name: file.originalname,
        file_path: file.path,
        file_type: file.mimetype,
        raw_text: rawText,
        parsed_skills: extractedSkills
      });

      // 5. If jobId is provided, calculate match score against the job
      let matchResult: any = null;
      let job: any = null;
      let application: any = null;

      if (jobId) {
        job = await storage.getJobById(jobId);
        if (job) {
          const matchAnalysis = matchingService.calculateMatch(
            extractedSkills,
            extractedExp,
            extractedEdu,
            job
          );

          application = await storage.createApplication({
            candidate_id: candidate.id,
            job_id: job.id,
            resume_id: resume.id,
            status: matchAnalysis.overallScore >= 80 ? 'Shortlisted' : 'Screening'
          });

          matchResult = await storage.createMatchResult({
            application_id: application.id,
            job_id: job.id,
            candidate_id: candidate.id,
            overall_score: matchAnalysis.overallScore,
            skill_score: matchAnalysis.skillScore,
            experience_score: matchAnalysis.experienceScore,
            education_score: matchAnalysis.educationScore,
            matched_skills: matchAnalysis.matchedSkills,
            missing_skills: matchAnalysis.missingSkills
          });

          // Invalidate cache for rankings & analytics
          await redisService.invalidateRankingsCache(job.id);
          await redisService.invalidateAnalyticsCache();
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Resume parsed and analyzed successfully',
        candidate,
        resume: {
          id: resume.id,
          file_name: resume.file_name,
          skills_count: extractedSkills.length,
          parsed_skills: extractedSkills
        },
        job: job ? { id: job.id, title: job.title } : null,
        matchResult: matchResult ? {
          overall_score: matchResult.overall_score,
          skill_score: matchResult.skill_score,
          experience_score: matchResult.experience_score,
          education_score: matchResult.education_score,
          matched_skills: matchResult.matched_skills,
          missing_skills: matchResult.missing_skills
        } : null
      });
    } catch (err) {
      next(err);
    }
  }

  public async getResumeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resume = await storage.getResumeById(id);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }
      return res.json({ success: true, resume });
    } catch (err) {
      next(err);
    }
  }
}

export const resumeController = new ResumeController();
export default resumeController;
