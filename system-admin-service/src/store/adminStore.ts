import { create } from 'zustand';
import {
  MicroserviceHealth,
  SystemMetrics,
  AIAgentMetric,
  AdminUser,
  AuditLogEntry,
  QueueStatus,
  PlatformSettings,
} from '../api/types';

import {
  adminApi,
  AdminMetrics,
  AdminApplicationSummary,
  AdminActionPayload,
  AdminQueueParams,
} from '../api/adminApi';

interface AdminState {
  services: MicroserviceHealth[];
  metrics: SystemMetrics;
  dbMetrics: AdminMetrics;
  aiAgents: AIAgentMetric[];
  users: AdminUser[];
  auditLogs: AuditLogEntry[];
  queues: QueueStatus[];
  settings: PlatformSettings;
  
  // Application Management State
  applications: AdminApplicationSummary[];
  applicationsTotal: number;
  applicationsPage: number;
  applicationsTotalPages: number;
  currentApplication: any | null;
  isLoadingApplications: boolean;

  // User Management actions
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastActive'>) => void;
  updateUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  batchToggleStatus: (ids: string[], status: AdminUser['status']) => void;

  // Platform & Service actions
  restartService: (serviceId: string) => Promise<void>;
  updateSettings: (updates: Partial<PlatformSettings>) => void;
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'sha256Hash'>) => void;
  flushCache: () => Promise<void>;
  triggerSnapshotBackup: () => Promise<void>;

  // Application Actions
  fetchDbMetrics: () => Promise<AdminMetrics>;
  fetchApplications: (params?: AdminQueueParams) => Promise<void>;
  fetchApplicationDetails: (applicationNo: string) => Promise<any>;
  executeAdminAction: (applicationNo: string, payload: AdminActionPayload) => Promise<any>;
}


