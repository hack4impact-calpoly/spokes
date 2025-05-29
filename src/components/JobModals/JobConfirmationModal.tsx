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
            Your job listing has been submitted for review. Upon approval, your listing will be published to the Spokes
            job board and made available to potential applicants.
          </ModalBody>
          <ModalFooter alignSelf={"center"} className="text-gray-700 text-sm sm:text-base font-normal leading-normal">
            <Flex className="flex justify-center items-center gap-4">
              <Button onClick={onClose} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800">
                Create New Job
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
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
