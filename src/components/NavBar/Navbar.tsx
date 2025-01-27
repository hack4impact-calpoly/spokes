"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [page, setPage] = useState<string>("Job Board");
  const scrollDirection = useScrollDirection();

  return (
    <nav
      className={`flex sticky ${scrollDirection === "down" ? "-top-24" : "top-0"} z-10 justify-between sm:justify-start bg-[#2B2B2B] text-white sm:px-9 transition-all duration-500`}
    >
      <Link
        className={`font-medium text-center w-1/2 sm:w-max text-lg py-5 sm:py-7 px-5 border-y-4 border-[#2B2B2B] hover:border-b-[#C3412E] ${page == "Job Board" ? "border-b-[#C3412E]" : ""}`}
        href="jobs"
        onClick={() => setPage("Job Board")}
      >
        Job Board
      </Link>
      <Link
        className={`font-medium text-center w-1/2 sm:w-max text-lg py-5 sm:py-7 px-5 border-y-4 border-[#2B2B2B] hover:border-b-[#C3412E] ${page == "Job List" ? "border-b-[#C3412E]" : ""}`}
        href="jobform"
        onClick={() => setPage("Job List")}
      >
        List Job
      </Link>
    </nav>
  );
};

export default Navbar;

type ScrollDirection = "up" | "down" | null;

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  let lastScrollY = 0; // Use a ref to avoid re-rendering on every scroll

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";

      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 10) {
        console.log(`Scroll direction changed to: ${direction}`);
        setScrollDirection(direction);
        lastScrollY = scrollY > 0 ? scrollY : 0;
      }
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);

  return scrollDirection;
}
