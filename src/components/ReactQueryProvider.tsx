"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
