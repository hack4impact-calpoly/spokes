import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Providers from "./ui/providers";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import Navbar from "@/components/Navbar";
export const metadata: Metadata = {
  title: "Spokes Job Board",
  description: "The job board is a place for nonprofit organizations to post their job openings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
