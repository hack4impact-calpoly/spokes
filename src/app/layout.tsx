import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Providers from "./ui/providers";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar/NavBar";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import Footer from "@/components/Footer/Footer";

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
        layout: {
          unsafe_disableDevelopmentModeWarnings: true, //to get rid of the deployment warning on clerk
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
          </ReactQueryProvider>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
