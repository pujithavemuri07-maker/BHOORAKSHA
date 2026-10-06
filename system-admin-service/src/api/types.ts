export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'maintenance';

export type UserRole = 'citizen' | 'deo' | 'verifier' | 'legal' | 'gis' | 'revenue' | 'admin';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface MicroserviceHealth {
  id: string;
  name: string;
  code: string;
  port: number;
  url: string;
  status: ServiceStatus;
  latencyMs: number;
  uptimePercent: number;
  lastHeartbeat: string;
  version: string;
  description: string;
  replicaCount: number;
  cpuPercent: number;
  memPercent: number;
}

export interface SystemMetrics {
  totalUsers: number;
  totalApplications: number;
  systemUptime: number; // e.g. 99.98%
  apiHealth: number; // e.g. 99.4%
  aiAccuracy: number; // e.g. 96.8%
  activeSessions: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  errorRatePercent: number;
  requestsPerMinute: number;
  activeCeleryTasks: number;
  retryQueueLength: number;
}

export interface AIAgentMetric {
  id: string;
  name: string;
  code: 'ocr' | 'ner' | 'legal' | 'gis';
  modelName: string;
  version: string;
  accuracy: number; // 0-100%
  confidenceScore: number; // 0-100%
  overrideRate: number; // human override %
  avgProcessingTimeSec: number;
  p50Sec: number;
  p95Sec: number;
  p99Sec: number;
  totalInferencesToday: number;
  status: 'active' | 'degraded' | 'evaluating';
  lastRetrained: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  designation: string;
  department: string;
  district: string;
  jurisdiction: string;
  status: UserStatus;
  lastActive: string;
  createdAt: string;
  mfaEnabled: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  category: 'security' | 'auth' | 'application' | 'system' | 'ai';
  ipAddress: string;
  resourceId: string;
  details: string;
  status: 'success' | 'failure' | 'warning';
  previousValue?: string;
  newValue?: string;
  reason?: string;
  sha256Hash: string;
}

export interface QueueStatus {
  id: string;
  name: string;
  type: 'celery' | 'redis' | 'dead_letter';
  pendingTasks: number;
  processingTasks: number;
  failedTasks: number;
  throughputPerMin: number;
  status: 'normal' | 'congested' | 'stalled';
}

export interface PlatformSettings {
  maintenanceMode: boolean;
  mfaEnforced: boolean;
  sessionTimeoutMinutes: number;
  rateLimitPerMinute: number;
  logRetentionDays: number;
  autoMutationSync: boolean;
  aiAutoVerifyThreshold: number; // e.g. 95%
  fallbackToManualVerification: boolean;
  allowPublicRegistration: boolean;
  alertEmail: string;
  alertSlackWebhook: string;
}

export interface AdminSystemUser {
  id: string;
  name: string;
  role: 'admin';
  email: string;
  phone: string;
  designation: string;
  office: string;
  district: string;
  jurisdiction: string;
  employeeId: string;
  token: string;
}
