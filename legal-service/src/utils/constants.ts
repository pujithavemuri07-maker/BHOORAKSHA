export const LEGAL_FLAG_TYPES = [
  {
    type: 'ownership_inconsistency',
    label: 'Ownership Inconsistency',
    act: 'Transfer of Property Act, 1882 (Sec 54)',
    color: 'amber',
  },
  {
    type: 'registration_irregularity',
    label: 'Registration Irregularity',
    act: 'Registration Act, 1908 (Sec 23 & 25)',
    color: 'amber',
  },
  {
    type: 'document_fraud',
    label: 'Document Fraud / Tampering',
    act: 'Indian Penal Code / BNS (Sec 467/468/471)',
    color: 'red',
  },
  {
    type: 'under_litigation',
    label: 'Under Litigation / Court Stay',
    act: 'Code of Civil Procedure, 1908 (Order 39 R 1-2)',
    color: 'red',
  },
  {
    type: 'invalid_title',
    label: 'Invalid Title / Defective Lineage',
    act: 'Transfer of Property Act, 1882 (Sec 41 & 43)',
    color: 'red',
  },
  {
    type: 'non_transferable',
    label: 'Non-Transferable Govt / Assigned Land',
    act: 'Prohibition of Transfer Act (POT) & Sec 22-A',
    color: 'red',
  },
  {
    type: 'missing_legal_documents',
    label: 'Missing Prior Link Documents',
    act: 'Registration Act, 1908 (Rule 26-k)',
    color: 'blue',
  },
  {
    type: 'suspicious_transfer',
    label: 'Suspicious / Benami Transaction',
    act: 'Prohibition of Benami Property Transactions Act, 1988',
    color: 'purple',
  },
  {
    type: 'succession_issue',
    label: 'Succession / Coparcenary Dispute',
    act: 'Hindu Succession Act, 1956 / Indian Succession Act',
    color: 'amber',
  },
  {
    type: 'encumbrance_concern',
    label: 'Undischarged Mortgage / Bank Charge',
    act: 'SARFAESI Act, 2002 / Transfer of Property Act',
    color: 'rose',
  },
  {
    type: 'stamp_duty_issue',
    label: 'Deficit Stamp Duty / Undervaluation',
    act: 'Indian Stamp Act, 1899 (Sec 47-A)',
    color: 'yellow',
  },
] as const;

export const FLAG_REASONS = [
  { value: 'ownership_dispute', label: 'Ownership Inconsistency or Conflicting Claimant' },
  { value: 'registration_irregularity', label: 'Registration Irregularity or Presentation Delay' },
  { value: 'missing_legal_documents', label: 'Missing Prior Link Documents or Partition Deed' },
  { value: 'suspicious_transfer', label: 'Suspicious Undervalued or Power-of-Attorney Transfer' },
  { value: 'succession_issue', label: 'Intestate Succession / Coparcenary Rights Not Resolved' },
  { value: 'encumbrance_concern', label: 'Undischarged Bank Mortgage or Private Charge' },
  { value: 'stamp_duty_issue', label: 'Deficit Stamp Duty or Evasion Notice' },
  { value: 'other', label: 'Other Procedural Legal Discrepancy' },
];

export const BLOCK_REASONS = [
  { value: 'document_fraud', label: 'Document Fraud / Forged Stamp Certificate' },
  { value: 'invalid_title', label: 'Void Ab Initio / Broken Chain of Title' },
  { value: 'forged_ownership', label: 'Impersonation of Title Holder / Forged Execution' },
  { value: 'under_litigation', label: 'Sub-Judice / Active Court Injunction or Stay Order' },
  { value: 'non_transferable', label: 'Section 22-A Prohibited / Govt Assigned / Waqf Land' },
  { value: 'legal_attachment', label: 'Court Attachment or Recovery Proceeding by DRT' },
  { value: 'benami_transaction', label: 'Benami Holding / Prohibited Transaction' },
  { value: 'other', label: 'Other Statutory Invalidation' },
];

export const STATUTORY_CITATIONS = [
  'Registration Act, 1908 - Section 22-A (Prohibition of Registration of Certain Documents)',
  'Registration Act, 1908 - Section 23 (Time for Presenting Documents)',
  'Transfer of Property Act, 1882 - Section 52 (Doctrine of Lis Pendens)',
  'Transfer of Property Act, 1882 - Section 54 (Sale and Transfer of Immovable Property)',
  'Hindu Succession Act, 1956 - Section 6 (Devolution of Interest in Coparcenary Property)',
  'Indian Stamp Act, 1899 - Section 47-A (Undervaluation and Deficit Stamp Duty)',
  'Prohibition of Benami Property Transactions Act, 1988 (Section 3)',
  'SARFAESI Act, 2002 - Section 13(4) (Enforcement of Security Interest)',
  'Civil Procedure Code, 1908 - Order 39 Rules 1 & 2 (Temporary Injunctions)',
];

export const SEVERITY_COLORS = {
  high: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    badge: 'bg-red-900/40 text-red-300 border-red-500/40',
  },
  medium: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: 'bg-amber-900/40 text-amber-300 border-amber-500/40',
  },
  low: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    badge: 'bg-blue-900/40 text-blue-300 border-blue-500/40',
  },
};

export const STATUS_COLORS = {
  pending_legal_review: {
    label: 'Pending Legal Review',
    color: 'amber',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  cleared_by_legal: {
    label: 'Cleared by Legal',
    color: 'emerald',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  flagged_by_legal: {
    label: 'Flagged for Rectification',
    color: 'orange',
    badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
  },
  blocked_by_legal: {
    label: 'Legally Blocked',
    color: 'red',
    badge: 'bg-red-500/10 text-red-300 border-red-500/30',
  },
  escalated_by_legal: {
    label: 'Escalated to Tehsildar',
    color: 'purple',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
};
