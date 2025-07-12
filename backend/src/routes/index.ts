import { Router } from 'express';
import { authRoutes } from './auth';
import { securityRoutes } from './security';
import { threatRoutes } from './threats';
import { fraudRoutes } from './fraud';
import { blockchainRoutes } from './blockchain';
import { biometricRoutes } from './biometric';
import { alertRoutes } from './alerts';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/security', securityRoutes);
router.use('/threats', threatRoutes);
router.use('/fraud', fraudRoutes);
router.use('/blockchain', blockchainRoutes);
router.use('/biometric', biometricRoutes);
router.use('/alerts', alertRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Walmart Cybersecurity Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export { router as apiRoutes };
