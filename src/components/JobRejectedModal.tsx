import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  Button,
} from "@chakra-ui/react";

interface JobRejectedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
}

function JobRejectedModal({ isOpen, onClose, onConfirm }: JobRejectedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        className="flex justify-center items-center flex-shrink-0 rounded-lg border border-black overflow-hidden text-center py-10"
        maxW={["350px", "60vw", "55vw"]}
        h={["270px", "auto"]}
      >
        <ModalCloseButton top={3} size={["md", "md", "lg"]} onClick={onClose} />
        <ModalHeader className="self-stretch text-black font-semibold leading-normal">
          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold">Reject Job</p>
        </ModalHeader>
        <ModalBody>
          <Textarea placeholder="Enter reason for rejection..." size="sm" />
        </ModalBody>
        <ModalFooter>
          <Button>Cancel</Button>
          <Button colorScheme="red">Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default JobRejectedModal;
