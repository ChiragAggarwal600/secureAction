import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './utils/logger';
import { db } from './db';
import { apiRoutes } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { WebSocketService } from './services/websocketService';

class Server {
  private app: express.Application;
  private httpServer: any;
  private wsService!: WebSocketService;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.server.corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Compression
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: {
        success: false,
        error: 'Too many requests from this IP, please try again later',
        timestamp: new Date().toISOString(),
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        query: req.query,
      });
      next();
    });

    // Trust proxy (for proper IP addresses when behind reverse proxy)
    this.app.set('trust proxy', 1);
  }

  private setupRoutes(): void {
    // API routes
    this.app.use('/api', apiRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Walmart Cybersecurity Dashboard API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/api/health',
          auth: '/api/auth',
          security: '/api/security',
          threats: '/api/threats',
          fraud: '/api/fraud',
          blockchain: '/api/blockchain',
          biometric: '/api/biometric',
          alerts: '/api/alerts',
        },
      });
    });
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);

    // Graceful shutdown handling
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      this.gracefulShutdown();
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', { promise, reason });
      this.gracefulShutdown();
    });
  }

  private async connectDatabase(): Promise<void> {
    try {
      await db.$connect();
      logger.info('Database connected successfully');
      
      // Test database connection
      await db.$queryRaw`SELECT 1`;
      logger.info('Database connection verified');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  private setupWebSocket(): void {
    this.wsService = new WebSocketService(this.httpServer);
    logger.info('WebSocket service initialized');
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await this.connectDatabase();

      // Setup WebSocket service
      this.setupWebSocket();

      // Start HTTP server
      this.httpServer.listen(config.server.port, () => {
        logger.info(`🚀 Server running on port ${config.server.port} in ${config.server.env} mode`);
        logger.info(`📡 API available at http://localhost:${config.server.port}/api`);
        logger.info(`🔌 WebSocket available at ws://localhost:${config.server.port}`);
        logger.info(`🔒 CORS origin: ${config.server.corsOrigin}`);
      });

      // Log server stats every 5 minutes
      setInterval(() => {
        const memoryUsage = process.memoryUsage();
        const uptime = process.uptime();
        const wsConnections = this.wsService.getConnectedCount();
        
        logger.info('Server stats:', {
          uptime: `${Math.floor(uptime / 60)} minutes`,
          memoryUsage: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          wsConnections,
        });
      }, 5 * 60 * 1000);

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(): Promise<void> {
    logger.info('Starting graceful shutdown...');

    try {
      // Close HTTP server
      this.httpServer.close(() => {
        logger.info('HTTP server closed');
      });

      // Disconnect from database
      await db.$disconnect();
      logger.info('Database disconnected');

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  public getApp(): express.Application {
    return this.app;
  }

  public getHttpServer(): any {
    return this.httpServer;
  }

  public getWebSocketService(): WebSocketService {
    return this.wsService;
  }
}

// Create and export server instance
const server = new Server();

// Start the server if this file is run directly
if (require.main === module) {
  server.start().catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
}

export { server };
