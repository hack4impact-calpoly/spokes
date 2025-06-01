"use client";
import { FilterCard } from "@/components/FilterCard";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import JobGrid from "@/components//JobGrid/JobGrid";
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

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import JobGridSkeleton from "@/components/JobGrid/JobGridSkeleton";

// Interfaces to make TS happy
interface FilterCategories {
  [key: string]: string[];
}

interface FilterState {
  [key: string]: string[];
}

const useJobsQuery = (filters: FilterState) => {
  return useInfiniteQuery({
    queryKey: ["jobs", filters],
    queryFn: ({ pageParam = 1 }) => fetchJobs({ pageParam, filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 12 ? allPages.length + 1 : undefined;
    },
    staleTime: 60000, // Keep data fresh for 60 seconds
    gcTime: 300000, // Keep unused data in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};

const useRecentJobs = (filters: FilterState) => {
  const [recentJobIds, setRecentJobIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("myJobs");
    return raw ? JSON.parse(raw) : [];
  });

  const {
    data: recentJobs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["recentJobs", recentJobIds],
    queryFn: async () => {
      if (recentJobIds.length === 0) return [];

      const response = await fetch("/api/jobs/recent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawJobIdArray: recentJobIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recent jobs");
      }

      return response.json();
    },
    enabled: recentJobIds.length > 0,
    staleTime: 60000,
    gcTime: 300000,
    refetchOnWindowFocus: false,
  });

  const addToRecentJobs = (job: IJob) => {
    if (!recentJobIds.includes(job._id)) {
      const updatedIds = [...recentJobIds, job._id];
      setRecentJobIds(updatedIds);
      localStorage.setItem("myJobs", JSON.stringify(updatedIds));
      refetch();
    }
  };

  const clearRecentJobs = () => {
    localStorage.removeItem("myJobs");
    setRecentJobIds([]);
  };

  const fetchRecentJobs = () => {
    refetch();
  };

  const filteredRecentJobs = recentJobs
    ? Array.from(recentJobs as IJob[])?.filter(
        (job) =>
          (filters.employment.length === 0 || filters.employment.includes(job.employmentType)) &&
          (filters.compensation.length === 0 ||
            (job.compensationType
              ? filters.compensation.includes(job.compensationType)
              : filters.compensation.length === 0)) &&
          (filters.industry.length === 0 ||
            filters.industry.some((industry) => job.organizationIndustry.includes(industry))),
      )
    : [];

  return {
    recentJobs: filteredRecentJobs,
    isLoading,
    error,
    fetchRecentJobs,
    addToRecentJobs,
    clearRecentJobs,
  };
};

const fetchJobs = async ({ pageParam = 1, filters }: { pageParam?: number; filters: FilterState }) => {
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

  // Only fetch approved jobs
  url.searchParams.append("jobStatus", "approved");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
};

export default function Jobs() {
  const [tab, setTab] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasLoadedRecentJobs, setHasLoadedRecentJobs] = useState(false);

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

  //use custom hooks
  const { data: fetchedJobs, fetchNextPage, hasNextPage, isFetchingNextPage } = useJobsQuery(filters);

  const {
    recentJobs: filteredRecentJobs,
    isLoading: isLoadingRecentJobs,
    fetchRecentJobs,
    addToRecentJobs,
    clearRecentJobs,
  } = useRecentJobs(filters);

  const handleFilterChange = (category: string, value: string) => {
    if (category == "clear-all") {
      setFilters({
        employment: [],
        compensation: [],
        industry: [],
      });
      return;
    }

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

  const handleTabChange = async (tabNumber: number) => {
    setTab(tabNumber);
    if (tabNumber === 2 && !hasLoadedRecentJobs) {
      fetchRecentJobs();
      setHasLoadedRecentJobs(true);
    }
  };

  const handleClearRecentJobs = () => {
    clearRecentJobs();
    onClose();
  };

  const { ref, inView } = useInView();

  // Set up infinite scroll observer
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="w-full flex flex-col pb-10">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col lg:flex-row gap-16 lg:gap-8 grow">
        <div className="flex flex-col gap-4 lg:gap-6">
          <div className="text-black font-semibold text-xl sm:text-2xl md:text-3xl select-none lg:sticky lg:top-[110px]">
            Filters
          </div>
          <FilterCard categories={filterCategories} onFilterChange={handleFilterChange}></FilterCard>
        </div>
        <div className="flex flex-col w-full gap-4 lg:gap-6">
          <div className="flex items-center justify-between max-[500px]:flex-col max-[500px]:items-stretch">
            <div className="flex gap-8 max-[500px]:justify-center max-[500px]:gap-4">
              <div
                className={twMerge(
                  "text-black text-xl sm:text-2xl md:text-3xl font-semibold cursor-pointer select-none",
                  tab == 1 ? "opacity-100" : "opacity-50",
                )}
                onClick={() => handleTabChange(1)}
              >
                All Jobs
              </div>
              <div
                className={twMerge(
                  "text-black text-xl sm:text-2xl md:text-3xl font-semibold cursor-pointer select-none",
                  tab == 2 ? "opacity-100" : "opacity-50",
                )}
                onClick={() => handleTabChange(2)}
              >
                Recently Viewed
              </div>
            </div>
            {tab === 2 && (
              <div className="max-[500px]:mt-2 max-[500px]:flex max-[500px]:justify-center max-[500px]:w-full max-[500px]:px-4 max-[500px]:py-2">
                <Button
                  onClick={onOpen}
                  fontWeight="normal"
                  variant="outline"
                  borderColor="black"
                  size="sm"
                  className="w-full max-w-[200px]"
                >
                  Clear History
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {tab == 1 ? (
              <>
                {fetchedJobs ? (
                  <>
                    <JobGrid jobs={fetchedJobs.pages.flat()} innerRef={ref} onJobView={addToRecentJobs} />
                    {isFetchingNextPage && <Loader size="xl" label="Loading more jobs..." />}
                  </>
                ) : (
                  <JobGridSkeleton count={4} />
                )}
              </>
            ) : (
              <>
                {!isLoadingRecentJobs ? (
                  <JobGrid jobs={filteredRecentJobs} onJobView={addToRecentJobs} />
                ) : (
                  <JobGridSkeleton count={4} />
                )}
              </>
            )}
          </div>
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