const INITIAL_SERVICES: MicroserviceHealth[] = [
  {
    id: 'srv-auth',
    name: 'Auth Service (OAuth2 / JWT)',
    code: 'auth',
    port: 8000,
    url: 'http://localhost:8000',
    status: 'healthy',
    latencyMs: 14,
    uptimePercent: 99.99,
    lastHeartbeat: '2026-09-08T10:30:00Z',
    version: 'v2.4.1',
    description: 'Statutory RBAC, MFA OTP authentication, Aadhaar KYC token verification',
    replicaCount: 4,
    cpuPercent: 22,
    memPercent: 38,
  },
  {
    id: 'srv-orchestrator',
    name: 'AI Agent Orchestrator',
    code: 'ai_orchestrator',
    port: 8001,
    url: 'http://localhost:8001',
    status: 'healthy',
    latencyMs: 48,
    uptimePercent: 99.95,
    lastHeartbeat: '2026-09-08T10:30:00Z',
    version: 'v3.1.0',
    description: 'Chitrapathak OCR, MuRIL NER, legal validation rule engine, GIS polygon matcher',
    replicaCount: 6,
    cpuPercent: 68,
    memPercent: 74,
  },
  {
    id: 'srv-citizen',
    name: 'Citizen Service (Self-Service Portal)',
    code: 'citizen',
    port: 3000,
    url: 'http://localhost:3000',
    status: 'healthy',
    latencyMs: 18,
    uptimePercent: 99.98,
    lastHeartbeat: '2026-09-08T10:30:00Z',
    version: 'v2.1.2',
    description: 'Public land title search, deed upload, grievance filing, e-passbook generation',
    replicaCount: 5,
    cpuPercent: 31,
    memPercent: 42,
  },
  {
    id: 'srv-deo',
    name: 'DEO Service (Data Entry Operator)',
    code: 'deo',
    port: 3001,
    url: 'http://localhost:3001',
    status: 'healthy',
    latencyMs: 15,
    uptimePercent: 99.97,
    lastHeartbeat: '2026-09-08T10:30:00Z',
    version: 'v2.0.4',
    description: 'Clerical deed intake, OCR text proofing, seller/purchaser KYC indexing',
    replicaCount: 3,
    cpuPercent: 19,
    memPercent: 35,
  },
  {
    id: 'srv-verifier',
    name: 'Verifier Service (Girdawar / Inspector)',
    code: 'verifier',
    port: 3002,
    url: 'http://localhost:3002',
    status: 'healthy',
    latencyMs: 21,
    uptimePercent: 99.96,
    lastHeartbeat: '2026-09-08T10:30:00Z',
    version: 'v2.2.0',
    description: 'On-ground survey verification, Pahani / 1-B record matching, spot inspection upload',
    replicaCount: 3,
    cpuPercent: 24,
    memPercent: 39,
  },
  {
    id: 'srv-legal',
    name: 'Legal Service (Legal Advisor Scrutiny)',
    code: 'legal',
    port: 3003,
    url: 'http://localhost:3003',
    status: 'healthy',
    latencyMs: 26,
    uptimePercent: 99.92,
    lastHeartbeat: '2026-09-08T10:30:00Z',
    version: 'v1.9.8',
    description: '30-year non-encumbrance validation, litigation caveats, ceiling act scrutiny',
    replicaCount: 3,
    cpuPercent: 28,
    memPercent: 45,
  },
  {
    id: 'srv-gis',
    name: 'GIS Service (BhooNaksha Cadastral)',
    code: 'gis',
    port: 3004,
    url: 'http://localhost:3004',
    status: 'healthy',
    latencyMs: 34,
    uptimePercent: 99.94,
    lastHeartbeat: '2026-09-08T10:30:00Z',
    version: 'v3.0.2',
    description: 'Vector polygon geometry, spatial overlap detection, ULPIN centroid calculation',
    replicaCount: 4,
    cpuPercent: 55,
    memPercent: 62,
  },
  {
    id: 'srv-revenue',
    name: 'Revenue Admin Service (Tahsildar)',
    code: 'revenue',
    port: 3005,
    url: 'http://localhost:3005',
    status: 'healthy',
    latencyMs: 19,
    uptimePercent: 99.99,
    lastHeartbeat: '2026-09-08T10:30:00Z',
    version: 'v2.5.0',
    description: 'Executive approval, mutation triggering into RoR, statutory digital certificate issuance',
    replicaCount: 3,
    cpuPercent: 26,
    memPercent: 41,
  },
  {
    id: 'srv-database',
    name: 'PostgreSQL 16 + PostGIS Spatial DB',
    code: 'db',
    port: 5432,
    url: 'postgres://db.bhooraksha.internal:5432/bhooraksha',
    status: 'healthy',
    latencyMs: 4,
    uptimePercent: 99.999,
    lastHeartbeat: '2026-09-08T10:30:00Z',
    version: '16.2-PostGIS 3.4',
    description: 'Primary transactional cluster with synchronous replication & spatial indexing',
    replicaCount: 2,
    cpuPercent: 42,
    memPercent: 78,
  },
  {
    id: 'srv-redis',
    name: 'Redis Cluster (Cache & Task Broker)',
    code: 'redis',
    port: 6379,
    url: 'redis://cache.bhooraksha.internal:6379/0',
    status: 'healthy',
    latencyMs: 1,
    uptimePercent: 100.0,
    lastHeartbeat: '2026-09-08T10:30:00Z',
    version: '7.2.4',
    description: 'In-memory token session cache, rate-limiting counters, Celery broker',
    replicaCount: 3,
    cpuPercent: 15,
    memPercent: 32,
  },
  {
    id: 'srv-minio',
    name: 'MinIO S3 Object Storage',
    code: 'minio',
    port: 9000,
    url: 'http://s3.bhooraksha.internal:9000',
    status: 'healthy',
    latencyMs: 12,
    uptimePercent: 99.97,
    lastHeartbeat: '2026-09-08T10:30:00Z',
    version: 'RELEASE.2026-08',
    description: 'Encrypted document store for deed scans, revenue maps, and signed PDF certificates',
    replicaCount: 4,
    cpuPercent: 20,
    memPercent: 54,
  },
];

