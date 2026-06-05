"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaArrowUp } from "react-icons/fa";
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
  const { orgSlug, isSignedIn } = useAuth();
  const isSpokesAdmin = orgSlug === "spokes-admin";
  const isEventsDashboard = pathname?.startsWith("/events");
  const dashboardLinks = isEventsDashboard
    ? {
        board: { title: "Event Board", href: "/events" },
        list: { title: "List Event", href: "/events/list" },
        manage: { title: "Dashboard", href: "/events/manage" },
        admin: { title: "Admin", href: "/events/admin" },
      }
    : {
        board: { title: "Job Board", href: "/jobs" },
        list: { title: "List Job", href: "/jobs/list" },
        manage: { title: "Dashboard", href: "/jobs/manage" },
        admin: { title: "Admin", href: "/jobs/admin" },
      };

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
    if (pathname === "/jobs/list") {
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
          {/* dev/testing */}
          {/* <NavBarLink title="Job Board" href="/jobs" />
          <NavBarLink title="List Job" href="/jobform" onClick={handleListJobClick} />
          <NavBarLink title="Dashboard" href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} />
          <NavBarLink title="Admin" href="/admin" /> */}
          {/* prod */}
          <NavBarLink title={dashboardLinks.board.title} href={dashboardLinks.board.href} />
          {isSignedIn && (
            <NavBarLink
              title={dashboardLinks.list.title}
              href={dashboardLinks.list.href}
              onClick={isEventsDashboard ? () => setIsMobileMenuOpen(false) : handleListJobClick}
            />
          )}
          {isSignedIn && (
            <NavBarLink
              title={dashboardLinks.manage.title}
              href={dashboardLinks.manage.href}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          {isSignedIn && isSpokesAdmin && (
            <NavBarLink title={dashboardLinks.admin.title} href={dashboardLinks.admin.href} />
          )}
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
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="relative w-8 h-8 flex items-center justify-center"
          >
            <div className="relative w-6 h-5">
              <div
                className={`absolute rounded-full w-6 h-0.5 bg-white transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? "top-2 -translate-x-1/2 left-1/2 w-0" : "top-0 left-0"
                }`}
              />
              <div
                className={`absolute rounded-full w-6 h-0.5 bg-white transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? "top-2 left-1/2 -translate-x-1/2 rotate-45" : "top-2 left-0"
                }`}
              />
              <div
                className={`absolute rounded-full w-6 h-0.5 bg-white transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? "top-2 left-1/2 -translate-x-1/2 -rotate-45" : "top-4 left-0"
                }`}
              />
            </div>
          </button>
        </div>
        {/* Dropdown Menu: Center all text */}
        <div
          className={`flex flex-col items-center text-center px-5 pb-4 transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } space-y-1`}
        >
          {/* dev/testing */}
          {/* <NavBarLink title="Job Board" href="/jobs" onClick={() => setIsMobileMenuOpen(false)} />
          <NavBarLink title="List Job" href="/jobform" onClick={() => setIsMobileMenuOpen(false)} />
          <NavBarLink title="Dashboard" href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} />
          <NavBarLink title="Admin" href="/admin" onClick={() => setIsMobileMenuOpen(false)} /> */}
          {/* prod */}
          <NavBarLink title={dashboardLinks.board.title} href={dashboardLinks.board.href} />
          {isSignedIn && (
            <NavBarLink
              title={dashboardLinks.list.title}
              href={dashboardLinks.list.href}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          {isSignedIn && (
            <NavBarLink
              title={dashboardLinks.manage.title}
              href={dashboardLinks.manage.href}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          {isSignedIn && isSpokesAdmin && (
            <NavBarLink
              title={dashboardLinks.admin.title}
              href={dashboardLinks.admin.href}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
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
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY.current ? "down" : "up";

      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY.current) > 10) {
        console.log(`Scroll direction changed to: ${direction}`);
        setScrollDirection(direction);
        lastScrollY.current = scrollY > 0 ? scrollY : 0;
      }
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);

  return scrollDirection;
}
