import { Hono } from 'hono';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';
import {
  getApplications,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController';

const router = new Hono<{ Bindings: Env }>();

// All routes require authentication
router.use('*', authMiddleware);

router.get('/', getApplications);
router.post('/', createApplication);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
