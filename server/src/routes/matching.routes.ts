import { Router } from 'express';
import { matchingController } from '../controllers/matching.controller.js';

const router = Router();

router.post('/analyze', (req, res, next) => matchingController.analyzeMatch(req, res, next));
router.get('/job/:jobId', (req, res, next) => matchingController.getJobMatching(req, res, next));
router.get('/candidate/:candidateId', (req, res, next) => matchingController.getCandidateMatching(req, res, next));

export default router;