const INITIAL_METRICS: SystemMetrics = {
  totalUsers: 14892,
  totalApplications: 48920,
  systemUptime: 99.98,
  apiHealth: 99.85,
  aiAccuracy: 96.8,
  activeSessions: 342,
  p50Latency: 18,
  p95Latency: 45,
  p99Latency: 112,
  errorRatePercent: 0.04,
  requestsPerMinute: 4280,
  activeCeleryTasks: 18,
  retryQueueLength: 2,
};

const INITIAL_AI_AGENTS: AIAgentMetric[] = [
  {
    id: 'ai-ocr',
    name: 'Chitrapathak Multilingual OCR',
    code: 'ocr',
    modelName: 'Bhoo-Chitrapathak-v3',
    version: '3.2.1-prod',
    accuracy: 97.4,
    confidenceScore: 94.8,
    overrideRate: 2.6,
    avgProcessingTimeSec: 1.84,
    p50Sec: 1.45,
    p95Sec: 2.90,
    p99Sec: 4.12,
    totalInferencesToday: 1420,
    status: 'active',
    lastRetrained: '2026-08-28T04:00:00Z',
  },
  {
    id: 'ai-ner',
    name: 'MuRIL Indic Named Entity Recognizer',
    code: 'ner',
    modelName: 'MuRIL-DeedNER-Indic13',
    version: '2.8.0-prod',
    accuracy: 96.2,
    confidenceScore: 93.1,
    overrideRate: 3.8,
    avgProcessingTimeSec: 0.62,
    p50Sec: 0.48,
    p95Sec: 1.15,
    p99Sec: 1.80,
    totalInferencesToday: 2150,
    status: 'active',
    lastRetrained: '2026-08-20T04:00:00Z',
  },
  {
    id: 'ai-legal',
    name: 'LexBhoomi Legal Compliance Engine',
    code: 'legal',
    modelName: 'LexBhoomi-StatutoryRules-v4',
    version: '4.0.3-prod',
    accuracy: 98.6,
    confidenceScore: 97.2,
    overrideRate: 1.4,
    avgProcessingTimeSec: 0.88,
    p50Sec: 0.72,
    p95Sec: 1.42,
    p99Sec: 2.10,
    totalInferencesToday: 980,
    status: 'active',
    lastRetrained: '2026-09-01T04:00:00Z',
  },
  {
    id: 'ai-gis',
    name: 'BhooNaksha Polygon Georeferencer',
    code: 'gis',
    modelName: 'CadastralMatch-VectorAI-v2',
    version: '2.4.0-prod',
    accuracy: 95.8,
    confidenceScore: 92.5,
    overrideRate: 4.2,
    avgProcessingTimeSec: 2.35,
    p50Sec: 1.95,
    p95Sec: 3.80,
    p99Sec: 5.60,
    totalInferencesToday: 840,
    status: 'active',
    lastRetrained: '2026-08-15T04:00:00Z',
  },
];

