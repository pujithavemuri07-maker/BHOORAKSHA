export const REJECT_REASONS = [
  { id: 'document_fraud', label: 'Document Fraud / Tampered Deed Scan' },
  { id: 'invalid_ownership', label: 'Major Ownership Mismatch / Broken 30-Yr Chain of Title' },
  { id: 'survey_mismatch', label: 'Survey Number Mismatch with Cadastral Map & Master ROR' },
  { id: 'gis_conflict', label: 'Unresolved GIS Cadastral Overlap / Boundary Encroachment' },
  { id: 'legal_block', label: 'Legal Stay / Injunction / Sec 22A Prohibited Property Entry' },
  { id: 'duplicate_transaction', label: 'Duplicate / Conflicting Transaction Recorded within 180 Days' },
  { id: 'missing_evidence', label: 'Required Statutory Evidence / Link Passbook Unavailable' },
  { id: 'other', label: 'Other Irreconcilable Statutory Discrepancy' },
] as const;

export const RETURN_REASONS = [
  { id: 'name_mismatch', label: 'Name Mismatch / Surname Discrepancy with State Master' },
  { id: 'survey_mismatch', label: 'Survey Number / Subdivision Demarcation Mismatch' },
  { id: 'area_mismatch', label: 'Land Area Extent Discrepancy (>0.5% tolerance limit)' },
  { id: 'missing_document', label: 'Missing Required Link Document / Encumbrance Schedule' },
  { id: 'poor_quality', label: 'Poor Document Quality / Illegible Scan (<300 DPI)' },
  { id: 'gis_discrepancy', label: 'GIS Cadastral Boundary Buffer Conflict' },
  { id: 'mutation_mismatch', label: 'Prior Mutation Order Reference Mismatch' },
  { id: 'registration_mismatch', label: 'SRO Registration Stamp Date Disparity' },
  { id: 'manual_verification_required', label: 'Physical 1-B Village Register Cross-Check Required' },
  { id: 'other', label: 'Other Procedural Clarification Required from DEO' },
] as const;

export const ESCALATION_CATEGORIES = [
  { id: 'legal_issue', label: 'Legal Title Complexity / Civil Court Caveat' },
  { id: 'gis_conflict', label: 'GIS Boundary Dispute / Waterbody Buffer Intersection' },
  { id: 'ownership_dispute', label: 'Joint Ancestral Family Co-parcenary Dispute' },
  { id: 'registration_discrepancy', label: 'Registration Volume Stamp Delay Discrepancy' },
  { id: 'encumbrance', label: 'Unprobated Succession / Undischarged Charge' },
  { id: 'high_risk', label: 'High Review Priority Automated Flag' },
  { id: 'policy_exception', label: 'Ceiling Surplus / Government Land Policy Exemption' },
  { id: 'other', label: 'Other Executive Magistrate / Tehsildar Discretion' },
] as const;

export const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending_verification: {
    label: 'Pending Verification',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  under_verifier_review: {
    label: 'Under Verifier Review',
    color: 'text-amber-300',
    bg: 'bg-amber-500/15 border-amber-500/40',
  },
  approved: {
    label: 'Verified & Approved',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  approved_and_forwarded: {
    label: 'Verified & Approved',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-500/40',
  },
  verified_by_verifier: {
    label: 'Verified & Approved',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30',
  },
  rejected_by_verifier: {
    label: 'Rejected',
    color: 'text-rose-400',
    bg: 'bg-rose-500/15 border-rose-500/40',
  },
  returned_to_deo: {
    label: 'Returned to DEO',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/30',
  },
  escalated_to_revenue: {
    label: 'Escalated to Revenue Admin',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
  revenue_admin_review: {
    label: 'Revenue Admin Review',
    color: 'text-purple-300',
    bg: 'bg-purple-500/15 border-purple-500/40',
  },
  final_approved: {
    label: 'Final Sanctioned & Mutated',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20 border-emerald-500/50',
  },
  completed: {
    label: 'Completed & Dispatched',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/30',
  },
};
