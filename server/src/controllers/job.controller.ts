import { Request, Response, NextFunction } from 'express';
import { storage } from '../database/storage.js';
import { redisService } from '../services/redis.service.js';

export class JobController {
  public async getJobs(_req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = 'jobs:all';
      const cached = await redisService.get<any[]>(cacheKey);
      if (cached) {
        return res.json({ success: true, source: 'cache', jobs: cached });
      }

      const jobs = await storage.getJobs();
      await redisService.set(cacheKey, jobs, 180); // 3 min cache

      return res.json({ success: true, source: 'database', jobs });
    } catch (err) {
      next(err);
    }
  }

  public async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cacheKey = `jobs:${id}`;
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return res.json({ success: true, source: 'cache', job: cached });
      }

      const job = await storage.getJobById(id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      await redisService.set(cacheKey, job, 300);
      return res.json({ success: true, source: 'database', job });
    } catch (err) {
      next(err);
    }
  }

  public async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        department,
        location,
        employment_type,
        experience_required,
        salary_range,
        description,
        required_skills,
        preferred_skills,
        education
      } = req.body;

      if (!title || !department || !location || !experience_required || !description) {
        return res.status(400).json({
          success: false,
          message: 'Missing required job fields: title, department, location, experience_required, description are required.'
        });
      }

      const parsedRequiredSkills = Array.isArray(required_skills)
        ? required_skills
        : (required_skills || '').split(',').map((s: string) => s.trim()).filter(Boolean);

      const parsedPreferredSkills = Array.isArray(preferred_skills)
        ? preferred_skills
        : (preferred_skills || '').split(',').map((s: string) => s.trim()).filter(Boolean);

      const newJob = await storage.createJob({
        title,
        department,
        location,
        employment_type: employment_type || 'Full-time',
        experience_required,
        salary_range: salary_range || 'Competitive',
        description,
        required_skills: parsedRequiredSkills,
        preferred_skills: parsedPreferredSkills,
        education: education || "Bachelor's Degree",
        status: 'Active'
      });

      // Invalidate cache
      await redisService.invalidateJobCache();

      return res.status(201).json({
        success: true,
        message: 'Job position created successfully',
        job: newJob
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (updates.required_skills && !Array.isArray(updates.required_skills)) {
        updates.required_skills = updates.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (updates.preferred_skills && !Array.isArray(updates.preferred_skills)) {
        updates.preferred_skills = updates.preferred_skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      }

      const updated = await storage.updateJob(id, updates);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      await redisService.invalidateJobCache(id);
      return res.json({ success: true, message: 'Job updated successfully', job: updated });
    } catch (err) {
      next(err);
    }
  }

  public async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteJob(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      await redisService.invalidateJobCache(id);
      return res.json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const jobController = new JobController();
export default jobController;
