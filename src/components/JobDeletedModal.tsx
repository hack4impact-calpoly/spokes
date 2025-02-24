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
} from "@chakra-ui/react";

interface JobDeletedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JobDeletedModal({ isOpen, onClose }: JobDeletedModalProps) {
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
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold">Job listing successfully deleted</p>
          </ModalHeader>
          <ModalBody className="self-stretch text-black text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-normal"></ModalBody>
          <ModalFooter
            as="a"
            href="/jobs"
            alignSelf={"center"}
            className="text-black text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-normal underline"
          >
            return to job board
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
