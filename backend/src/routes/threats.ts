import { Router } from 'express';
import { ThreatController } from '@/controllers/threatController';
import { authenticateToken, requireRole } from '@/middleware/auth';

const router = Router();

// All threat routes require authentication
router.use(authenticateToken);

router.get('/', ThreatController.getThreatEvents);
router.get('/statistics', ThreatController.getThreatStatistics);
router.post('/', requireRole(['ADMIN', 'SECURITY_MANAGER', 'ANALYST']), ThreatController.createThreatEvent);
router.patch('/:id/status', requireRole(['ADMIN', 'SECURITY_MANAGER', 'ANALYST']), ThreatController.updateThreatStatus);

export { router as threatRoutes };
