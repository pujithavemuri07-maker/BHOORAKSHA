export const CORRECTION_REASONS = [
  { value: 'missing_document', label: 'Missing / Incomplete Required Schedules' },
  { value: 'illegible_scan', label: 'Low Resolution / Illegible Scan (Under 200 DPI)' },
  { value: 'invalid_survey', label: 'Invalid Survey or Sub-Division Number' },
  { value: 'area_mismatch', label: 'Significant Boundary or Area Discrepancy' },
  { value: 'date_mismatch', label: 'Execution / Stamp Date Conflict' },
  { value: 'name_mismatch', label: 'Owner Identity / Legal Heir Mismatch' },
  { value: 'other', label: 'Other Procedural Irregularity' },
];

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING_DEO_REVIEW: { label: 'Pending DEO Review', color: 'amber' },
  API_FAILURE_MANUAL_ENTRY: { label: 'API Failure (Manual Entry)', color: 'red' },
  ROUTED_TO_VERIFIER: { label: 'Forwarded to Verifier', color: 'blue' },
  CORRECTION_REQUIRED: { label: 'Correction Requested', color: 'orange' },
  APPROVED: { label: 'Approved & Mutated', color: 'emerald' },
  REJECTED: { label: 'Rejected', color: 'rose' },
  LEGAL_REVIEW: { label: 'Legal Review Requested', color: 'purple' },
  GIS_REVIEW: { label: 'GIS Boundary Review', color: 'indigo' },
};
