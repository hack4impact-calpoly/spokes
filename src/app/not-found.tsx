"use client";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
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
        <p className="pt-2 pb-10 text-gray-600 text-center">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <ul className="space-y-3 relative list-none">
          <li className="pl-6 relative">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-[#045F87] text-white flex items-center justify-center text-sm font-bold">
              1
            </span>
            <p className="pl-2">Check if the URL is correct</p>
          </li>
          <li className="pl-6 relative">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-[#045F87] text-white flex items-center justify-center text-sm font-bold">
              2
            </span>
            <p className="pl-2">Make sure you&apos;re logged in</p>
          </li>
          <li className="pl-6 relative">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-[#045F87] text-white flex items-center justify-center text-sm font-bold">
              3
            </span>
            <p className="pl-2">Try refreshing the page</p>
          </li>
        </ul>

        <div className="mt-10">
          <Link
            href="/"
            className="px-6 py-3 bg-[#2B2B2B] text-white rounded-md hover:bg-[#1A1A1A] transition-colors flex items-center gap-2 font-medium shadow-sm hover:shadow-md w-full justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Return to Job Board
          </Link>
        </div>
      </div>
    </div>
  );
}
