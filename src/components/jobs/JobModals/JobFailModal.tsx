"use client";

import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";

interface JobFailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JobFailModal({ isOpen, onClose }: JobFailModalProps) {
  return (
    <div className="modal">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          className="flex justify-center items-center flex-shrink-0 rounded-lg border border-red-500 overflow-hidden text-center py-10"
          maxW={["350px", "60vw", "55vw"]}
          h={["270px", "auto"]}
        >
          <ModalCloseButton top={3} size={["md", "md", "lg"]} onClick={onClose} />
          <ModalHeader className="self-stretch text-red-500 font-semibold leading-normal">
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold">Job Listing Submission Failed</p>
          </ModalHeader>
          <ModalBody className="self-stretch text-red-500 text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-normal">
            There was an error processing your job listing. Please try again.
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
