import React, { Suspense } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import JobFormPage from "./JobFormPage.client";
import { getAuthWithRole } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";

export default async function JobFormParentPage() {
  const { userId, orgSlug } = await auth();
  const authWithRole = getAuthWithRole({ userId, orgSlug });
  const isSpokesAdmin = authWithRole.role == "spokes_admin";

  return (
    <Suspense
      fallback={
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      <JobFormPage isSpokesAdmin={isSpokesAdmin} />
    </Suspense>
  );
}
