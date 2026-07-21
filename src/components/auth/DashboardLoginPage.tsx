"use client";

import { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import WelcomeInfo from "@/components/ui/WelcomeInfo";

export default function DashboardLoginPage({ redirectUrl }: { redirectUrl: string }) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const isAuthCallback = pathname.includes("sso-callback");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Center
      className="my-10"
      px={{ base: 4, md: 0 }}
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      gap={10}
      minH="65vh"
    >
      {!isAuthCallback && <WelcomeInfo />}
      <SignIn forceRedirectUrl={redirectUrl} />
    </Center>
  );
}
