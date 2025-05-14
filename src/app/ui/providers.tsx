// app/providers.tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ChakraProvider } from "@chakra-ui/react";
import ReactQueryProvider from "@/components/ReactQueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          fontSize: "15px",
        },
        elements: {
          footer: "hidden",
        },
      }}
    >
      <ChakraProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </ChakraProvider>
    </ClerkProvider>
  );
}
