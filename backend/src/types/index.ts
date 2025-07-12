export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SecurityMetricsData {
  securityScore: number;
  activeThreats: number;
  blockedToday: number;
  protectedTransactions: number;
}

export interface ThreatEventData {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  timestamp: Date;
  description: string;
  status: 'blocked' | 'investigating' | 'resolved';
  source: string;
  confidence: number;
  riskScore: number;
}

export interface FraudDetectionData {
  aiAccuracy: number;
  fraudPrevented: number;
  riskScore: number;
  modelsActive: number;
  patterns: FraudPattern[];
}

export interface FraudPattern {
  pattern: string;
  confidence: number;
  transactions: number;
  risk: 'high' | 'medium' | 'low';
  trend: string;
}

export interface BlockchainData {
  totalVerified: number;
  blockHeight: number;
  transactions: BlockchainTransactionData[];
}

export interface BlockchainTransactionData {
  id: string;
  hash: string;
  amount: number;
  status: 'verified' | 'pending' | 'failed';
  timestamp: Date;
  gasUsed: number;
  blockNumber: number;
}

export interface BiometricData {
  authenticatedUsers: number;
  methods: BiometricMethod[];
  authStatus: 'idle' | 'scanning' | 'success' | 'failed';
  confidence: number;
}

export interface BiometricMethod {
  name: string;
  active: number;
  accuracy: number;
  type: 'fingerprint' | 'facial' | 'iris' | 'voice';
}

export interface AlertData {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isResolved: boolean;
}

export interface ZeroTrustData {
  policies: number;
  activeRequests: number;
  approvalRate: number;
  securityLevel: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

export interface BiometricAuthRequest {
  userId: string;
  biometricType: 'fingerprint' | 'facial' | 'iris' | 'voice';
  templateData: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface SystemHealthData {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  dbStatus: 'connected' | 'disconnected';
  services: ServiceStatus[];
}

export interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  lastCheck: Date;
}
