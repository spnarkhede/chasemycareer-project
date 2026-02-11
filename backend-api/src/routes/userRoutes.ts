import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateCurrentUser,
} from '../controllers/userController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (none for users)

// Protected routes
router.use(authenticate);

router.get('/me', getCurrentUser);
router.patch('/me', updateCurrentUser);

// Admin routes
router.get('/', requireAdmin, getAllUsers);
router.get('/:id', requireAdmin, getUserById);

export default router;
