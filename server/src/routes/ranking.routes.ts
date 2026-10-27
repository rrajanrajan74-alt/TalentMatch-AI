import { Router } from 'express';
import { rankingController } from '../controllers/ranking.controller.js';

const router = Router();

router.get('/:jobId', (req, res, next) => rankingController.getJobRankings(req, res, next));

export default router;
