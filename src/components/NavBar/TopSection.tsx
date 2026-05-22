"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserResource } from "@clerk/types";
import { Button, Tooltip, Box } from "@chakra-ui/react";
import { UserButton, OrganizationSwitcher, useSession } from "@clerk/nextjs";
import { useOrganizationList } from "@clerk/nextjs";

const SPOKES_SITE_URL = "https://www.spokesfornonprofits.org/what-do-we-do/";

interface TopSectionProps {
  user: UserResource | null | undefined;
}

export default function TopSection({ user }: TopSectionProps) {
  const { session } = useSession();
  const pathname = usePathname();
  const onboardingComplete = session?.user?.publicMetadata?.onboardingComplete === true;
  const loginUrl =
    pathname?.startsWith("/eventsDashboard") || pathname?.startsWith("/events") ? "/eventsLogin" : "/jobsLogin";

  const afterSignOutUrl =
    pathname?.startsWith("/eventsDashboard") || pathname?.startsWith("/events")
      ? "/eventsDashboard/events"
      : "/jobsDashboard/jobs";

  return (
    <>
      <main className="flex items-center justify-between px-10 bg-white sm:px-14 py-7">
        <Link href={SPOKES_SITE_URL} className="flex-shrink-0 max-[458px]:w-[115px] w-[200px] cursor-pointer">
          <Image
            className="h-auto"
            alt="spokes logo"
            src="/Spokes Brand/Spokes_Logo_PRINT-Transparent-BG-1.jpg"
            width={500}
            height={500}
          />
        </Link>
        {user ? (
          <SignedInControls onboardingComplete={onboardingComplete} afterSignOutUrl={afterSignOutUrl} />
        ) : (
          <Link href={loginUrl}>
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

function SignedInControls({
  onboardingComplete,
  afterSignOutUrl,
}: {
  onboardingComplete: boolean;
  afterSignOutUrl: string;
}) {
  const { isLoaded, userMemberships } = useOrganizationList({
    userMemberships: true,
  });
  const hasOrgMembership = isLoaded && userMemberships.data?.length > 0;

  return (
    <div className="flex flex-col items-center gap-3">
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
        <UserButton showName={true} afterSignOutUrl={afterSignOutUrl} />
      </div>
      {hasOrgMembership && <OrganizationSwitcher />}
    </div>
  );
}
