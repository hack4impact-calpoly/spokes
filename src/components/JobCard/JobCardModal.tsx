import { Button } from "@chakra-ui/react/button";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@chakra-ui/react";

type JobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "approve" | "reject" | "renew";
  rejectionReason?: string;
  setRejectionReason?: (reason: string) => void;
  isLoading?: boolean;
};

function JobModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  rejectionReason,
  setRejectionReason,
  isLoading,
}: JobModalProps) {
  // Map action to user friendly text
  const actionHeaderText = action === "reject" ? "rejection" : action === "renew" ? "renewal" : "approval";
  const actionText = action;
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm {actionHeaderText}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you would like to {actionText.toLowerCase()} this job posting?
          {action === "reject" ? (
            <div>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason && setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                size="sm"
                mt={2}
              />
            </div>
          ) : (
            ``
          )}
        </ModalBody>
        <ModalFooter className="flex flex-wrap gap-2 mt-4 justify-end">
          <Button
            px="10"
            width="120px"
            fontSize="small"
            fontWeight="normal"
            borderColor="black"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText={action === "reject" ? "Rejecting" : action === "renew" ? "Renewing" : "Approving"}
            sx={{
              _hover: {
                backgroundColor: "green.300",
              },
            }}
          >
            Confirm
          </Button>
          <Button
            px="10"
            width="120px"
            fontSize="small"
            fontWeight="normal"
            borderColor="black"
            onClick={onClose}
            isDisabled={isLoading}
            sx={{
              _hover: {
                backgroundColor: "red.300",
              },
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default JobModal;
