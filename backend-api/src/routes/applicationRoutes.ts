import { Router } from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationStats,
} from '../controllers/applicationController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getApplications);
router.get('/stats', getApplicationStats);
router.post('/', createApplication);
router.get('/:id', getApplicationById);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
