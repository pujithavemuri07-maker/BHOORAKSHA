export const REJECT_REASONS = [
  {
    id: 'incomplete_verification',
    label: 'Incomplete Field Verification',
    description: 'One or more required officer scrutinies (DEO, Verifier, Legal, or GIS) lack necessary statutory verification or documentation.',
  },
  {
    id: 'fraud_detected',
    label: 'Document / Extent Fraud Detected',
    description: 'Discrepancy in stamp deed authenticity, forged seals, or fabricated partition shares identified.',
  },
  {
    id: 'legal_block',
    label: 'Civil Court Injunction / Legal Block',
    description: 'Active stay order, civil injunction under Order 39 CPC, or Section 52 Transfer of Property Act lis pendens caveat.',
  },
  {
    id: 'administrative_reasons',
    label: 'Administrative Statutory Conflict',
    description: 'Government poramboke classification, assigned land alienation bar, or ceiling surplus land restriction.',
  },
  {
    id: 'other',
    label: 'Other Statutory Irregularity',
    description: 'Specific irregularity documented by the Executive Magistrate / Tahsildar.',
  },
];

export const STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; border: string; bg: string }
> = {
  pending: {
    label: 'Pending Tehsildar Approval',
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    border: 'border-amber-500',
    bg: 'bg-amber-950/20',
  },
  approved: {
    label: 'Approved & Mutation Dispatched',
    badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    border: 'border-emerald-500',
    bg: 'bg-emerald-950/20',
  },
  rejected: {
    label: 'Rejected by Executive Order',
    badge: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    border: 'border-rose-500',
    bg: 'bg-rose-950/20',
  },
  mutation_pending: {
    label: 'Mutation Sync in Progress',
    badge: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    border: 'border-cyan-500',
    bg: 'bg-cyan-950/20',
  },
  mutation_completed: {
    label: 'Mutation Verified in RoR',
    badge: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    border: 'border-teal-500',
    bg: 'bg-teal-950/20',
  },
};
