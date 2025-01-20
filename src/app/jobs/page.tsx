"use client";
import Navbar from "@/components/Navbar";
import { FilterCard } from "@/components/FilterCard";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import JobGrid from "@/components/JobGrid";
import { IJob } from "@/database/jobSchema";

export default function Jobs() {
  const [tab, setTab] = useState(1);

  const testJobs: IJob[] = [
    {
      _id: "1",
      organizationName: "TechSolutions",
      organizationIndustry: "Technology",
      title: "Frontend Developer",
      postDate: new Date("2023-11-01"),
      expireDate: new Date("2023-12-01"),
      jobDescription: "Develop and maintain user interfaces using React.",
      employmentType: "Full-Time",
      compensationType: "Paid",
      jobStatus: "Approved",
      url: "https://techsolutions.com/jobs/1",
    },
    {
      _id: "2",
      organizationName: "GreenFuture",
      organizationIndustry: "Environmental Services",
      title: "Environmental Scientist",
      postDate: new Date("2023-10-15"),
      expireDate: new Date("2023-11-15"),
      jobDescription: "Research and develop solutions for environmental challenges.",
      employmentType: "Part Time",
      compensationType: "Non-Paid",
      jobStatus: "Pending",
      url: "https://greenfuture.com/jobs/2",
    },
  ];

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
          <JobGrid jobs={testJobs} />
        </div>
      </div>
    </div>
  );
}
