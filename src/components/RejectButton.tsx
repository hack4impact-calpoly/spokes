import { Button } from "@chakra-ui/react";

type RejectButtonProps = {
  onClick: () => void;
  className?: string;
};

export default function RejectButton({ onClick, className = "" }: RejectButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={className}
      px="10"
      width="120px"
      fontSize="sm"
      fontWeight="normal"
      border="1px"
      borderColor="black"
      backgroundColor="#f7f7f7"
      _hover={{ backgroundColor: "red.300" }}
    >
      Reject
    </Button>
  );
}
