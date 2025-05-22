import React, { Suspense } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import JobFormPage from "./JobFormPage.client";
import { getAuthWithRole } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { type NextPage } from "next";

interface JobFormParentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const JobFormParentPage: NextPage<JobFormParentPageProps> = async ({ searchParams }) => {
  const { userId, orgSlug } = await auth();
  const authWithRole = getAuthWithRole({ userId, orgSlug });
  const isSpokesAdmin = authWithRole.role === "spokes_admin";

  const resolvedSearchParams = await searchParams;
  const returnURL =
    typeof resolvedSearchParams.returnURL === "string"
      ? resolvedSearchParams.returnURL
      : Array.isArray(resolvedSearchParams.returnURL)
        ? resolvedSearchParams.returnURL[0]
        : "/admin";

  return (
    <Suspense
      fallback={
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      <JobFormPage isSpokesAdmin={isSpokesAdmin} returnURL={returnURL} />
    </Suspense>
  );
};

export default JobFormParentPage;
