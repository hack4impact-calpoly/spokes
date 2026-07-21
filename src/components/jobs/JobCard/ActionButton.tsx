import { Button } from "@chakra-ui/react";

interface ActionButtonProps {
  action: "approve" | "reject" | "renew";
  isLoading?: boolean;
  onClick: () => void;
}

export default function ActionButton({ action, isLoading, onClick }: ActionButtonProps) {
  const isApprove = action === "approve";
  const isRenew = action === "renew";

  const getHoverColor = () => {
    if (isApprove) return "green.300";
    if (isRenew) return "#FFE297";
    return "red.300";
  };

  const getLoadingText = () => {
    if (isApprove) return "Approving";
    if (isRenew) return "Renewing";
    return "Rejecting";
  };

  const getButtonText = () => {
    if (isApprove) return "Approve";
    if (isRenew) return "Renew";
    return "Reject";
  };

  return (
    <Button
      className="border"
      px="10"
      width="120px"
      fontSize="small"
      fontWeight="normal"
      borderColor="black"
      backgroundColor={"#f7f7f7"}
      isLoading={isLoading}
      loadingText={getLoadingText()}
      sx={{
        _hover: {
          backgroundColor: getHoverColor(),
        },
      }}
      onClick={onClick}
    >
      {getButtonText()}
    </Button>
  );
}
