"use client";
import Navbar from "@/components/Navbar";
import { FilterCard } from "@/components/FilterCard";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import JobGrid from "@/components/JobGrid";
import { IJob } from "@/database/jobSchema";
import { Loader } from "@/components/Loader";
import { filter } from "@chakra-ui/react";

// Interfaces to make TS happy
interface FilterCategories {
  [key: string]: string[];
}

interface FilterState {
  [key: string]: string[];
}

export default function Jobs() {
  const [tab, setTab] = useState(1);

  const [jobData, setJobData] = useState<null | IJob[]>(null);

  // hardcoded list of jobs
  const [recentJobs, setRecentJobs] = useState<IJob[]>([
    // Hardcoded recently viewed jobs
    {
      _id: "1",
      organizationName: "Tech Corp",
      organizationIndustry: "Technology",
      title: "Software Engineer",
      postDate: new Date("2024-01-15"),
      expireDate: new Date("2024-02-15"),
      jobDescription: "Develop and maintain software solutions.",
      employmentType: "full-time",
      compensationType: "paid",
      jobStatus: "Open",
      url: "https://techcorp.com/jobs/software-engineer",
    },
    {
      _id: "2",
      organizationName: "InnovateX",
      organizationIndustry: "Product Development",
      title: "Product Manager",
      postDate: new Date("2024-01-10"),
      expireDate: new Date("2024-02-10"),
      jobDescription: "Lead product development initiatives.",
      employmentType: "part-time",
      compensationType: "paid",
      jobStatus: "Open",
      url: "https://innovatex.com/careers/product-manager",
    },
    {
      _id: "3",
      organizationName: "Creative Solutions",
      organizationIndustry: "Design",
      title: "UX Designer",
      postDate: new Date("2024-01-20"),
      expireDate: new Date("2024-03-01"),
      jobDescription: "Design user experiences and interfaces.",
      employmentType: "volunteer",
      compensationType: "non-paid",
      jobStatus: "Open",
      url: "https://creativesolutions.com/jobs/ux-designer",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/jobs");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const result = await response.json();
        setJobData(result);
      } catch (error) {
        console.error(error);
        setJobData([]); // Avoid null errors
      }
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
    employment: ["Full-time", "Part-time", "Volunteer"],
    compensation: ["Paid", "Non-paid"],
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

  // make change here
  const filteredJobs = (jobs: IJob[] | null) => {
    if (!jobs || jobs.length === 0) return []; // Ensure jobs is always an array
    return jobs.filter(
      (job) =>
        (filters.employment.length === 0 || filters.employment.includes(job.employmentType)) &&
        (filters.compensation.length === 0 || filters.compensation.includes(job.compensationType)),
    );
  };

  const [filteredRecentJobs, setFilteredRecentJobs] = useState<IJob[]>(recentJobs);

  useEffect(() => {
    setFilteredRecentJobs(filteredJobs(recentJobs));
  }, [filters]); // Remove `recentJobs` to prevent unnecessary re-renders

  const currentJobs = tab === 1 ? filteredJobs(jobData) : filteredJobs(recentJobs);
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
          {currentJobs ? (
            <div>
              <JobGrid jobs={currentJobs} />
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
