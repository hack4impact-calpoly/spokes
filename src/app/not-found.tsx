"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.body.dataset.pageType = "not-found";
    window.dispatchEvent(new Event("spokes:not-found-page-change"));

    return () => {
      if (document.body.dataset.pageType === "not-found") {
        delete document.body.dataset.pageType;
      }
      window.dispatchEvent(new Event("spokes:not-found-page-change"));
    };
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex justify-center bg-white mt-12">
      <div className="max-w-md overflow-hidden p-6">
        <div className="flex justify-center mb-6">
          <Image
            src="/Spokes Brand/spoke_upscaled_no_bg.png"
            alt="Spokes Logo"
            width={56}
            height={56}
            className="mb-2"
          />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Page Not Found</h2>
        <p className="pt-2 pb-8 text-gray-600 text-center">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Choose a board to continue.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/jobs"
            className="px-6 py-3 bg-[#2B2B2B] text-white rounded-md hover:bg-[#1A1A1A] transition-colors flex items-center gap-2 font-medium shadow-sm hover:shadow-md w-full justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Go to Job Board
          </Link>
          <Link
            href="/events"
            className="px-6 py-3 bg-white text-[#2B2B2B] border border-[#2B2B2B] rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium shadow-sm hover:shadow-md w-full justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Go to Event Board
          </Link>
        </div>
      </div>
    </div>
  );
}
