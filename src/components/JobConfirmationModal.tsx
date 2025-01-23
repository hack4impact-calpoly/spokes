"use client";

import React, { useState } from "react";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";

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
          className="flex justify-center items-center flex-shrink-0 rounded-lg border border-black overflow-hidden"
          sx={{
            width: ["300px", "65vw"],
            maxWidth: ["350px", "65vw"],
            height: ["270px", "250px"],
          }}
        >
          <div className="flex flex-col items-start gap-[1vh] w-full h-[250px] sm:w-[65vw] sm:h-[170px] md:h-[180px]">
            <ModalHeader className="self-stretch text-black font-inter text-[1.3em] sm:text-[1.4em] font-semibold leading-normal">
              Job listing successfully submitted
            </ModalHeader>
            <ModalBody className="self-stretch text-black font-inter text-[1em] sm:text-[1.2em] font-normal leading-normal">
              An admin will review this job listing, and you will be notified once it is approved.
            </ModalBody>
            <ModalFooter
              as="a"
              href="/"
              className="text-black font-inter text-[0.8em] sm:text-[1em] font-normal leading-normal underline"
            >
              Submit new job listing
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