const INITIAL_USERS: AdminUser[] = [
  {
    id: 'usr-001',
    name: 'Sri V. Someshwar Rao, IAS',
    email: 'ccla.admin@telangana.gov.in',
    phone: '+91 94400 11223',
    role: 'admin',
    designation: 'Chief Commissioner of Land Administration (CCLA)',
    department: 'Revenue & Disaster Management',
    district: 'Hyderabad HQ',
    jurisdiction: 'Statewide (All 33 Districts)',
    status: 'active',
    lastActive: 'Just now',
    createdAt: '2025-01-15T09:00:00Z',
    mfaEnabled: true,
  },
  {
    id: 'usr-002',
    name: 'Dr. K. V. Ramanathan, IAS (Prob.)',
    email: 'tahsildar.serilingampally@telangana.gov.in',
    phone: '+91 94401 23456',
    role: 'revenue',
    designation: 'Tahsildar & Executive Magistrate',
    department: 'Revenue Administration',
    district: 'Ranga Reddy',
    jurisdiction: 'Serilingampally, Chandanagar, Gachibowli',
    status: 'active',
    lastActive: '5m ago',
    createdAt: '2025-02-01T10:00:00Z',
    mfaEnabled: true,
  },
  {
    id: 'usr-003',
    name: 'S. Ramakrishna',
    email: 'gis.specialist@telangana.gov.in',
    phone: '+91 94402 34567',
    role: 'gis',
    designation: 'Senior GIS Specialist',
    department: 'Survey Settlement & Land Records',
    district: 'Ranga Reddy',
    jurisdiction: 'Serilingampally Cadastral Division',
    status: 'active',
    lastActive: '12m ago',
    createdAt: '2025-02-10T11:00:00Z',
    mfaEnabled: true,
  },
  {
    id: 'usr-004',
    name: 'Adv. Rajeshwari Sharma',
    email: 'legal.scrutiny@telangana.gov.in',
    phone: '+91 94403 45678',
    role: 'legal',
    designation: 'Senior Legal Officer',
    department: 'Law & Land Title Scrutiny Cell',
    district: 'Ranga Reddy',
    jurisdiction: 'District Revenue Legal Directorate',
    status: 'active',
    lastActive: '28m ago',
    createdAt: '2025-02-15T08:30:00Z',
    mfaEnabled: true,
  },
  {
    id: 'usr-005',
    name: 'M. Chenna Kesavulu',
    email: 'verifier.girdawar@telangana.gov.in',
    phone: '+91 94404 56789',
    role: 'verifier',
    designation: 'Girdawar / Revenue Inspector',
    department: 'Field Verification Wing',
    district: 'Ranga Reddy',
    jurisdiction: 'Gachibowli & Madhapur Circles',
    status: 'active',
    lastActive: '45m ago',
    createdAt: '2025-02-20T14:00:00Z',
    mfaEnabled: true,
  },
  {
    id: 'usr-006',
    name: 'V. Ramanjaneyulu',
    email: 'deo.operator@telangana.gov.in',
    phone: '+91 94405 67890',
    role: 'deo',
    designation: 'Patwari / Data Entry Officer',
    department: 'MeeSeva / CSC Intake Unit',
    district: 'Ranga Reddy',
    jurisdiction: 'Serilingampally Tahsil Office Desk 1',
    status: 'active',
    lastActive: '1h ago',
    createdAt: '2025-03-01T09:15:00Z',
    mfaEnabled: false,
  },
  {
    id: 'usr-007',
    name: 'Ramesh Kumar Patel',
    email: 'ramesh.patel@gmail.com',
    phone: '+91 98765 43210',
    role: 'citizen',
    designation: 'Landowner / Citizen Applicant',
    department: 'Public Landholder',
    district: 'Ranga Reddy',
    jurisdiction: 'Village Gachibowli',
    status: 'active',
    lastActive: '2h ago',
    createdAt: '2026-01-10T12:00:00Z',
    mfaEnabled: true,
  },
  {
    id: 'usr-008',
    name: 'Anjali Deshmukh',
    email: 'anjali.d@telangana.gov.in',
    phone: '+91 98765 99881',
    role: 'deo',
    designation: 'Assistant Data Entry Officer',
    department: 'MeeSeva / CSC Intake Unit',
    district: 'Medchal-Malkajgiri',
    jurisdiction: 'Kukatpally Tahsil Office Desk 3',
    status: 'inactive',
    lastActive: '3d ago',
    createdAt: '2025-04-12T10:00:00Z',
    mfaEnabled: false,
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-99812',
    timestamp: '2026-09-08T10:28:14Z',
    userId: 'usr-002',
    userName: 'Dr. K. V. Ramanathan, IAS (Prob.)',
    userRole: 'revenue',
    action: 'APPLICATION_APPROVED_MUTATION_TRIGGERED',
    category: 'application',
    ipAddress: '10.14.2.88',
    resourceId: 'REQ-2026-000123',
    details: 'Executive approval ratified. Mutation triggered for Sy No. 123/456, extent 2.50 Ac with ULPIN ULPIN-36-RR-SER-123-01.',
    status: 'success',
    previousValue: 'status: pending',
    newValue: 'status: approved, mutation_status: dispatched',
    reason: 'Complied with all 4 officer clearances (DEO, Verifier, Legal, GIS).',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'AUD-99811',
    timestamp: '2026-09-08T10:15:32Z',
    userId: 'usr-001',
    userName: 'Sri V. Someshwar Rao, IAS',
    userRole: 'admin',
    action: 'SECURITY_POLICY_UPDATE',
    category: 'security',
    ipAddress: '10.14.0.12',
    resourceId: 'PLATFORM_POLICY',
    details: 'Enforced mandatory biometric MFA for all Tahsildar and GIS specialist accounts.',
    status: 'success',
    previousValue: 'mfa_enforced: false',
    newValue: 'mfa_enforced: true',
    reason: 'Annual State Cybersecurity & CISA Compliance Mandate',
    sha256Hash: 'a7b3c881290fe32948bc12e4589d984126fa941829e924151b689024fbd99812',
  },
  {
    id: 'AUD-99810',
    timestamp: '2026-09-08T09:54:20Z',
    userId: 'usr-003',
    userName: 'S. Ramakrishna',
    userRole: 'gis',
    action: 'CADASTRAL_BOUNDARY_MODIFICATION',
    category: 'application',
    ipAddress: '10.14.3.44',
    resourceId: 'REV-2026-804',
    details: 'Corrected polygon vertices along northern drainage boundary. Congruence increased to 94.8%.',
    status: 'success',
    previousValue: 'congruence: 89.2%',
    newValue: 'congruence: 94.8%',
    reason: 'Physical ETS survey re-triangulation sheet reconciled.',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  },
  {
    id: 'AUD-99809',
    timestamp: '2026-09-08T09:20:05Z',
    userId: 'usr-004',
    userName: 'Adv. Rajeshwari Sharma',
    userRole: 'legal',
    action: 'LEGAL_CAVEAT_FLAGGED',
    category: 'application',
    ipAddress: '10.14.4.19',
    resourceId: 'REV-2026-802',
    details: 'High-risk title dispute flagged due to OS 412/2024 pending in Hon. High Court.',
    status: 'warning',
    previousValue: 'risk_score: 18',
    newValue: 'risk_score: 92, flag: litigation_stay',
    reason: 'Lis pendens injunction notice filed by third party claimant.',
    sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
  },
  {
    id: 'AUD-99808',
    timestamp: '2026-09-08T08:45:11Z',
    userId: 'system-agent',
    userName: 'Chitrapathak OCR Daemon',
    userRole: 'admin',
    action: 'AI_MODEL_INFERENCE_BATCH',
    category: 'ai',
    ipAddress: '127.0.0.1',
    resourceId: 'BATCH-2026-09-08-01',
    details: 'Batch processed 128 registered sale deeds across 5 languages (Telugu, Marathi, Kannada, Urdu, English).',
    status: 'success',
    reason: 'Scheduled automated OCR pipeline ingress.',
    sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
  },
  {
    id: 'AUD-99807',
    timestamp: '2026-09-08T07:12:00Z',
    userId: 'unknown-intruder',
    userName: 'Anonymous (Unauthorized)',
    userRole: 'citizen',
    action: 'FAILED_ADMIN_LOGIN_ATTEMPT',
    category: 'security',
    ipAddress: '185.220.101.5',
    resourceId: 'AUTH_ENDPOINT',
    details: 'Brute force credential attempt on CCLA admin endpoint blocked by WAF rate limiter.',
    status: 'failure',
    reason: 'IP blacklisted automatically after 5 failed password attempts.',
    sha256Hash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  },
];

