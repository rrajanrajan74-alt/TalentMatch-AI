import { Request, Response, NextFunction } from 'express';
import { storage } from '../database/storage.js';
import { redisService } from '../services/redis.service.js';

export class CandidateController {
  public async getCandidates(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        jobId,
        status,
        search,
        minScore,
        sortBy,
        sortOrder,
        page,
        limit
      } = req.query;

      const filters = {
        jobId: jobId as string,
        status: status as string,
        search: search as string,
        minScore: minScore ? Number(minScore) : undefined,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10
      };

      const result = await storage.getCandidates(filters);
      return res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  public async getCandidateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const candidate = await storage.getCandidateById(id);
      if (!candidate) {
        return res.status(404).json({ success: false, message: 'Candidate not found' });
      }
      return res.json({ success: true, candidate });
    } catch (err) {
      next(err);
    }
  }

  public async createCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, location, current_title, experience_years, education, summary, skills } = req.body;
      if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email are required.' });
      }

      const candidate = await storage.createCandidate({
        name,
        email,
        phone: phone || '',
        location: location || 'Remote',
        current_title: current_title || 'Software Engineer',
        experience_years: experience_years ? Number(experience_years) : 2,
        education: education || "Bachelor's Degree",
        summary: summary || '',
        skills: Array.isArray(skills) ? skills : []
      });

      await redisService.invalidateCandidateCache();
      return res.status(201).json({ success: true, message: 'Candidate added successfully', candidate });
    } catch (err) {
      next(err);
    }
  }

  public async updateCandidateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, applicationId } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }

      let targetAppId = applicationId;
      if (!targetAppId) {
        const candidate = await storage.getCandidateById(id);
        if (candidate?.application_id) {
          targetAppId = candidate.application_id;
        }
      }

      if (!targetAppId) {
        return res.status(404).json({ success: false, message: 'No application found for candidate' });
      }

      const updatedApp = await storage.updateApplicationStatus(targetAppId, status);
      await redisService.invalidateCandidateCache();

      return res.json({
        success: true,
        message: `Candidate status updated to ${status}`,
        application: updatedApp
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCandidate(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Candidate not found' });
      }

      await redisService.invalidateCandidateCache();
      return res.json({ success: true, message: 'Candidate deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const candidateController = new CandidateController();
export default candidateController;
