"use client";
import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";
import NavBarLink from "./NavBarLink";
import { useFormReset } from "@/app/jobform/FormResetContext";
import { useAuth } from "@clerk/nextjs";

export default function BottomSection() {
  const scrollDirection = useScrollDirection();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { triggerReset } = useFormReset();
  const { has } = useAuth();

  useEffect(() => {
    const handleScroll: EventListener = () => {
      setShowScrollToTop(window.scrollY > 300 && pathname === "/jobs");
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleListJobClick = () => {
    triggerReset();
    setIsMobileMenuOpen(false);
    if (pathname === "/jobform") {
      window.location.replace(pathname);
    }
  };

  return (
    <nav
      className={`sticky z-10 bg-[#2B2B2B] text-white transition-all duration-500 ${
        scrollDirection === "down" ? "-top-24" : "top-0"
      } ${isMobileMenuOpen ? "!top-0" : ""}`}
    >
      {/* Desktop Navigation (visible on sm and up) */}
      <div className="hidden sm:flex justify-between items-center px-9 py-.5 text-xs sm:text-sm md:text-md lg:text-lg">
        <div className="flex">
          <NavBarLink title="Job Board" href="/jobs" />
          <NavBarLink title="List Job" href="/jobform" onClick={handleListJobClick} />
          {/* uncomment this to only allow org admins, in the future we only want spokes admin on this page  */}
          {has && has({ role: "org:admin" }) && <NavBarLink title="Spokes Dashboard" href="admin" />}
        </div>
        {showScrollToTop && (
          <div
            onClick={scrollToTop}
            className="flex items-center justify-center p-3 cursor-pointer hover:scale-110 transition-transform"
            title="Scroll to Top"
          >
            <FaArrowUp size={24} />
          </div>
        )}
      </div>

      {/* Mobile Navigation (visible below sm) */}
      <div className="sm:hidden flex flex-col">
        {/* Header: Hamburger icon on the right */}
        <div className="flex justify-end items-center px-4 py-4 mt-3">
          <button onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <FiX size={27} /> : <FiMenu size={27} />}
          </button>
        </div>
        {/* Dropdown Menu: Center all text */}
        <div
          className={`flex flex-col items-center text-center px-5 pb-4 transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } space-y-1`}
        >
          <NavBarLink title="Job Board" href="jobs" onClick={() => setIsMobileMenuOpen(false)} />
          <NavBarLink title="List Job" href="jobform" onClick={() => setIsMobileMenuOpen(false)} />
          {/* uncomment this to only allow org admins, in the future we only want spokes admin on this page  */}
          {has && has({ role: "org:admin" }) && (
            <NavBarLink title="Spokes Dashboard" href="admin" onClick={() => setIsMobileMenuOpen(false)} />
          )}
          <NavBarLink title="Spokes Dashboard" href="admin" onClick={() => setIsMobileMenuOpen(false)} />
          {showScrollToTop && (
            <div
              onClick={() => {
                scrollToTop();
                setIsMobileMenuOpen(false);
              }}
              className="mt-1 flex items-center justify-center p-2 cursor-pointer hover:scale-110 transition-transform"
              title="Scroll to Top"
            >
              <FaArrowUp size={20} />
              <span className="ml-2">Top</span>
            </div>
          )}
        </div>
      </div>
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
