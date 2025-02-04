"use client";

import React, { useState } from "react";
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

export default function JobConfirmationModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="modal">
      <Button onClick={openModal}>Open Modal</Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent
          className="flex justify-center items-center flex-shrink-0 rounded-lg border border-black overflow-hidden text-center py-10"
          maxW={["350px", "60vw", "55vw"]}
          h={["270px", "auto"]}
        >
          <ModalCloseButton top={3} size={["md", "md", "lg"]} onClick={closeModal} />
          <ModalHeader className="self-stretch text-black font-semibold leading-normal">
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold">Job listing successfully submitted</p>
          </ModalHeader>
          <ModalBody className="self-stretch text-black text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-normal">
            An admin will review this job listing, and you will be notified once it is approved.
          </ModalBody>
          <ModalFooter
            as="a"
            href="/"
            alignSelf={"center"}
            className="text-black text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-normal underline"
          >
            Submit new job listing
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
