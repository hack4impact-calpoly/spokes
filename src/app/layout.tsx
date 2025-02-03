import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Providers from "./ui/providers";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar/NavBar";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spokes Job Board",
  description: "The job board is a place for nonprofit organizations to post their job openings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      <html lang="en">
        <body className={inter.className}>
          <ReactQueryProvider>
            <Providers>
              <NavBar />
              {children}
            </Providers>
            <ReactQueryDevtools />
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
