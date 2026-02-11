import { Hono } from 'hono';
import type { Env } from '../index';
import {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';

const router = new Hono<{ Bindings: Env }>();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
