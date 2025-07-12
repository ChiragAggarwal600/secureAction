import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('Starting database seeding...');

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123!', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@walmart.com' },
      update: {},
      create: {
        email: 'admin@walmart.com',
        username: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        department: 'Cybersecurity',
        passwordHash: adminPassword,
      },
    });

    // Create security manager
    const managerPassword = await bcrypt.hash('manager123!', 12);
    const manager = await prisma.user.upsert({
      where: { email: 'security.manager@walmart.com' },
      update: {},
      create: {
        email: 'security.manager@walmart.com',
        username: 'security_manager',
        firstName: 'Security',
        lastName: 'Manager',
        role: 'SECURITY_MANAGER',
        department: 'Cybersecurity',
        passwordHash: managerPassword,
      },
    });

    // Create analyst user
    const analystPassword = await bcrypt.hash('analyst123!', 12);
    const analyst = await prisma.user.upsert({
      where: { email: 'analyst@walmart.com' },
      update: {},
      create: {
        email: 'analyst@walmart.com',
        username: 'security_analyst',
        firstName: 'Security',
        lastName: 'Analyst',
        role: 'ANALYST',
        department: 'Cybersecurity',
        passwordHash: analystPassword,
      },
    });

    logger.info('Created users:', { admin: admin.id, manager: manager.id, analyst: analyst.id });

    // Create sample threat events
    const threatEvents = await Promise.all([
      prisma.threatEvent.create({
        data: {
          type: 'SQL Injection Attack',
          severity: 'HIGH',
          title: 'SQL Injection Attempt Detected',
          description: 'Malicious SQL injection attempt blocked on payment processing endpoint',
          sourceIp: '192.168.1.100',
          targetIp: '10.0.0.50',
          location: 'Bentonville, AR',
          source: 'Walmart.com',
          status: 'BLOCKED',
          confidence: 95.5,
          riskScore: 85,
          metadataJson: JSON.stringify({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            endpoint: '/api/payments/process',
            payload: 'SELECT * FROM users WHERE id = 1 OR 1=1',
          }),
        },
      }),
      prisma.threatEvent.create({
        data: {
          type: 'DDoS Amplification',
          severity: 'CRITICAL',
          title: 'DDoS Attack Detected',
          description: 'Large-scale DDoS attack targeting main website infrastructure',
          sourceIp: '203.0.113.0',
          targetIp: '10.0.0.10',
          location: 'San Bruno, CA',
          source: 'CDN Edge Servers',
          status: 'INVESTIGATING',
          confidence: 98.2,
          riskScore: 95,
          metadataJson: JSON.stringify({
            requestsPerSecond: 50000,
            attackType: 'UDP Amplification',
            mitigationActive: true,
          }),
        },
      }),
      prisma.threatEvent.create({
        data: {
          type: 'Credential Stuffing',
          severity: 'MEDIUM',
          title: 'Credential Stuffing Attack',
          description: 'Automated login attempts using compromised credentials',
          sourceIp: '198.51.100.0',
          targetIp: '10.0.0.25',
          location: 'Austin, TX',
          source: 'Mobile App',
          status: 'BLOCKED',
          confidence: 92.1,
          riskScore: 70,
          metadataJson: JSON.stringify({
            attemptedLogins: 1250,
            timeWindow: '5 minutes',
            accountsTargeted: 150,
          }),
        },
      }),
    ]);

    logger.info('Created threat events:', threatEvents.length);

    // Create sample fraud events
    const fraudEvents = await Promise.all([
      prisma.fraudEvent.create({
        data: {
          transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9),
          userId: analyst.id,
          amount: 2599.99,
          currency: 'USD',
          merchantId: 'WALMART_ONLINE',
          merchantName: 'Walmart.com',
          riskScore: 85.5,
          fraudType: 'STOLEN_CARD',
          status: 'BLOCKED',
          reasonsJson: JSON.stringify(['Unusual location', 'High amount', 'Velocity check failed']),
          location: 'Miami, FL',
          deviceFingerprint: 'fp_' + Math.random().toString(36).substr(2, 16),
          ipAddress: '172.16.0.100',
          metadataJson: JSON.stringify({
            cardType: 'VISA',
            lastFourDigits: '4532',
            previousTransactionLocation: 'Bentonville, AR',
            timeSinceLastTransaction: '2 hours',
          }),
        },
      }),
      prisma.fraudEvent.create({
        data: {
          transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9),
          amount: 899.99,
          currency: 'USD',
          merchantId: 'WALMART_STORE_1001',
          merchantName: 'Walmart Supercenter #1001',
          riskScore: 45.2,
          fraudType: 'ACCOUNT_TAKEOVER',
          status: 'REVIEWING',
          reasonsJson: JSON.stringify(['New device', 'Unusual purchase pattern']),
          location: 'Dallas, TX',
          deviceFingerprint: 'fp_' + Math.random().toString(36).substr(2, 16),
          ipAddress: '10.1.0.50',
          metadataJson: JSON.stringify({
            paymentMethod: 'Walmart Pay',
            accountAge: '3 years',
            deviceTrust: 'low',
          }),
        },
      }),
    ]);

    logger.info('Created fraud events:', fraudEvents.length);

    // Create sample blockchain transactions
    const blockchainTransactions = await Promise.all([
      prisma.blockchainTransaction.create({
        data: {
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          blockNumber: 2847293,
          blockHash: '0x' + Math.random().toString(16).substr(2, 64),
          fromAddress: '0x' + Math.random().toString(16).substr(2, 40),
          toAddress: '0x' + Math.random().toString(16).substr(2, 40),
          amount: 1250.75,
          gasUsed: 21000,
          gasPrice: 20.5,
          status: 'CONFIRMED',
          confirmations: 12,
          timestamp: new Date(),
        },
      }),
      prisma.blockchainTransaction.create({
        data: {
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          blockNumber: 2847294,
          blockHash: '0x' + Math.random().toString(16).substr(2, 64),
          fromAddress: '0x' + Math.random().toString(16).substr(2, 40),
          toAddress: '0x' + Math.random().toString(16).substr(2, 40),
          amount: 3750.25,
          gasUsed: 35000,
          gasPrice: 18.2,
          status: 'PENDING',
          confirmations: 0,
          timestamp: new Date(),
        },
      }),
    ]);

    logger.info('Created blockchain transactions:', blockchainTransactions.length);

    // Create sample biometric data
    const biometricData = await Promise.all([
      prisma.biometricData.create({
        data: {
          userId: admin.id,
          biometricType: 'FINGERPRINT',
          templateData: 'encrypted_fingerprint_template_' + Math.random().toString(36),
          confidence: 99.2,
        },
      }),
      prisma.biometricData.create({
        data: {
          userId: manager.id,
          biometricType: 'FACIAL_RECOGNITION',
          templateData: 'encrypted_facial_template_' + Math.random().toString(36),
          confidence: 98.7,
        },
      }),
      prisma.biometricData.create({
        data: {
          userId: analyst.id,
          biometricType: 'IRIS_SCAN',
          templateData: 'encrypted_iris_template_' + Math.random().toString(36),
          confidence: 99.8,
        },
      }),
    ]);

    logger.info('Created biometric data:', biometricData.length);

    // Create sample alerts
    const alerts = await Promise.all([
      prisma.alert.create({
        data: {
          threatEventId: threatEvents[1].id, // Critical DDoS alert
          type: 'SECURITY_BREACH',
          severity: 'CRITICAL',
          title: 'Critical DDoS Attack in Progress',
          message: 'Large-scale DDoS attack detected targeting main infrastructure. Immediate attention required.',
        },
      }),
      prisma.alert.create({
        data: {
          type: 'FRAUD_DETECTED',
          severity: 'HIGH',
          title: 'High-Risk Fraud Transaction Blocked',
          message: 'Transaction flagged for stolen card fraud with 85.5% confidence.',
        },
      }),
      prisma.alert.create({
        data: {
          type: 'SYSTEM_ANOMALY',
          severity: 'MEDIUM',
          title: 'Unusual Authentication Pattern',
          message: 'Spike in failed authentication attempts detected across multiple regions.',
        },
      }),
    ]);

    logger.info('Created alerts:', alerts.length);

    // Create sample security metrics
    const securityMetrics = await Promise.all([
      prisma.securityMetric.create({
        data: {
          name: 'Threat Detection Rate',
          value: 98.5,
          unit: 'percentage',
          category: 'threat_detection',
          metadataJson: JSON.stringify({
            source: 'AI Engine',
            threshold: 95.0,
          }),
        },
      }),
      prisma.securityMetric.create({
        data: {
          name: 'Response Time',
          value: 2.3,
          unit: 'seconds',
          category: 'performance',
          metadataJson: JSON.stringify({
            source: 'Security Operations',
            target: 5.0,
          }),
        },
      }),
      prisma.securityMetric.create({
        data: {
          name: 'False Positive Rate',
          value: 1.2,
          unit: 'percentage',
          category: 'accuracy',
          metadataJson: JSON.stringify({
            source: 'ML Models',
            target: 2.0,
          }),
        },
      }),
    ]);

    logger.info('Created security metrics:', securityMetrics.length);

    // Create sample access policies
    const accessPolicies = await Promise.all([
      prisma.accessPolicy.create({
        data: {
          name: 'Admin Console Access',
          description: 'Policy for accessing admin console',
          resource: 'admin_console',
          action: 'access',
          conditionsJson: JSON.stringify({
            roles: ['ADMIN'],
            timeRestriction: '09:00-17:00',
            ipWhitelist: ['10.0.0.0/8', '192.168.0.0/16'],
          }),
        },
      }),
      prisma.accessPolicy.create({
        data: {
          name: 'Sensitive Data Access',
          description: 'Policy for accessing sensitive customer data',
          resource: 'customer_data',
          action: 'read',
          conditionsJson: JSON.stringify({
            roles: ['ADMIN', 'SECURITY_MANAGER'],
            mfaRequired: true,
            auditLog: true,
          }),
        },
      }),
    ]);

    logger.info('Created access policies:', accessPolicies.length);

    // Create system configuration
    const systemConfigs = await Promise.all([
      prisma.systemConfig.create({
        data: {
          key: 'THREAT_DETECTION_THRESHOLD',
          value: '85',
          category: 'security',
        },
      }),
      prisma.systemConfig.create({
        data: {
          key: 'FRAUD_RISK_THRESHOLD',
          value: '70',
          category: 'fraud_detection',
        },
      }),
      prisma.systemConfig.create({
        data: {
          key: 'SESSION_TIMEOUT',
          value: '3600',
          category: 'authentication',
        },
      }),
      prisma.systemConfig.create({
        data: {
          key: 'MAX_LOGIN_ATTEMPTS',
          value: '5',
          category: 'authentication',
        },
      }),
    ]);

    logger.info('Created system configurations:', systemConfigs.length);

    logger.info('Database seeding completed successfully!');
    logger.info('Default credentials:');
    logger.info('Admin: admin@walmart.com / admin123!');
    logger.info('Security Manager: security.manager@walmart.com / manager123!');
    logger.info('Analyst: analyst@walmart.com / analyst123!');

  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
