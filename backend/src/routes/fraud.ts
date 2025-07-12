import { Router } from 'express';
import { FraudController } from '@/controllers/fraudController';
import { authenticateToken, requireRole } from '@/middleware/auth';

const router = Router();

// All fraud routes require authentication
router.use(authenticateToken);

router.get('/detection-data', FraudController.getFraudDetectionData);
router.get('/events', FraudController.getFraudEvents);
router.post('/events', requireRole(['ADMIN', 'SECURITY_MANAGER', 'ANALYST']), FraudController.createFraudEvent);
router.patch('/events/:id/status', requireRole(['ADMIN', 'SECURITY_MANAGER', 'ANALYST']), FraudController.updateFraudEventStatus);

export { router as fraudRoutes };
