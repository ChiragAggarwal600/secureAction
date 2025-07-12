import { Router } from 'express';
import { BlockchainController } from '@/controllers/blockchainController';
import { authenticateToken, requireRole } from '@/middleware/auth';

const router = Router();

// All blockchain routes require authentication
router.use(authenticateToken);

router.get('/data', BlockchainController.getBlockchainData);
router.get('/transactions', BlockchainController.getTransactions);
router.get('/stats', BlockchainController.getBlockchainStats);
router.post('/transactions', requireRole(['ADMIN', 'SECURITY_MANAGER']), BlockchainController.createTransaction);
router.post('/transactions/:id/verify', requireRole(['ADMIN', 'SECURITY_MANAGER']), BlockchainController.verifyTransaction);

export { router as blockchainRoutes };
