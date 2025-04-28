"use client";
import { SignUp } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";
import WelcomeInfo from "@/components/WelcomeInfo";

export default function Page() {
  return (
    <Center
      className="my-10"
      px={{ base: 4, md: 0 }}
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      gap={10}
    >
      <WelcomeInfo />
      <SignUp />
    </Center>
  );
}
