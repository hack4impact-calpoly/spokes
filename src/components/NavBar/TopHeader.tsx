"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@chakra-ui/react";

export default function SpokesHeader() {
  return (
    <main className="flex justify-between items-center bg-white px-10 sm:px-14 py-7">
      <Link className="flex-shrink-0 max-[458px]:w-[115px] w-[200px]" href="/jobs">
        <Image
          className="h-auto"
          alt="spokes logo"
          src="/Spokes Brand/Spokes_Logo_PRINT-Transparent-BG-1.jpg"
          width={500}
          height={500}
        />
      </Link>
      <Link className="hidden sm:flex" href="/sign-in">
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
    </main>
  );
}
