// Type definitions for API responses and data structures

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'SECURITY_MANAGER' | 'ANALYST';
  department?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ThreatEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  sourceIp: string;
  targetIp: string;
  location: string;
  source: string;
  status: 'blocked' | 'investigating' | 'resolved';
  confidence: number;
  riskScore: number;
  timestamp: string;
  metadataJson?: string;
  resolvedAt?: string;
}

export interface CreateThreatRequest {
  type: string;
  severity: string;
  title: string;
  description: string;
  sourceIp: string;
  targetIp: string;
  location: string;
  source: string;
  confidence: number;
  riskScore: number;
  metadata?: Record<string, any>;
}

export interface FraudEvent {
  id: string;
  transactionId: string;
  userId?: string;
  amount: number;
  currency: string;
  merchantId: string;
  merchantName: string;
  riskScore: number;
  fraudType: string;
  status: string;
  reasonsJson: string;
  location: string;
  deviceFingerprint: string;
  ipAddress: string;
  metadataJson: string;
  detectedAt: string;
  reviewedAt?: string;
}

export interface BlockchainTransaction {
  id: string;
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  gasUsed: number;
  gasPrice: number;
  status: string;
  confirmations: number;
  timestamp: string;
  verifiedAt: string;
  verifications: BlockchainVerification[];
}

export interface BlockchainVerification {
  id: string;
  verifierNode: string;
  isValid: boolean;
  timestamp: string;
  transactionId: string;
}

export interface BiometricData {
  authenticatedUsers: number;
  methods: BiometricMethod[];
  authStatus: string;
  confidence: number;
}

export interface BiometricMethod {
  name: string;
  active: number;
  accuracy: number;
  type: string;
}

export interface Alert {
  id: string;
  threatEventId?: string;
  userId?: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isResolved: boolean;
  metadataJson?: string;
  resolvedAt?: string;
  threatEvent?: ThreatEvent;
}

export interface SecurityOverview {
  securityScore: number;
  activeThreats: number;
  blockedToday: number;
  protectedTransactions: number;
}

export interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: string;
  metadataJson?: string;
  timestamp: string;
}

export interface CreateAlertRequest {
  type: string;
  severity: string;
  title: string;
  message: string;
  threatEventId?: string;
  metadata?: Record<string, any>;
}

export interface BiometricEnrollRequest {
  userId: string;
  biometricType: string;
  templateData: string;
}

export interface BiometricAuthRequest {
  biometricType: string;
  templateData: string;
  deviceInfo: string;
}

// WebSocket event types
export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: string;
}

// Pagination and filtering
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ThreatFilterParams extends PaginationParams {
  severity?: string;
  status?: string;
  type?: string;
}

export interface FraudFilterParams extends PaginationParams {
  status?: string;
  fraudType?: string;
}

export interface AlertFilterParams extends PaginationParams {
  severity?: string;
  type?: string;
  unread?: boolean;
}

export interface BlockchainFilterParams extends PaginationParams {
  status?: string;
}
