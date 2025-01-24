"use client";
import Navbar from "@/components/Navbar";
import { FilterCard } from "@/components/FilterCard";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import JobGrid from "@/components/JobGrid";
import { IJob } from "@/database/jobSchema";
import { Loader } from "@/components/Loader";

// Interfaces to make TS happy
interface FilterCategories {
  [key: string]: string[];
}

interface FilterState {
  [key: string]: string[];
}

const noJobsFound = () => {
  return (
    <div className="grow flex flex-col gap-6 justify-center items-center mt-10">
      <h1 className="text-3xl font-bold">No Jobs Found</h1>
      <p className="text-lg text-center">Try again with some different filters!</p>
    </div>
  );
};

export default function Jobs() {
  const [tab, setTab] = useState(1);

  const [jobData, setJobData] = useState<null | IJob[]>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/jobs");
      const result = await response.json();
      console.log(result);
      setJobData(result);
    };

    fetchData();
  }, []);

  // State to manage filters
  const [filters, setFilters] = useState<FilterState>({
    employment: [],
    compensation: [],
  });

  // Define filter categories
  const filterCategories: FilterCategories = {
    employment: ["Full-time", "Part-time"],
    compensation: ["Paid", "Volunteer"],
  };

  const handleFilterChange = (category: string, value: string) => {
    setFilters((prev) => {
      const currentFilters = prev[category];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter((item) => item !== value)
        : [...currentFilters, value];

      return { ...prev, [category]: newFilters };
    });
  };

  const filteredJobs =
    jobData?.filter(
      (job) =>
        (filters.employment.length === 0 || filters.employment.includes(job.employmentType)) &&
        (filters.compensation.length === 0 || filters.compensation.includes(job.compensationType)),
    ) || [];

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar></Navbar>
      <div className="mt-20 px-8 md:px-16 lg:px-20 flex flex-col lg:flex-row gap-16 lg:gap-8 grow">
        <div className="flex flex-col gap-4 lg:gap-6">
          <div className="text-black font-semibold text-3xl select-none">Filters</div>
          <div>
            <FilterCard categories={filterCategories} onFilterChange={handleFilterChange}></FilterCard>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 lg:gap-6">
          <div className="flex gap-8 w-full">
            <div
              className={twMerge(
                "text-black text-3xl cursor-pointer select-none",
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
                "text-black text-3xl cursor-pointer select-none",
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
          {/* Conditional rendering for jobData with loader as fallback */}
          {jobData ? (
            <div>
              <JobGrid jobs={filteredJobs} />
              {filteredJobs.length === 0 ? noJobsFound() : null}
            </div>
          ) : (
            <Loader
              size="xl"
              label="Loading Jobs..."
              className="grow flex flex-col gap-6 justify-center items-center lg:-mt-28 mt-28"
            ></Loader>
          )}
        </div>
      </div>
    </div>
  );
}
