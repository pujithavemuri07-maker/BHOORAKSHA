import { UserRole } from '../types/user';

export interface RoleConfig {
  code: UserRole;
  name: string;
  port: number;
  realWorldTitle: string;
  description: string;
  permissions: string[];
}

export const PERMISSIONS = {
  UPLOAD_DOCUMENTS: 'UPLOAD_DOCUMENTS',
  TRACK_OWN_APPLICATIONS: 'TRACK_OWN_APPLICATIONS',
  VIEW_ALL_APPLICATIONS: 'VIEW_ALL_APPLICATIONS',
  VIEW_AI_EXTRACTED_DATA: 'VIEW_AI_EXTRACTED_DATA',
  MANUAL_DATA_ENTRY: 'MANUAL_DATA_ENTRY',
  APPROVE_REJECT_FIRST_STAGE: 'APPROVE_REJECT_FIRST_STAGE',
  FINAL_APPROVE_REJECT: 'FINAL_APPROVE_REJECT',
  LEGAL_REVIEW: 'LEGAL_REVIEW',
  GIS_REVIEW_RESOLVE: 'GIS_REVIEW_RESOLVE',
  FINAL_APPROVAL_REVENUE: 'FINAL_APPROVAL_REVENUE',
  TRIGGER_MUTATION: 'TRIGGER_MUTATION',
  VIEW_SYSTEM_METRICS: 'VIEW_SYSTEM_METRICS',
  VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
  MANAGE_USERS: 'MANAGE_USERS',
  VIEW_AI_PERFORMANCE: 'VIEW_AI_PERFORMANCE',
} as const;

export const ROLES: Record<UserRole, RoleConfig> = {
  citizen: {
    code: 'citizen',
    name: 'Citizen',
    port: 3000,
    realWorldTitle: 'Land Owner / Applicant',
    description: 'Upload documents, track applications, view AI extraction and status results',
    permissions: [
      PERMISSIONS.UPLOAD_DOCUMENTS,
      PERMISSIONS.TRACK_OWN_APPLICATIONS,
      PERMISSIONS.VIEW_AI_EXTRACTED_DATA,
    ],
  },
  deo: {
    code: 'deo',
    name: 'Data Entry Operator',
    port: 3001,
    realWorldTitle: 'Patwari (Maker)',
    description: 'Data entry, manual fallback, preliminary document transcription and validation',
    permissions: [
      PERMISSIONS.VIEW_ALL_APPLICATIONS,
      PERMISSIONS.VIEW_AI_EXTRACTED_DATA,
      PERMISSIONS.MANUAL_DATA_ENTRY,
      PERMISSIONS.APPROVE_REJECT_FIRST_STAGE,
    ],
  },
  verifier: {
    code: 'verifier',
    name: 'Verification Officer',
    port: 3002,
    realWorldTitle: 'Girdawar / Naib-Tehsildar (Checker)',
    description: 'Cross-verify against source government records, approve or reject applications',
    permissions: [
      PERMISSIONS.VIEW_ALL_APPLICATIONS,
      PERMISSIONS.VIEW_AI_EXTRACTED_DATA,
      PERMISSIONS.FINAL_APPROVE_REJECT,
    ],
  },
  legal: {
    code: 'legal',
    name: 'Legal Officer',
    port: 3003,
    realWorldTitle: 'Revenue Officer / Legal Advisor',
    description: 'Legal title review, encumbrance analysis, dispute flagging and advisory opinions',
    permissions: [
      PERMISSIONS.VIEW_ALL_APPLICATIONS,
      PERMISSIONS.VIEW_AI_EXTRACTED_DATA,
      PERMISSIONS.LEGAL_REVIEW,
    ],
  },
  gis: {
    code: 'gis',
    name: 'GIS Officer',
    port: 3004,
    realWorldTitle: 'Land Survey Commissioner',
    description: 'Boundary validation, cadastral polygon overlay, coordinate adjustment and overlap resolution',
    permissions: [
      PERMISSIONS.VIEW_ALL_APPLICATIONS,
      PERMISSIONS.VIEW_AI_EXTRACTED_DATA,
      PERMISSIONS.GIS_REVIEW_RESOLVE,
    ],
  },
  revenue: {
    code: 'revenue',
    name: 'Revenue Administrator',
    port: 3005,
    realWorldTitle: 'Tehsildar (Approver)',
    description: 'Final statutory sanction, digital certificate generation and mutation trigger',
    permissions: [
      PERMISSIONS.VIEW_ALL_APPLICATIONS,
      PERMISSIONS.VIEW_AI_EXTRACTED_DATA,
      PERMISSIONS.FINAL_APPROVE_REJECT,
      PERMISSIONS.FINAL_APPROVAL_REVENUE,
      PERMISSIONS.TRIGGER_MUTATION,
    ],
  },
  admin: {
    code: 'admin',
    name: 'System Administrator',
    port: 3006,
    realWorldTitle: 'CCLA / District Collector',
    description: 'System telemetry, immutable audit logs, user management and AI pipeline monitoring',
    permissions: [
      PERMISSIONS.VIEW_ALL_APPLICATIONS,
      PERMISSIONS.VIEW_AI_EXTRACTED_DATA,
      PERMISSIONS.VIEW_SYSTEM_METRICS,
      PERMISSIONS.VIEW_AUDIT_LOGS,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.VIEW_AI_PERFORMANCE,
    ],
  },
};

export const hasPermission = (role: UserRole, permission: string): boolean => {
  return ROLES[role]?.permissions.includes(permission) || false;
};
