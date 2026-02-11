import { Hono } from 'hono';
import type { Env } from '../index';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getProfile,
  updateProfile,
  getAllUsers,
} from '../controllers/userController';

const router = new Hono<{ Bindings: Env }>();

// Protected routes (require authentication)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

export default router;
