// app/jobform/page.jsx
import React, { Suspense } from "react";
import JobFormPage from "./JobFormPage.client";

export default function JobFormParentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobFormPage />
    </Suspense>
  );
}
