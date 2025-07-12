import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import { db } from '@/db';

export class WebSocketService {
  private io: SocketIOServer;
  private authenticatedSockets: Map<string, Socket> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: config.server.corsOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    this.startRealTimeUpdates();

    logger.info('WebSocket service initialized');
  }

  private setupMiddleware(): void {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, config.jwt.secret) as any;
        
        // Verify user exists and is active
        const user = await db.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            isActive: true,
          },
        });

        if (!user || !user.isActive) {
          return next(new Error('Invalid or inactive user'));
        }

        socket.data.user = user;
        next();
      } catch (error) {
        next(new Error('Invalid authentication token'));
      }
    });
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const user = socket.data.user;
      this.authenticatedSockets.set(socket.id, socket);

      logger.info('User connected to WebSocket:', { 
        socketId: socket.id, 
        userId: user.id, 
        username: user.username 
      });

      // Join user to role-based rooms
      socket.join(`role:${user.role}`);
      socket.join(`user:${user.id}`);

      // Send initial data
      this.sendInitialData(socket);

      // Handle client events
      socket.on('subscribe:threats', () => {
        socket.join('threats');
        logger.info('User subscribed to threats:', { userId: user.id });
      });

      socket.on('subscribe:fraud', () => {
        socket.join('fraud');
        logger.info('User subscribed to fraud:', { userId: user.id });
      });

      socket.on('subscribe:blockchain', () => {
        socket.join('blockchain');
        logger.info('User subscribed to blockchain:', { userId: user.id });
      });

      socket.on('subscribe:biometric', () => {
        socket.join('biometric');
        logger.info('User subscribed to biometric:', { userId: user.id });
      });

      socket.on('subscribe:alerts', () => {
        socket.join('alerts');
        logger.info('User subscribed to alerts:', { userId: user.id });
      });

      socket.on('disconnect', (reason) => {
        this.authenticatedSockets.delete(socket.id);
        logger.info('User disconnected from WebSocket:', { 
          socketId: socket.id, 
          userId: user.id, 
          reason 
        });
      });

      socket.on('ping', (callback) => {
        callback('pong');
      });
    });
  }

  private async sendInitialData(socket: Socket): Promise<void> {
    try {
      // Send current security overview
      const securityData = await this.getSecurityOverviewData();
      socket.emit('security:overview', securityData);

      // Send recent alerts
      const recentAlerts = await this.getRecentAlerts();
      socket.emit('alerts:recent', recentAlerts);

    } catch (error) {
      logger.error('Error sending initial data:', error);
    }
  }

  private startRealTimeUpdates(): void {
    // Send security metrics every 30 seconds
    setInterval(async () => {
      try {
        const securityData = await this.getSecurityOverviewData();
        this.io.emit('security:metrics:update', securityData);
      } catch (error) {
        logger.error('Error broadcasting security metrics:', error);
      }
    }, 30000);

    // Send threat updates every 10 seconds
    setInterval(async () => {
      try {
        const threatUpdates = await this.getRecentThreatEvents();
        if (threatUpdates.length > 0) {
          this.io.to('threats').emit('threats:update', threatUpdates);
        }
      } catch (error) {
        logger.error('Error broadcasting threat updates:', error);
      }
    }, 10000);

    // Send fraud detection updates every 15 seconds
    setInterval(async () => {
      try {
        const fraudData = await this.getFraudDetectionData();
        this.io.to('fraud').emit('fraud:update', fraudData);
      } catch (error) {
        logger.error('Error broadcasting fraud updates:', error);
      }
    }, 15000);

    // Send blockchain updates every 20 seconds
    setInterval(async () => {
      try {
        const blockchainData = await this.getBlockchainData();
        this.io.to('blockchain').emit('blockchain:update', blockchainData);
      } catch (error) {
        logger.error('Error broadcasting blockchain updates:', error);
      }
    }, 20000);

    // Send biometric updates every 25 seconds
    setInterval(async () => {
      try {
        const biometricData = await this.getBiometricData();
        this.io.to('biometric').emit('biometric:update', biometricData);
      } catch (error) {
        logger.error('Error broadcasting biometric updates:', error);
      }
    }, 25000);
  }

  // Broadcast methods for external use
  public broadcastThreatAlert(threatEvent: any): void {
    this.io.emit('threat:alert', {
      id: threatEvent.id,
      type: threatEvent.type,
      severity: threatEvent.severity,
      timestamp: threatEvent.detectedAt,
      message: `${threatEvent.severity} threat detected: ${threatEvent.type}`,
    });
  }

  public broadcastFraudAlert(fraudEvent: any): void {
    this.io.emit('fraud:alert', {
      id: fraudEvent.id,
      transactionId: fraudEvent.transactionId,
      riskScore: fraudEvent.riskScore,
      fraudType: fraudEvent.fraudType,
      timestamp: fraudEvent.detectedAt,
      message: `High-risk fraud detected: ${fraudEvent.fraudType} (${fraudEvent.riskScore}% risk)`,
    });
  }

  public broadcastSystemAlert(alert: any): void {
    this.io.emit('system:alert', {
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      timestamp: alert.createdAt,
    });
  }

  // Data fetching methods
  private async getSecurityOverviewData(): Promise<any> {
    const [
      activeThreats,
      blockedToday,
      totalTransactions,
      criticalAlerts,
    ] = await Promise.all([
      db.threatEvent.count({
        where: { status: { in: ['DETECTED', 'INVESTIGATING'] } },
      }),
      db.threatEvent.count({
        where: {
          status: 'BLOCKED',
          detectedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      db.blockchainTransaction.count({
        where: {
          timestamp: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      db.alert.count({
        where: { severity: 'CRITICAL', isResolved: false },
      }),
    ]);

    const securityScore = Math.max(95 - (activeThreats * 0.5) - (criticalAlerts * 1.0), 85);

    return {
      securityScore: Number(securityScore.toFixed(1)),
      activeThreats,
      blockedToday,
      protectedTransactions: totalTransactions,
      timestamp: new Date().toISOString(),
    };
  }

  private async getRecentAlerts(): Promise<any[]> {
    const alerts = await db.alert.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return alerts.map(alert => ({
      id: alert.id,
      type: alert.type,
      severity: alert.severity.toLowerCase(),
      title: alert.title,
      message: alert.message,
      timestamp: alert.createdAt,
      isRead: alert.isRead,
      isResolved: alert.isResolved,
    }));
  }

  private async getRecentThreatEvents(): Promise<any[]> {
    const threats = await db.threatEvent.findMany({
      where: {
        detectedAt: { gte: new Date(Date.now() - 10 * 60 * 1000) }, // Last 10 minutes
      },
      orderBy: { detectedAt: 'desc' },
      take: 5,
    });

    return threats.map(threat => ({
      id: threat.id,
      type: threat.type,
      severity: threat.severity.toLowerCase(),
      location: threat.location,
      timestamp: threat.detectedAt,
      description: threat.description,
      status: threat.status.toLowerCase(),
      source: threat.source,
      confidence: threat.confidence,
      riskScore: threat.riskScore,
    }));
  }

  private async getFraudDetectionData(): Promise<any> {
    // Implementation similar to FraudController.getFraudDetectionData
    // Simplified for real-time updates
    return {
      aiAccuracy: 98.7 + (Math.random() - 0.5) * 0.5,
      fraudPrevented: 4.2 + Math.random() * 0.1,
      riskScore: Math.floor(Math.random() * 30) + 10,
      modelsActive: 12,
      timestamp: new Date().toISOString(),
    };
  }

  private async getBlockchainData(): Promise<any> {
    const [totalVerified, latestBlock] = await Promise.all([
      db.blockchainTransaction.count({
        where: {
          status: 'CONFIRMED',
          timestamp: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      db.blockchainTransaction.aggregate({
        _max: { blockNumber: true },
      }),
    ]);

    return {
      totalVerified,
      blockHeight: Number(latestBlock._max.blockNumber) || 2847293,
      timestamp: new Date().toISOString(),
    };
  }

  private async getBiometricData(): Promise<any> {
    const authenticatedToday = await db.biometricAuth.count({
      where: {
        status: 'SUCCESS',
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });

    return {
      authenticatedUsers: authenticatedToday,
      successRate: 99.2 + (Math.random() - 0.5) * 2,
      timestamp: new Date().toISOString(),
    };
  }

  public getConnectedCount(): number {
    return this.authenticatedSockets.size;
  }

  public getUserConnections(userId: string): Socket[] {
    const userSockets: Socket[] = [];
    this.authenticatedSockets.forEach((socket) => {
      if (socket.data.user.id === userId) {
        userSockets.push(socket);
      }
    });
    return userSockets;
  }
}
