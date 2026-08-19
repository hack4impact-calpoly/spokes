"use client";

import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface EventConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAnother: () => void;
  submittedForReview: boolean;
}

export default function EventConfirmationModal({
  isOpen,
  onClose,
  onCreateAnother,
  submittedForReview,
}: EventConfirmationModalProps) {
  const router = useRouter();

  return (
    <div className="modal">
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          className="flex justify-center items-center flex-shrink-0 rounded-lg border border-gray-200 overflow-hidden text-center py-8 mx-4"
          maxW={["350px", "60vw", "55vw"]}
          h={["auto", "auto"]}
          mt={["0", "0", "20vh"]}
        >
          <ModalCloseButton top={3} size={["md", "md", "lg"]} onClick={onClose} />
          <ModalHeader className="self-stretch text-gray-800 font-medium leading-normal">
            <p className="text-base sm:text-lg md:text-2xl font-semibold">What&apos;s Next?</p>
          </ModalHeader>
          <ModalBody className="self-stretch text-gray-600 text-sm sm:text-base font-normal leading-normal">
            {submittedForReview
              ? "Your event has been submitted for review. Upon approval, your event will be published to the Spokes event board and made available to the public."
              : "Your event has been updated."}
          </ModalBody>
          <ModalFooter alignSelf="center" className="text-gray-700 text-sm sm:text-base font-normal leading-normal">
            <Flex className="flex justify-center items-center gap-4">
              <Button onClick={onCreateAnother} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800">
                Create Another Event
              </Button>
              <Button
                onClick={() => router.push("/events/manage")}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                View Dashboard
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
