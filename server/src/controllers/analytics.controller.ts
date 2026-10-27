import { Request, Response, NextFunction } from 'express';
import { storage } from '../database/storage.js';
import { redisService } from '../services/redis.service.js';

export class AnalyticsController {
  public async getDashboardAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = 'analytics:dashboard';
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return res.json({ success: true, source: 'cache', data: cached });
      }

      const analytics = await storage.getDashboardAnalytics();

      // Compute additional rates for HR analytics
      const totalApps = analytics.kpis.totalApplications;
      const shortlistRate = totalApps > 0 ? Math.round((analytics.pipeline.shortlisted / totalApps) * 100) : 0;
      const interviewRate = totalApps > 0 ? Math.round((analytics.pipeline.interview / totalApps) * 100) : 0;
      const hiringRate = totalApps > 0 ? Math.round((analytics.pipeline.hired / totalApps) * 100) : 0;

      const enrichedAnalytics = {
        ...analytics,
        metrics: {
          shortlistRate: `${shortlistRate}%`,
          interviewRate: `${interviewRate}%`,
          hiringRate: `${hiringRate}%`,
          averageScreeningTime: '1.4 Days'
        }
      };

      await redisService.set(cacheKey, enrichedAnalytics, 180); // 3 min cache

      return res.json({ success: true, source: 'database', data: enrichedAnalytics });
    } catch (err) {
      next(err);
    }
  }

  public async getJobsAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = 'analytics:jobs';
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return res.json({ success: true, source: 'cache', data: cached });
      }

      const jobs = await storage.getJobs();
      const jobData = [];

      for (const job of jobs) {
        const rankings = await storage.getJobRankings(job.id);
        const avgScore = rankings.length > 0
          ? Math.round(rankings.reduce((sum, r) => sum + r.match_score, 0) / rankings.length)
          : 0;

        jobData.push({
          id: job.id,
          title: job.title,
          department: job.department,
          applications: rankings.length,
          averageMatchScore: avgScore,
          status: job.status
        });
      }

      await redisService.set(cacheKey, jobData, 300);
      return res.json({ success: true, source: 'database', data: jobData });
    } catch (err) {
      next(err);
    }
  }

  public async getCandidatesAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = 'analytics:candidates';
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return res.json({ success: true, source: 'cache', data: cached });
      }

      const result = await storage.getCandidates({ limit: 1000 });
      const candidates = result.candidates;

      const experienceRanges = {
        '< 2 years': 0,
        '2-4 years': 0,
        '4-6 years': 0,
        '6+ years': 0
      };

      for (const c of candidates) {
        const exp = Number(c.experience_years);
        if (exp < 2) experienceRanges['< 2 years']++;
        else if (exp <= 4) experienceRanges['2-4 years']++;
        else if (exp <= 6) experienceRanges['4-6 years']++;
        else experienceRanges['6+ years']++;
      }

      const data = {
        total: candidates.length,
        experienceDistribution: Object.entries(experienceRanges).map(([range, count]) => ({ range, count }))
      };

      await redisService.set(cacheKey, data, 300);
      return res.json({ success: true, source: 'database', data });
    } catch (err) {
      next(err);
    }
  }
}

export const analyticsController = new AnalyticsController();
export default analyticsController;
