"use client";
import { SignUp } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Page() {
  return (
    <Center className="my-10" px={{ base: 4, md: 0 }}>
      <SignUp />
    </Center>
  );
}
