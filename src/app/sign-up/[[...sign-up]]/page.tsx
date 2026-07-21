"use client";
import { SignUp } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import WelcomeInfo from "@/components/ui/WelcomeInfo";

export default function Page() {
  const pathname = usePathname();
  const isAuthCallback = pathname.includes("sso-callback");

  return (
    <Center
      className="my-10"
      px={{ base: 4, md: 0 }}
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      gap={10}
    >
      {!isAuthCallback && <WelcomeInfo />}
      <SignUp forceRedirectUrl="/jobs" />
    </Center>
  );
}
