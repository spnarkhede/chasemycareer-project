import { Hono } from 'hono';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';
import {
  getTasks,
  getTask,
  updateTask,
  completeTask,
} from '../controllers/taskController';

const router = new Hono<{ Bindings: Env }>();

// All routes require authentication
router.use('*', authMiddleware);

router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.post('/:id/complete', completeTask);

export default router;
