import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL!,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET!,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // Email Configuration
  email: {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },

  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  },

  // AI/ML Configuration
  ml: {
    apiUrl: process.env.ML_API_URL || 'http://localhost:8000',
    apiKey: process.env.ML_API_KEY,
  },

  // Blockchain Configuration
  blockchain: {
    network: process.env.BLOCKCHAIN_NETWORK || 'ethereum',
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL,
  },

  // External APIs
  externalApis: {
    threatIntelApiKey: process.env.THREAT_INTEL_API_KEY,
    fraudDetectionApiKey: process.env.FRAUD_DETECTION_API_KEY,
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || 'logs/app.log',
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'REFRESH_TOKEN_SECRET',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is not set`);
  }
}
