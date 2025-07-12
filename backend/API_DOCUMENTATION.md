# Walmart Cybersecurity Dashboard - Backend API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All API endpoints (except authentication endpoints) require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Default User Accounts
- **Admin**: `admin@walmart.com` / `admin123!`
- **Security Manager**: `security.manager@walmart.com` / `manager123!`
- **Analyst**: `analyst@walmart.com` / `analyst123!`

## API Endpoints

### Authentication
#### POST /auth/login
Login and get JWT token
```json
{
  "email": "admin@walmart.com",
  "password": "admin123!"
}
```

#### POST /auth/refresh
Refresh JWT token using refresh token
```json
{
  "refreshToken": "<refresh_token>"
}
```

#### POST /auth/logout
Logout and invalidate session

### Security Overview
#### GET /security/overview
Get security dashboard overview metrics
- Returns: Security score, active threats, blocked items, protected transactions

#### GET /security/metrics
Get detailed security metrics
- Query params: `category`, `period`

### Threat Intelligence
#### GET /threats
Get threat events list
- Query params: `page`, `limit`, `severity`, `status`, `type`

#### POST /threats
Create a new threat event
```json
{
  "type": "SQL Injection",
  "severity": "HIGH",
  "title": "SQL Injection Detected",
  "description": "Malicious SQL injection attempt",
  "sourceIp": "192.168.1.100",
  "targetIp": "10.0.0.1",
  "location": "Unknown",
  "source": "Web Application",
  "confidence": 95.5,
  "riskScore": 85
}
```

#### GET /threats/:id
Get specific threat event details

#### PUT /threats/:id/status
Update threat status
```json
{
  "status": "RESOLVED"
}
```

### Fraud Protection
#### GET /fraud/events
Get fraud events list
- Query params: `page`, `limit`, `status`, `fraudType`

#### POST /fraud/events
Create a new fraud event

#### GET /fraud/events/:id
Get specific fraud event details

#### PUT /fraud/events/:id/review
Review fraud event
```json
{
  "status": "APPROVED",
  "notes": "Reviewed and approved"
}
```

#### GET /fraud/stats
Get fraud detection statistics

### Blockchain Security
#### GET /blockchain/transactions
Get blockchain transactions list
- Query params: `page`, `limit`, `status`

#### POST /blockchain/transactions
Create new blockchain transaction

#### GET /blockchain/transactions/:id
Get specific transaction details

#### POST /blockchain/verify/:id
Verify a blockchain transaction

#### GET /blockchain/stats
Get blockchain security statistics

### Biometric Authentication
#### GET /biometric/data
Get biometric authentication data and statistics

#### POST /biometric/enroll
Enroll new biometric data (Admin/Security Manager only)
```json
{
  "userId": "user_id",
  "biometricType": "FINGERPRINT",
  "templateData": "encrypted_template_data"
}
```

#### POST /biometric/authenticate
Authenticate using biometric data
```json
{
  "biometricType": "FINGERPRINT",
  "templateData": "encrypted_template_data",
  "deviceInfo": "device_fingerprint"
}
```

#### GET /biometric/stats
Get biometric authentication statistics

#### GET /biometric/history/:userId
Get biometric authentication history for a user

### Alerts Management
#### GET /alerts
Get alerts list
- Query params: `page`, `limit`, `severity`, `type`, `unread`

#### POST /alerts
Create new alert
```json
{
  "type": "SECURITY_BREACH",
  "severity": "CRITICAL",
  "title": "Security Breach Detected",
  "message": "Unauthorized access attempt detected"
}
```

#### PUT /alerts/:id/read
Mark alert as read

#### PUT /alerts/:id/resolve
Resolve an alert
```json
{
  "resolutionNotes": "Issue resolved by updating firewall rules"
}
```

#### DELETE /alerts/:id
Delete an alert (Admin only)

## WebSocket Events

Connect to WebSocket at `ws://localhost:3001`

### Client Events
- `join_room`: Join a specific room for updates
- `threat_update`: Subscribe to threat updates
- `fraud_update`: Subscribe to fraud updates

### Server Events
- `new_threat`: New threat detected
- `threat_status_update`: Threat status changed
- `new_fraud_event`: New fraud event detected
- `security_alert`: Security alert notification
- `biometric_auth`: Biometric authentication event

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "timestamp": "2025-07-12T12:22:33.572Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-07-12T12:22:33.572Z"
}
```

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting
- Standard endpoints: 100 requests per minute
- Authentication endpoints: 10 requests per minute
- Heavy endpoints (exports, reports): 10 requests per minute

## CORS
The API accepts requests from `http://localhost:3000` (Frontend development server)

## Database
- **Type**: SQLite (Development) / PostgreSQL (Production)
- **ORM**: Prisma
- **Migrations**: Run `npm run db:migrate` to apply schema changes
- **Seeding**: Run `npm run db:seed` to populate with sample data
