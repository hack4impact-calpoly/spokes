"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GrInstagram } from "react-icons/gr";
import { ImFacebook2 } from "react-icons/im";
import { SiLinkedin } from "react-icons/si";
import { useUser } from "@clerk/nextjs";

const Footer: React.FC = () => {
  const { user } = useUser();

  return (
    <footer className="py-[40px] md:py-[80px] px-6 md:px-20 bg-white border-t-2 border-gray-200 flex items-center">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="flex flex-col gap-[15px] md:gap-[23px] items-center md:items-start">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src={"/Spokes Brand/spoke_upscaled_no_bg.png"}
              alt="Spokes Logo"
              width={50}
              height={50}
              className="w-[50px] h-[50px] md:w-[65px] md:h-[60px]"
            />
            <span className="ml-[16px] md:ml-[24px] font-semibold text-[18px] md:text-[24px]">Spokes</span>
          </div>

          <div className="w-full max-w-[582px] text-gray-600 text-[14px] md:text-[16px]">
            <p>
              Copyright © {new Date().getFullYear()}{" "}
              <Link
                href="https://www.spokesfornonprofits.org/"
                className="text-[14px] md:text-[16px] text-gray-600 hover:underline"
              >
                Spokes | Resources for Nonprofits.
              </Link>{" "}
              All Rights Reserved.
            </p>
            <p>PO Box 5122, San Luis Obispo, CA 93403</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start w-full md:w-auto mt-6 md:mt-0">
          <div className="flex flex-col items-center md:items-start gap-[8px] md:gap-[10px] md:w-[135px]">
            <Link href="/jobs" className="text-[14px] md:text-[16px] text-gray-600 hover:underline">
              Job Board
            </Link>
            {user && (
              <>
                <Link href="/jobform" className="text-[14px] md:text-[16px] text-gray-600 hover:underline">
                  List Job
                </Link>
                <Link href="/jobform" className="text-[14px] md:text-[16px] text-gray-600 hover:underline">
                  Dashboard
                </Link>
              </>
            )}
          </div>

          <div className="flex space-x-[10px] md:space-x-[14px] mt-4 md:mt-0 md:ml-[40px]">
            <Link href="https://www.instagram.com/spokes.for.nonprofits/" target="_blank" rel="noopener noreferrer">
              <GrInstagram width={30} height={30} className="w-[30px] h-[30px] md:w-[35px] md:h-[35px]" />
            </Link>
            <Link
              href="https://www.linkedin.com/company/spokes---resources-for-nonprofits/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiLinkedin
                style={{ fill: "#0077B5" }}
                width={30}
                height={30}
                className="w-[30px] h-[30px] md:w-[35px] md:h-[35px]"
              />
            </Link>
            <Link href="https://www.facebook.com/Spokesfornonprofits/" target="_blank" rel="noopener noreferrer">
              <ImFacebook2
                style={{ fill: "#1877F2" }}
                width={30}
                height={30}
                className="w-[30px] h-[30px] md:w-[35px] md:h-[35px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
