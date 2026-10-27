import { Router } from 'express';
import { candidateController } from '../controllers/candidate.controller.js';

const router = Router();

router.get('/', (req, res, next) => candidateController.getCandidates(req, res, next));
router.get('/:id', (req, res, next) => candidateController.getCandidateById(req, res, next));
router.post('/', (req, res, next) => candidateController.createCandidate(req, res, next));
router.put('/:id', (req, res, next) => candidateController.updateCandidateStatus(req, res, next));
router.delete('/:id', (req, res, next) => candidateController.deleteCandidate(req, res, next));

export default router;
