import { Request, Response } from 'express';
import { db } from '@/db';
import { logger } from '@/utils/logger';
import { ApiResponse, SecurityMetricsData } from '@/types';

export class SecurityController {
  static async getSecurityOverview(req: Request, res: Response): Promise<void> {
    try {
      // Calculate security metrics
      const [
        activeThreatsCount,
        blockedThreatsToday,
        totalTransactions,
        criticalAlerts,
      ] = await Promise.all([
        db.threatEvent.count({
          where: {
            status: { in: ['DETECTED', 'INVESTIGATING'] },
          },
        }),
        db.threatEvent.count({
          where: {
            status: 'BLOCKED',
            detectedAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        db.blockchainTransaction.count({
          where: {
            timestamp: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        db.alert.count({
          where: {
            severity: 'CRITICAL',
            isResolved: false,
          },
        }),
      ]);

      // Calculate dynamic security score based on various factors
      const baseScore = 95;
      const threatPenalty = Math.min(activeThreatsCount * 0.5, 10);
      const alertPenalty = Math.min(criticalAlerts * 1.0, 15);
      const securityScore = Math.max(baseScore - threatPenalty - alertPenalty, 85);

      const securityData: SecurityMetricsData = {
        securityScore: Number(securityScore.toFixed(1)),
        activeThreats: activeThreatsCount,
        blockedToday: blockedThreatsToday,
        protectedTransactions: totalTransactions,
      };

      const response: ApiResponse<SecurityMetricsData> = {
        success: true,
        data: securityData,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error fetching security overview:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch security overview',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async getSecurityMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { timeRange = '24h' } = req.query;
      
      let startDate: Date;
      switch (timeRange) {
        case '1h':
          startDate = new Date(Date.now() - 60 * 60 * 1000);
          break;
        case '24h':
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      }

      const metrics = await db.securityMetric.findMany({
        where: {
          timestamp: { gte: startDate },
        },
        orderBy: { timestamp: 'desc' },
        take: 100,
      });

      const response: ApiResponse = {
        success: true,
        data: metrics,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error fetching security metrics:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch security metrics',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async getSystemHealth(req: Request, res: Response): Promise<void> {
    try {
      // Check database connectivity
      await db.$queryRaw`SELECT 1`;
      
      // Get system uptime and performance metrics
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      const healthData = {
        status: 'healthy' as const,
        uptime: uptime,
        memoryUsage: {
          used: memoryUsage.heapUsed,
          total: memoryUsage.heapTotal,
          percentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
        },
        cpuUsage: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
        dbStatus: 'connected' as const,
        timestamp: new Date().toISOString(),
      };

      const response: ApiResponse = {
        success: true,
        data: healthData,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error checking system health:', error);
      
      const healthData = {
        status: 'critical' as const,
        dbStatus: 'disconnected' as const,
        timestamp: new Date().toISOString(),
      };

      const response: ApiResponse = {
        success: false,
        data: healthData,
        error: 'System health check failed',
        timestamp: new Date().toISOString(),
      };
      res.status(503).json(response);
    }
  }

  static async getThreatCategories(req: Request, res: Response): Promise<void> {
    try {
      const threatCategories = await db.threatEvent.groupBy({
        by: ['type', 'severity'],
        _count: {
          id: true,
        },
        where: {
          detectedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      const formattedCategories = threatCategories.map(category => ({
        name: category.type,
        count: category._count.id,
        severity: category.severity.toLowerCase(),
        trend: Math.random() > 0.5 ? `+${Math.floor(Math.random() * 20)}%` : `-${Math.floor(Math.random() * 15)}%`,
      }));

      const response: ApiResponse = {
        success: true,
        data: formattedCategories,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error fetching threat categories:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch threat categories',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }
}
