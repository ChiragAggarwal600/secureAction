import { Request, Response } from 'express';
import { db } from '@/db';
import { logger } from '@/utils/logger';
import { ApiResponse, ThreatEventData } from '@/types';

export class ThreatController {
  static async getThreatEvents(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 10, 
        severity, 
        status, 
        timeRange = '24h' 
      } = req.query;

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;

      // Calculate time range
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
        detectedAt: { gte: startDate },
      };

      if (severity) {
        whereClause.severity = severity;
      }

      if (status) {
        whereClause.status = status;
      }

      const [threats, totalCount] = await Promise.all([
        db.threatEvent.findMany({
          where: whereClause,
          orderBy: { detectedAt: 'desc' },
          skip: offset,
          take: limitNum,
        }),
        db.threatEvent.count({ where: whereClause }),
      ]);

      const formattedThreats: ThreatEventData[] = threats.map(threat => ({
        id: threat.id,
        type: threat.type,
        severity: threat.severity.toLowerCase() as any,
        location: threat.location || 'Unknown',
        timestamp: threat.detectedAt,
        description: threat.description,
        status: ThreatController.mapThreatStatus(threat.status),
        source: threat.source,
        confidence: threat.confidence,
        riskScore: threat.riskScore,
      }));

      const response: ApiResponse = {
        success: true,
        data: formattedThreats,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error fetching threat events:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch threat events',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async createThreatEvent(req: Request, res: Response): Promise<void> {
    try {
      const {
        type,
        severity,
        title,
        description,
        sourceIp,
        targetIp,
        location,
        source,
        confidence,
        riskScore,
        metadata,
      } = req.body;

      const threat = await db.threatEvent.create({
        data: {
          type,
          severity: severity.toUpperCase(),
          title,
          description,
          sourceIp,
          targetIp,
          location,
          source,
          confidence: parseFloat(confidence),
          riskScore: parseInt(riskScore, 10),
          // metadata,
        },
      });

      // Create alert for high severity threats
      if (severity.toUpperCase() === 'CRITICAL' || severity.toUpperCase() === 'HIGH') {
        await db.alert.create({
          data: {
            threatEventId: threat.id,
            type: 'SECURITY_BREACH',
            severity: severity.toUpperCase(),
            title: `${severity.toUpperCase()} Threat Detected`,
            message: `${type}: ${description}`,
          },
        });
      }

      logger.info('Threat event created:', { threatId: threat.id, type, severity });

      const response: ApiResponse = {
        success: true,
        data: threat,
        message: 'Threat event created successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error: any) {
      logger.error('Error creating threat event:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create threat event',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async updateThreatStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      const updatedThreat = await db.threatEvent.update({
        where: { id },
        data: {
          status: status.toUpperCase(),
          resolvedAt: status.toUpperCase() === 'RESOLVED' ? new Date() : null,
        },
      });

      // Update related alerts
      await db.alert.updateMany({
        where: { threatEventId: id },
        data: {
          isResolved: status.toUpperCase() === 'RESOLVED',
          resolvedAt: status.toUpperCase() === 'RESOLVED' ? new Date() : null,
        },
      });

      logger.info('Threat status updated:', { threatId: id, status, reason });

      const response: ApiResponse = {
        success: true,
        data: updatedThreat,
        message: 'Threat status updated successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error updating threat status:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update threat status',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async getThreatStatistics(req: Request, res: Response): Promise<void> {
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
        totalThreats,
        blockedThreats,
        investigatingThreats,
        resolvedThreats,
        severityBreakdown,
        threatsByType,
      ] = await Promise.all([
        db.threatEvent.count({
          where: { detectedAt: { gte: startDate } },
        }),
        db.threatEvent.count({
          where: { 
            detectedAt: { gte: startDate },
            status: 'BLOCKED',
          },
        }),
        db.threatEvent.count({
          where: { 
            detectedAt: { gte: startDate },
            status: 'INVESTIGATING',
          },
        }),
        db.threatEvent.count({
          where: { 
            detectedAt: { gte: startDate },
            status: 'RESOLVED',
          },
        }),
        db.threatEvent.groupBy({
          by: ['severity'],
          _count: { id: true },
          where: { detectedAt: { gte: startDate } },
        }),
        db.threatEvent.groupBy({
          by: ['type'],
          _count: { id: true },
          where: { detectedAt: { gte: startDate } },
          orderBy: { _count: { id: 'desc' } },
          take: 10,
        }),
      ]);

      const statistics = {
        total: totalThreats,
        blocked: blockedThreats,
        investigating: investigatingThreats,
        resolved: resolvedThreats,
        blockRate: totalThreats > 0 ? (blockedThreats / totalThreats) * 100 : 0,
        resolutionRate: totalThreats > 0 ? (resolvedThreats / totalThreats) * 100 : 0,
        severityBreakdown: severityBreakdown.reduce((acc: any, item: any) => {
          acc[item.severity.toLowerCase()] = item._count.id;
          return acc;
        }, {}),
        topThreatTypes: (threatsByType as any[]).map((item: any) => ({
          type: item.type,
          count: item._count.id,
        })),
      };

      const response: ApiResponse = {
        success: true,
        data: statistics,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error fetching threat statistics:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch threat statistics',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  private static mapThreatStatus(status: string): 'blocked' | 'investigating' | 'resolved' {
    switch (status) {
      case 'BLOCKED':
        return 'blocked';
      case 'INVESTIGATING':
        return 'investigating';
      case 'RESOLVED':
        return 'resolved';
      default:
        return 'investigating';
    }
  }
}
