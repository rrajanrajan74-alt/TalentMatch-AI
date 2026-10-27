import { Router } from 'express';
import { jobController } from '../controllers/job.controller.js';

const router = Router();

router.get('/', (req, res, next) => jobController.getJobs(req, res, next));
router.get('/:id', (req, res, next) => jobController.getJobById(req, res, next));
router.post('/', (req, res, next) => jobController.createJob(req, res, next));
router.put('/:id', (req, res, next) => jobController.updateJob(req, res, next));
router.delete('/:id', (req, res, next) => jobController.deleteJob(req, res, next));

export default router;
