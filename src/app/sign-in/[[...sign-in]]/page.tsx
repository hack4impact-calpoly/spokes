"use client";
import { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";
import WelcomeInfo from "@/components/WelcomeInfo";

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; //to prevent hydration error with google auth

  return (
    <Center
      className="my-10"
      px={{ base: 4, md: 0 }}
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      gap={10}
      minH="65vh"
    >
      <WelcomeInfo />
      <SignIn />
    </Center>
  );
}
