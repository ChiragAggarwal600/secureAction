import { Router } from 'express';
import { SecurityController } from '@/controllers/securityController';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// All security routes require authentication
router.use(authenticateToken);

router.get('/overview', SecurityController.getSecurityOverview);
router.get('/metrics', SecurityController.getSecurityMetrics);
router.get('/health', SecurityController.getSystemHealth);
router.get('/threat-categories', SecurityController.getThreatCategories);

export { router as securityRoutes };
