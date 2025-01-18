"use client";
import Navbar from "@/components/Navbar";
import { FilterCard } from "@/components/FilterCard";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import JobCard from "@/components/JobCard";

export default function Jobs() {
  const [tab, setTab] = useState(1);
  return (
    <div className="w-full h-full">
      <Navbar></Navbar>
      <div className="mt-20 px-8 md:px-16 lg:px-20 flex flex-col lg:flex-row gap-16 lg:gap-8">
        <div>
          <div className="text-black font-semibold text-3xl mb-2 lg:mb-6 select-none">Filters</div>
          <div>
            <FilterCard></FilterCard>
          </div>
        </div>
        <div className="w-full">
          <div className="flex gap-8 w-full">
            <div
              className={twMerge(
                "text-black text-3xl mb-2 lg:mb-6 cursor-pointer select-none",
                tab == 1 ? "font-semibold" : "font-normal text-[#C3C3C3]",
              )}
              onClick={() => {
                // Later add functionally to display listings
                setTab(1);
              }}
            >
              All Jobs
            </div>
            <div
              className={twMerge(
                "text-black text-3xl mb-6 cursor-pointer select-none",
                tab == 2 ? "font-semibold" : "font-normal text-[#C3C3C3]",
              )}
              onClick={() => {
                // Later add functionally to display listings
                setTab(2);
              }}
            >
              Recently Viewed
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <JobCard></JobCard>
            <JobCard></JobCard>
            <JobCard></JobCard>
            <JobCard></JobCard>
            <JobCard></JobCard>
            <JobCard></JobCard>
            <JobCard></JobCard>
            <JobCard></JobCard>
          </div>
        </div>
      </div>
    </div>
  );
}
