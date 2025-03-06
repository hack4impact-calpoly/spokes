"use client";
import { FilterCard } from "@/components/FilterCard";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import JobGrid from "@/components/JobGrid";
import { IJob } from "@/database/jobSchema";
import { Loader } from "@/components/Loader";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

// Interfaces to make TS happy
interface FilterCategories {
  [key: string]: string[];
}

interface FilterState {
  [key: string]: string[];
}

const fetchJobs = async ({ pageParam = 1, filters }: { pageParam?: number; filters: FilterState }) => {
  console.log("fetching: ", pageParam);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");

  const url = new URL(`${baseUrl}/api/jobs`);
  // Add pagination parameters
  url.searchParams.append("page", pageParam.toString());
  url.searchParams.append("limit", "12");

  // Add filter parameters
  if (filters.employment.length > 0) {
    filters.employment.forEach((filter) => url.searchParams.append("employmentType", filter));
  }
  if (filters.compensation.length > 0) {
    filters.compensation.forEach((filter) => url.searchParams.append("compensationType", filter));
  }
  if (filters.industry.length > 0) {
    filters.industry.forEach((filter) => url.searchParams.append("organizationIndustry", filter));
  }

  console.log(url.toString());
  const response = await fetch(url.toString());
  const data = await response.json();
  return data;
};

export default function Jobs() {
  const [tab, setTab] = useState(1);

  const [jobData, setJobData] = useState<null | IJob[]>(null);
  const [recentJobs, setRecentJobs] = useState<null | IJob[]>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasLoadedRecentJobs, setHasLoadedRecentJobs] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/jobs");
      const result = await response.json();
      setJobData(result);
    };
    fetchData();
  }, []);

  // Maps shorter filter name to longer job industry name
  const industryValueMapping = {
    Arts: "Arts & Culture",
    Education: "Education & Research",
    Health: "Health & Human Services",
    "Social Services": "Human & Social Services",
    "Community Development": "Community & Economic Development",
    Environment: "Environment & Animals",
    Youth: "Youth Development & Recreation",
    Faith: "Faith-Based & Spiritual",
    "Civil Rights": "Civil Rights & Advocacy",
    "Humanitarian Aid": "International Development & Humanitarian Aid",
  };

  // State to manage filters
  const [filters, setFilters] = useState<FilterState>({
    employment: [],
    compensation: [],
    industry: [],
  });

  // Define filter categories
  const filterCategories: FilterCategories = {
    employment: ["Full-time", "Part-time"],
    compensation: ["Paid", "Volunteer"],
  };

  // Handler to fetch recent jobs by IDs
  const fetchRecentJobs = async () => {
    const raw = localStorage.getItem("myJobs");
    const recentJobIds = raw ? JSON.parse(raw) : [];

    if (recentJobIds.length > 0) {
      const recentJobsresponse = await fetch("/api/jobs/recent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawJobIdArray: recentJobIds }),
      });
      const recentJobsResult = await recentJobsresponse.json();
      setRecentJobs(recentJobsResult);
    } else {
      setRecentJobs([]);
    }
  };

  const handleFilterChange = (category: string, value: string) => {
    setFilters((prev) => {
      const currentFilters = prev[category];
      const mappedValue =
        category === "industry" ? industryValueMapping[value as keyof typeof industryValueMapping] : value;

      const newFilters = currentFilters.includes(mappedValue)
        ? currentFilters.filter((item) => item !== mappedValue)
        : [...currentFilters, mappedValue];

      return { ...prev, [category]: newFilters };
    });
  };

  const handleJobView = (job: IJob) => {
    if (recentJobs) {
      setRecentJobs([...recentJobs, job]);
    }
  };

  const handleClearRecentJobs = () => {
    localStorage.removeItem("myJobs");
    setRecentJobs([]);
    onClose();
  };

  const handleTabChange = async (tabNumber: number) => {
    setTab(tabNumber);
    if (tabNumber === 2 && !hasLoadedRecentJobs) {
      await fetchRecentJobs();
      setHasLoadedRecentJobs(true);
    }
  };

  const filteredRecentJobs =
    recentJobs &&
    Array.from(recentJobs)?.filter(
      (job) =>
        (filters.employment.length === 0 || filters.employment.includes(job.employmentType)) &&
        (filters.compensation.length === 0 || filters.compensation.includes(job.compensationType)) &&
        (filters.industry.length === 0 ||
          filters.industry.some((industry) => job.organizationIndustry.includes(industry))),
    );

  const {
    data: fetchedJobs,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["jobs", filters],
    queryFn: ({ pageParam = 1 }) => fetchJobs({ pageParam, filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 12 ? allPages.length + 1 : undefined;
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="w-full flex flex-col pb-10">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col lg:flex-row gap-16 lg:gap-8 grow">
        <div className="flex flex-col gap-4 lg:gap-6">
          <div className="text-black font-semibold text-3xl select-none lg:sticky lg:top-[110px]">Filters</div>
          <FilterCard categories={filterCategories} onFilterChange={handleFilterChange}></FilterCard>
        </div>
        <div className="flex flex-col w-full gap-4 lg:gap-6">
          <div className="flex items-center justify-between max-[500px]:flex-col max-[500px]:items-stretch">
            <div className="flex gap-8 max-[500px]:justify-center max-[500px]:gap-4">
              <div
                className={twMerge(
                  "text-black text-xl sm:text-2xl md:text-3xl cursor-pointer select-none",
                  tab == 1 ? "font-semibold" : "font-normal text-[#C3C3C3]",
                )}
                onClick={() => handleTabChange(1)}
              >
                All Jobs
              </div>
              <div
                className={twMerge(
                  "text-black text-xl sm:text-2xl md:text-3xl cursor-pointer select-none",
                  tab == 2 ? "font-semibold" : "font-normal text-[#C3C3C3]",
                )}
                onClick={() => handleTabChange(2)}
              >
                Recently Viewed
              </div>
            </div>
            {tab === 2 && (
              <div className="max-[500px]:mt-4 max-[500px]:flex max-[500px]:justify-center">
                <Button onClick={onOpen} fontWeight="normal" variant="outline" borderColor="black" size="sm">
                  Clear History
                </Button>
              </div>
            )}
          </div>
          {tab == 1 ? (
            <>
              {fetchedJobs ? (
                <>
                  <JobGrid jobs={fetchedJobs.pages.flat()} innerRef={ref} onJobView={handleJobView} />
                  {isFetchingNextPage && <Loader size="xl" label="Loading more jobs..." />}
                </>
              ) : (
                <Loader
                  size="xl"
                  label="Loading Jobs..."
                  className="flex flex-col items-center justify-center gap-6 grow lg:-mt-28 mt-28"
                />
              )}
            </>
          ) : (
            <>
              {filteredRecentJobs ? (
                <JobGrid jobs={filteredRecentJobs} onJobView={handleJobView} />
              ) : (
                <Loader
                  size="xl"
                  label="Loading Jobs..."
                  className="flex flex-col items-center justify-center gap-6 grow lg:-mt-28 mt-28"
                />
              )}
            </>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Clear History</ModalHeader>
          <ModalBody>Are you sure you want to clear your recently viewed jobs?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleClearRecentJobs} bg="black" color="white" _hover={{ bg: "gray.800" }}>
              Clear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
