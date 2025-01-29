"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowUp } from "react-icons/fa";

interface BottomSectionProps {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

export default function BottomSection({ page, setPage }: BottomSectionProps) {
  const scrollDirection = useScrollDirection();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Show Up Arrow after 300 pixels
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      {page === "Job Board" && showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="hidden sm:flex items-center justify-center ml-auto p-3 cursor-pointer hover:scale-110 transition-transform"
          title="Scroll to Top"
        >
          <FaArrowUp size={24} />
        </div>
      )}
    </nav>
  );
}

type ScrollDirection = "up" | "down" | null;

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  let lastScrollY = 0;

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
