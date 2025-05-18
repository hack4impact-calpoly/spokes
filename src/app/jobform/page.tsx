import React, { Suspense } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import JobFormPage from "./JobFormPage.client";
import { useOrganization } from "@clerk/nextjs";

export default function JobFormParentPage() {
  const { organization } = useOrganization();
  const isSpokesAdmin = organization?.slug == "spokes-admin";

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