const INITIAL_QUEUES: QueueStatus[] = [
  {
    id: 'q-celery-ocr',
    name: 'Celery OCR / NER Document Ingestion',
    type: 'celery',
    pendingTasks: 14,
    processingTasks: 6,
    failedTasks: 0,
    throughputPerMin: 142,
    status: 'normal',
  },
  {
    id: 'q-celery-gis',
    name: 'Celery BhooNaksha Spatial Geometry Worker',
    type: 'celery',
    pendingTasks: 4,
    processingTasks: 2,
    failedTasks: 1,
    throughputPerMin: 58,
    status: 'normal',
  },
  {
    id: 'q-redis-mutation',
    name: 'Redis RoR State Mutation Dispatcher',
    type: 'redis',
    pendingTasks: 2,
    processingTasks: 1,
    failedTasks: 0,
    throughputPerMin: 90,
    status: 'normal',
  },
  {
    id: 'q-dead-letter',
    name: 'Dead Letter Task DLQ (Retry Queue)',
    type: 'dead_letter',
    pendingTasks: 2,
    processingTasks: 0,
    failedTasks: 2,
    throughputPerMin: 0,
    status: 'stalled',
  },
];

const INITIAL_SETTINGS: PlatformSettings = {
  maintenanceMode: false,
  mfaEnforced: true,
  sessionTimeoutMinutes: 30,
  rateLimitPerMinute: 600,
  logRetentionDays: 3650, // 10 years statutory
  autoMutationSync: true,
  aiAutoVerifyThreshold: 95,
  fallbackToManualVerification: true,
  allowPublicRegistration: true,
  alertEmail: 'ccla-security-alerts@telangana.gov.in',
  alertSlackWebhook: 'https://hooks.slack.com/services/T00/B00/SECRET_BHOORAKSHA',
};

