import { Router } from 'express';
import authRoutes from './auth.routes.js';
import jobRoutes from './job.routes.js';
import candidateRoutes from './candidate.routes.js';
import resumeRoutes from './resume.routes.js';
import matchingRoutes from './matching.routes.js';
import rankingRoutes from './ranking.routes.js';
import analyticsRoutes from './analytics.routes.js';
import { rankingController } from '../controllers/ranking.controller.js';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'TalentMatch AI Backend API',
    timestamp: new Date().toISOString()
  });
});

// Mounted routes
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/candidates', candidateRoutes);
router.use('/resumes', resumeRoutes);
router.use('/matching', matchingRoutes);
router.use('/rankings', rankingRoutes);
router.use('/analytics', analyticsRoutes);

// Direct route for /jobs/:jobId/rankings per spec
router.get('/jobs/:jobId/rankings', (req, res, next) => rankingController.getJobRankings(req, res, next));

export default router;
