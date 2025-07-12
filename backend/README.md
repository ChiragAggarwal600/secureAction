# Walmart Cybersecurity Dashboard Backend

A production-ready Node.js backend for the Walmart Cybersecurity Dashboard, built with TypeScript, Express, Prisma, and SQLite (development).

## ✅ Current Status

🚀 **FULLY OPERATIONAL** - Backend is running and all endpoints are working correctly!

- ✅ Database: SQLite with Prisma ORM
- ✅ Authentication: JWT with role-based access control
- ✅ API Endpoints: All security modules implemented
- ✅ WebSocket: Real-time updates configured
- ✅ Sample Data: Database seeded with test data
- ✅ Server: Running on http://localhost:3001

**Default Test Accounts:**
- Admin: `admin@walmart.com` / `admin123!`
- Security Manager: `security.manager@walmart.com` / `manager123!`
- Analyst: `analyst@walmart.com` / `analyst123!`

## Features

### 🔐 Security & Authentication
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Biometric authentication support
- Session management
- Rate limiting and security headers

### 🛡️ Cybersecurity Modules
- **Threat Intelligence**: Real-time threat detection and monitoring
- **Fraud Protection**: AI-powered fraud detection with ML models
- **Blockchain Security**: Transaction verification and monitoring
- **Zero Trust**: Access control policies and verification
- **Alert System**: Real-time security alerts and notifications

### 🚀 Real-time Features
- WebSocket connections for live updates
- Real-time security metrics
- Live threat monitoring
- Instant fraud detection alerts
- Biometric authentication status

### 🏗️ Production Ready
- Comprehensive error handling
- Structured logging with Winston
- Database migrations with Prisma
- Docker containerization
- Health check endpoints
- Graceful shutdown handling

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Validation**: Zod
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- npm or pnpm

### Installation

1. **Clone and setup**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Using Docker

1. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec backend npm run db:migrate
   docker-compose exec backend npm run db:seed
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token

### Security Overview
- `GET /api/security/overview` - Security dashboard data
- `GET /api/security/metrics` - Security metrics
- `GET /api/security/health` - System health check

### Threat Intelligence
- `GET /api/threats` - List threat events
- `POST /api/threats` - Create threat event
- `PATCH /api/threats/:id/status` - Update threat status
- `GET /api/threats/statistics` - Threat statistics

### Fraud Detection
- `GET /api/fraud/detection-data` - Fraud detection metrics
- `GET /api/fraud/events` - List fraud events
- `POST /api/fraud/events` - Create fraud event
- `PATCH /api/fraud/events/:id/status` - Update fraud status

### Blockchain Security
- `GET /api/blockchain/data` - Blockchain overview
- `GET /api/blockchain/transactions` - List transactions
- `POST /api/blockchain/transactions` - Create transaction
- `POST /api/blockchain/transactions/:id/verify` - Verify transaction

### Biometric Authentication
- `GET /api/biometric/data` - Biometric overview
- `POST /api/biometric/enroll` - Enroll biometric
- `POST /api/biometric/authenticate` - Authenticate biometric
- `GET /api/biometric/history/:userId` - Authentication history

### Alerts
- `GET /api/alerts` - List alerts
- `POST /api/alerts` - Create alert
- `PATCH /api/alerts/:id/read` - Mark as read
- `PATCH /api/alerts/:id/resolve` - Resolve alert

## WebSocket Events

### Client → Server
- `subscribe:threats` - Subscribe to threat updates
- `subscribe:fraud` - Subscribe to fraud updates
- `subscribe:blockchain` - Subscribe to blockchain updates
- `subscribe:biometric` - Subscribe to biometric updates
- `subscribe:alerts` - Subscribe to alert updates

### Server → Client
- `security:overview` - Security overview data
- `threats:update` - Real-time threat updates
- `fraud:update` - Real-time fraud updates
- `blockchain:update` - Real-time blockchain updates
- `biometric:update` - Real-time biometric updates
- `alerts:recent` - Recent alerts
- `threat:alert` - Critical threat alert
- `fraud:alert` - High-risk fraud alert
- `system:alert` - System alert

## Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Authentication and user management
- **ThreatEvents**: Security threat tracking
- **FraudEvents**: Fraud detection and monitoring
- **BlockchainTransactions**: Blockchain transaction verification
- **BiometricData**: Biometric authentication data
- **Alerts**: Security alerts and notifications
- **AuditLogs**: System audit trails
- **AccessPolicies**: Zero trust access control

## Security Features

### Authentication & Authorization
- JWT tokens with configurable expiration
- Refresh token rotation
- Role-based access control (Admin, Security Manager, Analyst, Viewer)
- Session management with Redis

### API Security
- Rate limiting (configurable per endpoint)
- CORS protection
- Helmet security headers
- Input validation with Zod
- SQL injection prevention with Prisma

### Data Protection
- Bcrypt password hashing
- Encrypted biometric templates
- Audit logging for all operations
- Secure session storage

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level | `info` |

### Default Users (After Seeding)

| Role | Email | Password |
|------|--------|----------|
| Admin | admin@walmart.com | admin123! |
| Security Manager | security.manager@walmart.com | manager123! |
| Analyst | analyst@walmart.com | analyst123! |

## Development

### Project Structure
```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── db/            # Database connection
├── middleware/    # Express middleware
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript types
├── utils/         # Utility functions
├── scripts/       # Database scripts
└── index.ts       # Application entry point
```

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:generate` - Generate Prisma client
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Adding New Features

1. **Create database model** in `prisma/schema.prisma`
2. **Generate migration** with `npm run db:migrate`
3. **Create controller** in `src/controllers/`
4. **Add routes** in `src/routes/`
5. **Update types** in `src/types/`
6. **Add WebSocket events** in `src/services/websocketService.ts`

## Deployment

### Production Deployment

1. **Environment setup**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export DATABASE_URL="your-production-db-url"
   export JWT_SECRET="your-production-jwt-secret"
   ```

2. **Build and deploy**
   ```bash
   npm run build
   npm run db:deploy
   npm start
   ```

### Docker Deployment

```bash
# Build and start services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

### Health Monitoring

The application provides health check endpoints:
- `GET /api/health` - Basic health check
- `GET /api/security/health` - Detailed system health

## Monitoring & Logging

### Logging
- Structured JSON logging with Winston
- Configurable log levels
- Separate error logging
- Request/response logging
- Audit trail logging

### Metrics
- Real-time security metrics
- Performance monitoring
- Database query performance
- WebSocket connection metrics

## Support

For technical support or questions about the Walmart Cybersecurity Dashboard backend:

1. Check the logs in `logs/app.log`
2. Verify database connectivity
3. Check environment configuration
4. Review API documentation

## License

This project is proprietary software developed for Walmart's cybersecurity infrastructure.

---

Built with ❤️ for Walmart's Cybersecurity Team
