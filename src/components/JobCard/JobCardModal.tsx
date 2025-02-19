import { Button } from "@chakra-ui/react/button";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

type JobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "approve" | "reject" | "renew";
};

function JobModal({ isOpen, onClose, onConfirm, action }: JobModalProps) {
  // Map action to user friendly text
  const actionText = action === "reject" ? "rejection" : action === "renew" ? "renewal" : "approval";

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm {actionText}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you would like to {actionText} this job posting?</ModalBody>
        <ModalFooter className="flex flex-wrap gap-2 mt-4 justify-end">
          <Button
            px="10"
            colorScheme="green"
            width="120px"
            fontSize="small"
            fontWeight="normal"
            borderColor="black"
            onClick={onConfirm}
          >
            Confirm
          </Button>
          <Button
            px="10"
            colorScheme="red"
            width="120px"
            fontSize="small"
            fontWeight="normal"
            borderColor="black"
            onClick={onClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default JobModal;
