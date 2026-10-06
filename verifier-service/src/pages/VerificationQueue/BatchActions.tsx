import { BatchActionsBar } from '../../components/BatchActionsBar';

interface BatchActionsProps {
  selectedIds: string[];
  onClear: () => void;
  onBatchApprove: (ids: string[], remarks: string) => void;
  onBatchReject: (ids: string[], reason: string, remarks: string) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export const BatchActions = (props: BatchActionsProps) => {
  return <BatchActionsBar {...props} />;
};
