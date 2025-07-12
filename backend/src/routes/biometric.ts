import { Router } from 'express';
import { BiometricController } from '@/controllers/biometricController';
import { authenticateToken, requireRole } from '@/middleware/auth';

const router = Router();

// All biometric routes require authentication
router.use(authenticateToken);

router.get('/data', BiometricController.getBiometricData);
router.get('/stats', BiometricController.getBiometricStats);
router.get('/history/:userId', BiometricController.getBiometricHistory);
router.post('/enroll', requireRole(['ADMIN', 'SECURITY_MANAGER']), BiometricController.enrollBiometric);
router.post('/authenticate', BiometricController.authenticateBiometric);

export { router as biometricRoutes };
