import React, { Suspense } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import JobFormPage from "./JobFormPage.client";

export default function JobFormParentPage() {
  return (
    <Suspense
      fallback={
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      <JobFormPage />
    </Suspense>
  );
}
