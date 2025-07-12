import { Router } from 'express';
import { AlertController } from '@/controllers/alertController';
import { authenticateToken, requireRole } from '@/middleware/auth';

const router = Router();

// All alert routes require authentication
router.use(authenticateToken);

router.get('/', AlertController.getAlerts);
router.get('/stats', AlertController.getAlertStats);
router.post('/', requireRole(['ADMIN', 'SECURITY_MANAGER', 'ANALYST']), AlertController.createAlert);
router.patch('/:id/read', AlertController.markAsRead);
router.patch('/:id/resolve', requireRole(['ADMIN', 'SECURITY_MANAGER', 'ANALYST']), AlertController.markAsResolved);
router.patch('/bulk/read', AlertController.bulkMarkAsRead);
router.patch('/bulk/resolve', requireRole(['ADMIN', 'SECURITY_MANAGER', 'ANALYST']), AlertController.bulkResolve);

export { router as alertRoutes };
