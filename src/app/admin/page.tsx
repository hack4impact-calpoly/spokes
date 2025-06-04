"use client";
import { useState, useEffect } from "react";
import ChakraCarousel from "@/components/ChakraCarousel/carousel";
import AdminJobCard from "@/components/JobCard/AdminCard";
import JobGrid from "@/components/JobGrid/JobGrid";
import { IJob } from "@/database/jobSchema";
import { twMerge } from "tailwind-merge";
import JobGridSkeleton from "@/components/JobGrid/JobGridSkeleton";
import Link from "next/link";
import { isExpired } from "@/lib/utils";
import { Tooltip, useToast } from "@chakra-ui/react";

export default function AdminJobs() {
  const toast = useToast();
  const [incomingJobData, setIncomingJobData] = useState<null | IJob[]>(null);
  const [liveJobData, setLiveJobData] = useState<null | IJob[]>(null);
  const [rejectedJobData, setRejectedJobData] = useState<null | IJob[]>(null);
  const [expiredJobData, setExpiredJobData] = useState<null | IJob[]>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const setExpiredJobs = async (jobs: IJob[]) => {
    if (!Array.isArray(jobs)) {
      console.error("Expected jobs to be an array but received:", typeof jobs);
      return;
    }
    console.log("Setting Expired");
    const jobsToExpire = jobs.filter(
      (job) => job.jobStatus !== "expired" && isExpired(job.jobStatus, job.approvedDate),
    );

    for (const job of jobsToExpire) {
      await updateJobStatus(job._id, "expired");
    }

    console.log(`${jobsToExpire.length} jobs set to expired.`);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/jobs?jobStatus=approved&admin=true");
      if (!response.ok) {
        console.error("Failed to fetch jobs:", response.status, response.statusText);
        return;
      }
      const result: IJob[] = await response.json();

      // Check and update expired jobs
      await setExpiredJobs(result);

      // Fetch all job statuses in parallel
      const jobStatuses = ["pending", "approved", "rejected", "expired"];
      const responses = await Promise.all(
        jobStatuses.map((status) => fetch(`/api/jobs?jobStatus=${status}&admin=true`)),
      );

      // Check if any of the parallel requests failed
      const failedResponses = responses.filter((res) => !res.ok);
      if (failedResponses.length > 0) {
        console.error("Some job status requests failed:", failedResponses);
        return;
      }

      const [incomingData, liveData, rejectedData, expiredData] = await Promise.all(responses.map((res) => res.json()));

      setIncomingJobData(incomingData);
      setLiveJobData(liveData);
      setRejectedJobData(rejectedData);
      setExpiredJobData(expiredData);
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up an interval to check for expired jobs every hour
    const interval = setInterval(fetchData, 3600000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const updateJobStatus = async (
    jobId: string,
    status: "approved" | "pending" | "rejected" | "expired",
    approvedDate?: Date,
    rejectionMessage?: string,
  ) => {
    try {
      // First fetch the current job data
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch job data");
      }

      const currentJob: IJob = await response.json();

      if (!currentJob) {
        throw new Error("Job not found");
      }

      // Create the updated job object with all required fields
      const updatedJob: IJob = {
        _id: currentJob._id,
        userId: currentJob.userId,
        organizationName: currentJob.organizationName,
        organizationIndustry: currentJob.organizationIndustry,
        title: currentJob.title,
        postDate: currentJob.postDate,
        modifiedDate: currentJob.modifiedDate,
        jobDescription: currentJob.jobDescription,
        employmentType: currentJob.employmentType,
        compensationType: currentJob.compensationType,
        jobStatus: status,
        detailURL: currentJob.detailURL,
        approvedDate: approvedDate ? approvedDate : currentJob.approvedDate,
        rejectionMessage: rejectionMessage,
        memberJob: currentJob.memberJob,
      };

      // Send the complete updated job object
      const updateResponse = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedJob,
          previousStatus: currentJob.jobStatus,
          newStatus: status,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update job status");
      }

      // Remove the job from its current category
      if (incomingJobData) {
        setIncomingJobData((prev) => prev?.filter((job) => job._id !== jobId) ?? []);
      }
      if (liveJobData) {
        setLiveJobData((prev) => prev?.filter((job) => job._id !== jobId) ?? []);
      }
      if (rejectedJobData) {
        setRejectedJobData((prev) => prev?.filter((job) => job._id !== jobId) ?? []);
      }
      if (expiredJobData) {
        setExpiredJobData((prev) => prev?.filter((job) => job._id !== jobId) ?? []);
      }

      if (status === "approved") {
        toast({
          title: "Job Approved",
          description: `Successfully approved "${currentJob.title}"`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setLiveJobData((prev) => [...(prev ?? []), updatedJob]);
      } else if (status === "rejected") {
        toast({
          title: "Job Rejected",
          description: `Successfully rejected "${currentJob.title}"`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setRejectedJobData((prev) => [...(prev ?? []), updatedJob]);
      } else if (status === "expired") {
        toast({
          title: "Job Expired",
          description: `"${currentJob.title}" has been marked as expired`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setExpiredJobData((prev) => [...(prev ?? []), updatedJob]);
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      toast({
        title: "Error",
        description: "Failed to update job status. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const [tab, setTab] = useState(1);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000); // 1 second cooldown
  };

  return (
    <div className="w-full">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col gap-8 text-black">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-[#045F87] rounded-full"></div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex flex-col gap-24 mb-20">
          <div className="flex flex-col gap-8">
            <div className="flex justify-between">
              <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">Pending Jobs</h1>
              <Link
                href="/admin/users"
                className="px-4 py-2 bg-[#045F87] text-white rounded-md hover:bg-[#034A6B] transition-colors flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="max-[500px]:hidden">Manage Users</span>
              </Link>
            </div>
            {!incomingJobData ? (
              <JobGridSkeleton count={2} />
            ) : incomingJobData.length === 0 ? (
              <JobGrid
                jobs={incomingJobData}
                isPending={true}
                onUpdateJob={(jobId, status, approvedDate) => updateJobStatus(jobId, status, approvedDate)}
              />
            ) : (
              <ChakraCarousel gap={20}>
                {incomingJobData && incomingJobData.length > 0 ? (
                  incomingJobData.map((job) => <AdminJobCard key={job._id} job={job} onUpdateJob={updateJobStatus} />)
                ) : (
                  <div>No jobs available</div>
                )}
              </ChakraCarousel>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex gap-8 w-full">
              <div
                className={twMerge(
                  "text-black text-2xl sm:text-3xl font-semibold text-center cursor-pointer select-none",
                  tab == 1 ? "opacity-100" : "opacity-50",
                )}
                onClick={() => {
                  setTab(1);
                }}
              >
                <span className="hidden sm:inline">Live Jobs</span>
                <span className="sm:hidden">Live</span>
              </div>
              <div
                className={twMerge(
                  "text-black text-2xl sm:text-3xl font-semibold text-center cursor-pointer select-none",
                  tab == 2 ? "opacity-100" : "opacity-50",
                )}
                onClick={() => {
                  setTab(2);
                }}
              >
                <span className="hidden sm:inline">Expired Jobs</span>
                <span className="sm:hidden">Expired</span>
              </div>
              <div
                className={twMerge(
                  "text-black text-2xl sm:text-3xl font-semibold text-center cursor-pointer select-none",
                  tab == 3 ? "opacity-100" : "opacity-50",
                )}
                onClick={() => {
                  setTab(3);
                }}
              >
                <span className="hidden sm:inline">Rejected Jobs</span>
                <span className="sm:hidden">Rejected</span>
              </div>
              <Tooltip
                label={"Refresh job data"}
                hasArrow
                placement="top"
                bg="#2B2B2B"
                color="white"
                fontSize="sm"
                borderRadius="md"
                padding="2"
                boxShadow="md"
                offset={[0, 5]}
                maxW="220px"
                openDelay={600}
              >
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={twMerge(
                    "p-2 hover:bg-gray-100 rounded-full transition-colors ml-auto group",
                    isRefreshing && "cursor-not-allowed opacity-70",
                  )}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={twMerge(
                      "text-gray-600 transition-transform duration-300 ease-in-out",
                      isRefreshing && "animate-spin-once",
                    )}
                  >
                    <path
                      d="M23 4V10H17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1 20V14H7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.51 9.00001C3.84797 7.58631 4.53047 6.28871 5.49997 5.20001C6.46947 4.11131 7.70047 3.26141 9.07097 2.71901C10.4415 2.17661 11.9075 1.95681 13.3745 2.07801C14.8415 2.19921 16.2645 2.65821 17.515 3.42001L23 8.00001M1 16L6.485 20.58C7.73547 21.3418 9.15847 21.8008 10.6255 21.922C12.0925 22.0432 13.5585 21.8234 14.929 21.281C16.2995 20.7386 17.5305 19.8887 18.5 18.8C19.4695 17.7113 20.152 16.4137 20.49 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Tooltip>
            </div>
            {tab == 1 ? (
              liveJobData ? (
                <JobGrid
                  jobs={liveJobData}
                  isLive={true}
                  onUpdateJob={(jobId, status, approvedDate) => updateJobStatus(jobId, status, approvedDate)}
                />
              ) : (
                <JobGridSkeleton count={4} />
              )
            ) : tab == 2 ? (
              expiredJobData ? (
                <JobGrid
                  jobs={expiredJobData}
                  isExpired={true}
                  onUpdateJob={(jobId, status, approvedDate) => updateJobStatus(jobId, status, approvedDate)}
                />
              ) : (
                <JobGridSkeleton count={4} />
              )
            ) : tab == 3 ? (
              rejectedJobData ? (
                <JobGrid
                  jobs={rejectedJobData}
                  isRejected={true}
                  onUpdateJob={(jobId, status, approvedDate) => updateJobStatus(jobId, status, approvedDate)}
                />
              ) : (
                <JobGridSkeleton count={4} />
              )
            ) : (
              <JobGridSkeleton count={4} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
