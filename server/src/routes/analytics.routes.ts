import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/dashboard', (req, res, next) => analyticsController.getDashboardAnalytics(req, res, next));
router.get('/jobs', (req, res, next) => analyticsController.getJobsAnalytics(req, res, next));
router.get('/candidates', (req, res, next) => analyticsController.getCandidatesAnalytics(req, res, next));

export default router;
