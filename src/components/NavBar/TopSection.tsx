"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserResource } from "@clerk/types";
import { Button, Tooltip, Box } from "@chakra-ui/react";
import { UserButton, OrganizationSwitcher, useSession } from "@clerk/nextjs";

interface TopSectionProps {
  user: UserResource | null | undefined;
}

export default function TopSection({ user }: TopSectionProps) {
  const { session } = useSession();
  const onboardingComplete = session?.user?.publicMetadata?.onboardingComplete === true;

  return (
    <>
      <main className="flex items-center justify-between px-10 bg-white sm:px-14 py-7">
        <Link href="/jobs" className="flex-shrink-0 max-[458px]:w-[115px] w-[200px] cursor-pointer">
          <Image
            className="h-auto"
            alt="spokes logo"
            src="/Spokes Brand/Spokes_Logo_PRINT-Transparent-BG-1.jpg"
            width={500}
            height={500}
          />
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            {!onboardingComplete && (
              <Tooltip label="Complete your profile setup" placement="bottom">
                <Box
                  w="2"
                  h="2"
                  borderRadius="full"
                  bg="orange.400"
                  position="relative"
                  _after={{
                    content: '""',
                    position: "absolute",
                    top: "-2px",
                    left: "-2px",
                    right: "-2px",
                    bottom: "-2px",
                    borderRadius: "full",
                    border: "1px solid",
                    borderColor: "orange.400",
                    animation: "pulse 2s infinite",
                  }}
                />
              </Tooltip>
            )}
            <UserButton showName={true} />
          </div>
        ) : (
          <Link href="/sign-in">
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
              />
              Login
            </Button>
          </Link>
        )}
      </main>
    </>
  );
}
