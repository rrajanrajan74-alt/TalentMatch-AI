import { Request, Response, NextFunction } from 'express';
import { storage } from '../database/storage.js';
import { redisService } from '../services/redis.service.js';

export class RankingController {
  public async getJobRankings(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;

      if (!jobId) {
        return res.status(400).json({ success: false, message: 'jobId parameter is required.' });
      }

      const job = await storage.getJobById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
      }

      const cacheKey = `rankings:${jobId}`;

      // 1. Check Redis Cache
      const cachedRankings = await redisService.get<any[]>(cacheKey);
      if (cachedRankings) {
        return res.json({
          success: true,
          source: 'redis_cache',
          job: {
            id: job.id,
            title: job.title,
            department: job.department,
            required_skills: job.required_skills
          },
          rankings: cachedRankings
        });
      }

      // 2. Query Storage / Database, compute ranking dynamically based on stored match scores
      const candidates = await storage.getJobRankings(jobId);

      // Sort by match score descending and attach rank
      const rankedCandidates = candidates
        .sort((a, b) => b.match_score - a.match_score)
        .map((candidate, index) => ({
          rank: index + 1,
          candidate_id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          match_score: candidate.match_score,
          skill_score: candidate.skill_score,
          experience_score: candidate.experience_score,
          education_score: candidate.education_score,
          experience_years: candidate.experience_years,
          education: candidate.education,
          matched_skills: candidate.matched_skills,
          missing_skills: candidate.missing_skills,
          status: candidate.application_status,
          applied_at: candidate.applied_at
        }));

      // 3. Store in Redis cache with 300s (5 minutes) TTL
      await redisService.set(cacheKey, rankedCandidates, 300);

      return res.json({
        success: true,
        source: 'database',
        job: {
          id: job.id,
          title: job.title,
          department: job.department,
          required_skills: job.required_skills
        },
        rankings: rankedCandidates
      });
    } catch (err) {
      next(err);
    }
  }
}

export const rankingController = new RankingController();
export default rankingController;
