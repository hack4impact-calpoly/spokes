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

type JobDeletedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function JobDeletedModal({ isOpen, onClose, onConfirm }: JobDeletedModalProps) {
  // Map action to user friendly text
  const actionText = "delete";
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
            width="120px"
            fontSize="small"
            fontWeight="normal"
            borderColor="black"
            onClick={onConfirm}
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

export default JobDeletedModal;
