"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserResource } from "@clerk/types";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter } from "@chakra-ui/react";
import { useClerk } from "@clerk/nextjs";

interface TopSectionProps {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  user: UserResource | null | undefined;
}

export default function TopSection({ setPage, user }: TopSectionProps) {
  const { signOut } = useClerk();
  const testUser = { ...user, firstName: "Matt" }; // Remove this later
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <>
      <main className="flex justify-between items-center bg-white px-10 sm:px-14 py-7">
        <Link className="flex-shrink-0 max-[458px]:w-[115px] w-[200px]" href="/jobs">
          <Image
            className="h-auto"
            alt="spokes logo"
            src="/Spokes Brand/Spokes_Logo_PRINT-Transparent-BG-1.jpg"
            width={500}
            height={500}
            onClick={() => setPage("Job Board")}
          />
        </Link>
        {user ? (
          <Button
            className="flex flex-shrink-0 gap-2"
            fontWeight="medium"
            size={{ base: "xs", sm: "sm", md: "md" }}
            colorScheme="red"
            bg="#C2412E"
            onClick={openModal}
          >
            <Image
              className="w-4 h-4 md:w-5 md:h-5"
              alt="login emblem"
              width={20}
              height={20}
              src="/Spokes Brand/Spokes_login_emblem.svg"
            ></Image>
            {/* Later replae testUser with user*/ testUser.firstName}
          </Button>
        ) : (
          <Link className="sm:flex" href="/sign-in">
            <Button
              className="flex flex-shrink-0 gap-2"
              fontWeight="medium"
              size={{ base: "xs", sm: "sm", md: "md" }}
              colorScheme="blue"
              bg="#045F87"
            >
              <Image
                className="w-4 h-4 md:w-5 md:h-5"
                alt="login emblem"
                width={20}
                height={20}
                src="/Spokes Brand/Spokes_login_emblem.svg"
              ></Image>
              Login
            </Button>
          </Link>
        )}
      </main>
      {isModalOpen && (
        <Modal isCentered={true} isOpen={true} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent w={"calc(100vw - 80px)"} maxW={"450px"}>
            <ModalHeader pb={0}>Log out from Spokes?</ModalHeader>

            <ModalFooter>
              <Button onClick={closeModal} mr={3}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  signOut({ redirectUrl: "/" });
                  closeModal();
                }}
                bg="black"
                textColor="white"
                _hover={{
                  bg: "gray.800",
                }}
              >
                Log Out
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
