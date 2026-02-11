import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.patch('/:id/toggle', toggleTask);
router.delete('/:id', deleteTask);

export default router;
