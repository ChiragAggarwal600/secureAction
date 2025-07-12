import { Request, Response } from 'express';
import { db } from '@/db';
import { logger } from '@/utils/logger';
import { ApiResponse, AlertData } from '@/types';

export class AlertController {
  static async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 10, 
        severity, 
        isRead,
        isResolved,
        timeRange = '24h' 
      } = req.query;

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;

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
        default:
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      }

      const whereClause: any = {
        createdAt: { gte: startDate },
      };

      if (severity) {
        whereClause.severity = String(severity).toUpperCase();
      }

      if (isRead !== undefined) {
        whereClause.isRead = isRead === 'true';
      }

      if (isResolved !== undefined) {
        whereClause.isResolved = isResolved === 'true';
      }

      const [alerts, totalCount] = await Promise.all([
        db.alert.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limitNum,
          include: {
            threatEvent: {
              select: {
                type: true,
                sourceIp: true,
                targetIp: true,
              },
            },
          },
        }),
        db.alert.count({ where: whereClause }),
      ]);

      const formattedAlerts: AlertData[] = alerts.map(alert => ({
        id: alert.id,
        type: alert.type,
        severity: alert.severity.toLowerCase() as any,
        title: alert.title,
        message: alert.message,
        timestamp: alert.createdAt,
        isRead: alert.isRead,
        isResolved: alert.isResolved,
      }));

      const response: ApiResponse = {
        success: true,
        data: formattedAlerts,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error fetching alerts:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch alerts',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async createAlert(req: Request, res: Response): Promise<void> {
    try {
      const {
        threatEventId,
        userId,
        type,
        severity,
        title,
        message,
        metadata,
      } = req.body;

      const alert = await db.alert.create({
        data: {
          threatEventId,
          userId,
          type: type.toUpperCase(),
          severity: severity.toUpperCase(),
          title,
          message,
          // metadata,
        },
      });

      logger.info('Alert created:', { alertId: alert.id, type, severity, title });

      const response: ApiResponse = {
        success: true,
        data: alert,
        message: 'Alert created successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error: any) {
      logger.error('Error creating alert:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create alert',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const updatedAlert = await db.alert.update({
        where: { id },
        data: { isRead: true },
      });

      logger.info('Alert marked as read:', { alertId: id });

      const response: ApiResponse = {
        success: true,
        data: updatedAlert,
        message: 'Alert marked as read',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error marking alert as read:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to mark alert as read',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async markAsResolved(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { resolution } = req.body;

      const updatedAlert = await db.alert.update({
        where: { id },
        data: { 
          isResolved: true,
          resolvedAt: new Date(),
          // metadata: {
          //   resolution,
          //   resolvedBy: req.body.resolvedBy || 'system',
          // },
        },
      });

      logger.info('Alert resolved:', { alertId: id, resolution });

      const response: ApiResponse = {
        success: true,
        data: updatedAlert,
        message: 'Alert resolved successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error resolving alert:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to resolve alert',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async getAlertStats(req: Request, res: Response): Promise<void> {
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

      const [
        totalAlerts,
        unreadAlerts,
        unresolvedAlerts,
        criticalAlerts,
        severityBreakdown,
        typeBreakdown,
      ] = await Promise.all([
        db.alert.count({
          where: { createdAt: { gte: startDate } },
        }),
        db.alert.count({
          where: { 
            createdAt: { gte: startDate },
            isRead: false,
          },
        }),
        db.alert.count({
          where: { 
            createdAt: { gte: startDate },
            isResolved: false,
          },
        }),
        db.alert.count({
          where: { 
            createdAt: { gte: startDate },
            severity: 'CRITICAL',
          },
        }),
        db.alert.groupBy({
          by: ['severity'],
          _count: { id: true },
          where: { createdAt: { gte: startDate } },
        }),
        db.alert.groupBy({
          by: ['type'],
          _count: { id: true },
          where: { createdAt: { gte: startDate } },
        }),
      ]);

      const stats = {
        total: totalAlerts,
        unread: unreadAlerts,
        unresolved: unresolvedAlerts,
        critical: criticalAlerts,
        readRate: totalAlerts > 0 ? ((totalAlerts - unreadAlerts) / totalAlerts) * 100 : 0,
        resolutionRate: totalAlerts > 0 ? ((totalAlerts - unresolvedAlerts) / totalAlerts) * 100 : 0,
        severityBreakdown: severityBreakdown.reduce((acc: any, item: any) => {
          acc[item.severity.toLowerCase()] = item._count.id;
          return acc;
        }, {}),
        typeBreakdown: typeBreakdown.reduce((acc: any, item: any) => {
          acc[item.type.toLowerCase()] = item._count.id;
          return acc;
        }, {}),
      };

      const response: ApiResponse = {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error fetching alert stats:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch alert stats',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async bulkMarkAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { alertIds } = req.body;

      if (!Array.isArray(alertIds) || alertIds.length === 0) {
        const response: ApiResponse = {
          success: false,
          error: 'Alert IDs array is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const updateResult = await db.alert.updateMany({
        where: { id: { in: alertIds } },
        data: { isRead: true },
      });

      logger.info('Bulk alerts marked as read:', { count: updateResult.count, alertIds });

      const response: ApiResponse = {
        success: true,
        data: { updatedCount: updateResult.count },
        message: `${updateResult.count} alerts marked as read`,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error bulk marking alerts as read:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to mark alerts as read',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async bulkResolve(req: Request, res: Response): Promise<void> {
    try {
      const { alertIds, resolution } = req.body;

      if (!Array.isArray(alertIds) || alertIds.length === 0) {
        const response: ApiResponse = {
          success: false,
          error: 'Alert IDs array is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const updateResult = await db.alert.updateMany({
        where: { id: { in: alertIds } },
        data: { 
          isResolved: true,
          resolvedAt: new Date(),
        },
      });

      logger.info('Bulk alerts resolved:', { count: updateResult.count, alertIds, resolution });

      const response: ApiResponse = {
        success: true,
        data: { updatedCount: updateResult.count },
        message: `${updateResult.count} alerts resolved`,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error bulk resolving alerts:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to resolve alerts',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }
}
