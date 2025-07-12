import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// Public routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/refresh-token', AuthController.refreshToken);

// Protected routes
router.post('/logout', authenticateToken, AuthController.logout);

export { router as authRoutes };
