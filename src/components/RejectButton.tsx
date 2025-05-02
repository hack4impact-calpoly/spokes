type RejectButtonProps = {
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
};

export default function RejectButton({ isLoading = false, onClick, className = "" }: RejectButtonProps) {
  return (
    <button type="button" onClick={onClick} disabled={isLoading} className={className}>
      {isLoading ? "Rejecting..." : "Reject"}
    </button>
  );
}
