"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserResource } from "@clerk/types";
import { Button } from "@chakra-ui/react";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

interface TopSectionProps {
  user: UserResource | null | undefined;
}

export default function TopSection({ user }: TopSectionProps) {
  return (
    <>
      <main className="flex justify-between items-center bg-white px-10 sm:px-14 py-7">
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
          <div className="flex flex-col gap-3 items-center">
            <UserButton showName={true} />
            <OrganizationSwitcher />
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
