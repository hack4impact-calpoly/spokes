"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@chakra-ui/react";

const Navbar: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-10">
      <div className="flex justify-between items-center bg-white px-10 sm:px-14 py-7">
        <Link className="flex-shrink-0 max-[458px]:w-[115px] w-[200px]" href="/jobs">
          <Image
            className="h-auto"
            alt="spokes logo"
            src="/Spokes Brand/Spokes_Logo_PRINT-Transparent-BG-1.jpg"
            width={500}
            height={500}
          />
        </Link>
        <Button className="flex flex-shrink-0 gap-2" fontWeight="medium" colorScheme="blue" bg="#045F87">
          <Image
            className=""
            alt="login emblem"
            width={20}
            height={20}
            src="/Spokes Brand/Spokes_login_emblem.svg"
          ></Image>
          LOGIN
        </Button>
      </div>

      <div className="flex justify-between sm:justify-start bg-[#2B2B2B] text-white sm:px-9">
        <Link
          className="font-medium text-center w-1/2 sm:w-max text-lg py-5 sm:py-7 px-5 border-y-4 border-[#2B2B2B] hover:border-b-[#C3412E]"
          href="jobs"
        >
          Job Board
        </Link>
        <Link
          className="font-medium text-center w-1/2 sm:w-max text-lg py-5 sm:py-7 px-5 border-y-4 border-[#2B2B2B] hover:border-b-[#C3412E]"
          href="list_job"
        >
          List Job
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
