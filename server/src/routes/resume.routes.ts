import { Router } from 'express';
import { resumeController } from '../controllers/resume.controller.js';
import { uploadResume } from '../middleware/upload.js';

const router = Router();

router.post('/upload', uploadResume.single('resume'), (req, res, next) => resumeController.uploadResume(req, res, next));
router.get('/:id', (req, res, next) => resumeController.getResumeById(req, res, next));

export default router;