export const useAdminStore = create<AdminState>((set, get) => ({
  services: INITIAL_SERVICES,
  metrics: INITIAL_METRICS,
  dbMetrics: {
    total_applications: 3,
    pending_applications: 1,
    under_verification: 1,
    completed_verification: 0,
    ready_for_admin_review: 1,
    approved: 0,
    rejected: 0,
    returned: 0,
    high_risk: 1,
    recent_applications: [],
  },
  aiAgents: INITIAL_AI_AGENTS,
  users: INITIAL_USERS,
  auditLogs: INITIAL_AUDIT_LOGS,
  queues: INITIAL_QUEUES,
  settings: INITIAL_SETTINGS,

  applications: [],
  applicationsTotal: 0,
  applicationsPage: 1,
  applicationsTotalPages: 1,
  currentApplication: null,
  isLoadingApplications: false,


  addUser: (userData) => {
    const newUser: AdminUser = {
      ...userData,
      id: `usr-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      lastActive: 'Just created',
    };
    set((state) => ({
      users: [newUser, ...state.users],
      metrics: {
        ...state.metrics,
        totalUsers: state.metrics.totalUsers + 1,
      },
    }));
    get().addAuditLog({
      userId: 'usr-001',
      userName: 'Sri V. Someshwar Rao, IAS',
      userRole: 'admin',
      action: 'USER_CREATED',
      category: 'auth',
      ipAddress: '10.14.0.12',
      resourceId: newUser.id,
      details: `Created new ${newUser.role.toUpperCase()} account for ${newUser.name} (${newUser.email}).`,
      status: 'success',
      newValue: `Role: ${newUser.role}, District: ${newUser.district}`,
    });
  },

  updateUser: (id, updates) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    }));
    get().addAuditLog({
      userId: 'usr-001',
      userName: 'Sri V. Someshwar Rao, IAS',
      userRole: 'admin',
      action: 'USER_MODIFIED',
      category: 'auth',
      ipAddress: '10.14.0.12',
      resourceId: id,
      details: `Updated details for user ${id}.`,
      status: 'success',
    });
  },

  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
      metrics: {
        ...state.metrics,
        totalUsers: Math.max(0, state.metrics.totalUsers - 1),
      },
    }));
    get().addAuditLog({
      userId: 'usr-001',
      userName: 'Sri V. Someshwar Rao, IAS',
      userRole: 'admin',
      action: 'USER_DELETED',
      category: 'security',
      ipAddress: '10.14.0.12',
      resourceId: id,
      details: `Revoked and deleted user ID ${id}.`,
      status: 'warning',
    });
  },

  toggleUserStatus: (id) => {
    const user = get().users.find((u) => u.id === id);
    if (!user) return;
    const newStatus: AdminUser['status'] = user.status === 'active' ? 'suspended' : 'active';
    get().updateUser(id, { status: newStatus });
  },

  batchToggleStatus: (ids, status) => {
    set((state) => ({
      users: state.users.map((u) => (ids.includes(u.id) ? { ...u, status } : u)),
    }));
    get().addAuditLog({
      userId: 'usr-001',
      userName: 'Sri V. Someshwar Rao, IAS',
      userRole: 'admin',
      action: 'BATCH_USER_STATUS_UPDATE',
      category: 'security',
      ipAddress: '10.14.0.12',
      resourceId: `BATCH-${ids.length}`,
      details: `Batch changed status of ${ids.length} users to ${status}.`,
      status: 'success',
    });
  },

  restartService: async (serviceId) => {
    set((state) => ({
      services: state.services.map((s) =>
        s.id === serviceId ? { ...s, status: 'maintenance' } : s
      ),
    }));
    await new Promise((resolve) => setTimeout(resolve, 800));
    set((state) => ({
      services: state.services.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              status: 'healthy',
              latencyMs: Math.floor(Math.random() * 20) + 10,
              lastHeartbeat: new Date().toISOString(),
            }
          : s
      ),
    }));
    get().addAuditLog({
      userId: 'usr-001',
      userName: 'Sri V. Someshwar Rao, IAS',
      userRole: 'admin',
      action: 'SERVICE_RESTARTED',
      category: 'system',
      ipAddress: '10.14.0.12',
      resourceId: serviceId,
      details: `Gracefully restarted service cluster container: ${serviceId}.`,
      status: 'success',
    });
  },

  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));
    get().addAuditLog({
      userId: 'usr-001',
      userName: 'Sri V. Someshwar Rao, IAS',
      userRole: 'admin',
      action: 'PLATFORM_SETTINGS_CHANGED',
      category: 'system',
      ipAddress: '10.14.0.12',
      resourceId: 'PLATFORM_CONFIG',
      details: 'Updated global platform parameters.',
      status: 'warning',
    });
  },

  addAuditLog: (entry) => {
    const randomHex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const newLog: AuditLogEntry = {
      ...entry,
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      sha256Hash: randomHex,
    };
    set((state) => ({
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  flushCache: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    get().addAuditLog({
      userId: 'usr-001',
      userName: 'Sri V. Someshwar Rao, IAS',
      userRole: 'admin',
      action: 'REDIS_CACHE_FLUSHED',
      category: 'system',
      ipAddress: '10.14.0.12',
      resourceId: 'REDIS_DB_0',
      details: 'Evicted all non-persistent JWT cache keys and rate limit counters.',
      status: 'success',
    });
  },

  triggerSnapshotBackup: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    get().addAuditLog({
      userId: 'usr-001',
      userName: 'Sri V. Someshwar Rao, IAS',
      userRole: 'admin',
      action: 'DATABASE_SNAPSHOT_BACKUP',
      category: 'system',
      ipAddress: '10.14.0.12',
      resourceId: 'PG_SNAPSHOT_CLUSTER',
      details: 'Successfully captured Point-In-Time recovery snapshot (WAL streaming + PostGIS metadata).',
      status: 'success',
    });
  },

  fetchDbMetrics: async () => {
    try {
      const data = await adminApi.getMetrics();
      set({ dbMetrics: data });
      return data;
    } catch {
      return get().dbMetrics;
    }
  },

  fetchApplications: async (params) => {
    set({ isLoadingApplications: true });
    try {
      const data = await adminApi.getQueue(params);
      set({
        applications: data.items,
        applicationsTotal: data.total,
        applicationsPage: data.page,
        applicationsTotalPages: data.total_pages,
        isLoadingApplications: false,
      });
    } catch {
      set({ isLoadingApplications: false });
    }
  },

  fetchApplicationDetails: async (applicationNo) => {
    set({ isLoadingApplications: true });
    try {
      const details = await adminApi.getApplicationDetails(applicationNo);
      set({ currentApplication: details, isLoadingApplications: false });
      return details;
    } catch (e) {
      set({ isLoadingApplications: false });
      throw e;
    }
  },

  executeAdminAction: async (applicationNo, payload) => {
    const res = await adminApi.executeAction(applicationNo, payload);
    if (res?.updated_metrics) {
      set({ dbMetrics: res.updated_metrics });
    }
    // Refresh application details and queue
    await get().fetchApplications();
    if (get().currentApplication?.application_no === applicationNo) {
      await get().fetchApplicationDetails(applicationNo);
    }
    return res;
  },
}));

