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
import { FormEvent } from "react";

type JobEditedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: FormEvent) => void;
  isLoading?: boolean;
};

function JobEditedModal({ isOpen, onClose, onConfirm, isLoading }: JobEditedModalProps) {
  const actionText = "edit";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(e);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm {actionText}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you would like to {actionText} this job posting? Your changes will require approval from a Spokes
          administrator before the job listing becomes live on the job board.
        </ModalBody>
        <ModalFooter>
          <form onSubmit={handleSubmit} className="flex gap-2 justify-center w-full">
            <Button
              type="submit"
              px="10"
              width="120px"
              fontSize="small"
              fontWeight="normal"
              borderColor="black"
              isLoading={isLoading}
              loadingText="Updating..."
              sx={{ _hover: { backgroundColor: "green.300" } }}
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
              sx={{ _hover: { backgroundColor: "red.300" } }}
            >
              Cancel
            </Button>
          </form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default JobEditedModal;
