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

interface JobComfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JobConfirmationlModal({ isOpen, onClose }: JobComfirmationModalProps) {
  const router = useRouter();

  return (
    <div className="modal">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          className="flex justify-center items-center flex-shrink-0 rounded-lg border border-black overflow-hidden text-center py-10"
          maxW={["350px", "60vw", "55vw"]}
          h={["270px", "auto"]}
        >
          <ModalCloseButton top={3} size={["md", "md", "lg"]} onClick={onClose} />
          <ModalHeader className="self-stretch text-black font-semibold leading-normal">
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold">Job listing successfully submitted</p>
          </ModalHeader>
          <ModalBody className="self-stretch text-black text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-normal">
            An admin will review this job listing, and you will be notified once it is approved.
          </ModalBody>
          <ModalFooter
            alignSelf={"center"}
            className="text-black text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-normal"
          >
            <Flex className="flex justify-center items-center">
              <Button onClick={onClose} className="mx-4">
                Submit Another Job
              </Button>
              <Button onClick={() => router.push("/dashboard")} className="mx-4">
                Return to Dashboard
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
