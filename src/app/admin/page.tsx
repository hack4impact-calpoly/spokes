"use client";
import { useState, useEffect } from "react";
import ChakraCarousel from "@/components/ChakraCarousel/carousel";
import AdminJobCard from "@/components/JobCard/AdminCard";
import JobGrid from "@/components/JobGrid/JobGrid";
import { IJob } from "@/database/jobSchema";
import { twMerge } from "tailwind-merge";
import JobGridSkeleton from "@/components/JobGrid/JobGridSkeleton";
import Link from "next/link";

export default function AdminJobs() {
  const [incomingJobData, setIncomingJobData] = useState<null | IJob[]>(null);
  const [liveJobData, setLiveJobData] = useState<null | IJob[]>(null);
  const [completeJobData, setCompleteJobData] = useState<null | IJob[]>(null);
  const [expiredJobData, setExpiredJobData] = useState<null | IJob[]>(null);

  const setExpiredJobs = async (jobs: IJob[]) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const jobsToExpire = jobs.filter((job) => job.jobStatus !== "expired" && new Date(job.postDate) < thirtyDaysAgo);

    for (const job of jobsToExpire) {
      await updateJobStatus(job._id, "expired");
    }

    console.log(`${jobsToExpire.length} jobs set to expired.`);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/jobs");
      const result: IJob[] = await response.json();
      //const result: IJob[] = [];

      // Check and update expired jobs
      await setExpiredJobs(result);

      // Fetch all job statuses in parallel
      const jobStatuses = ["pending", "approved", "rejected", "expired"];
      const responses = await Promise.all(jobStatuses.map((status) => fetch(`/api/jobs?jobStatus=${status}`)));

      const [incomingData, liveData, completeData, expiredData] = await Promise.all(responses.map((res) => res.json()));

      setIncomingJobData(incomingData);
      setLiveJobData(liveData);
      setCompleteJobData(completeData);
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
      };

      // Send the complete updated job object
      const updateResponse = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedJob),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update job status");
      }

      // Remove the job from its current category
      if (incomingJobData) {
        setIncomingJobData(incomingJobData.filter((job) => job._id !== jobId));
      }
      if (liveJobData) {
        setLiveJobData(liveJobData.filter((job) => job._id !== jobId));
      }
      if (completeJobData) {
        setCompleteJobData(completeJobData.filter((job) => job._id !== jobId));
      }
      if (expiredJobData) {
        setExpiredJobData(expiredJobData.filter((job) => job._id !== jobId));
      }

      // Add the job to its new category
      switch (status) {
        case "approved":
          setLiveJobData((prev) => (prev ? [...prev, updatedJob] : [updatedJob]));
          setExpiredJobData((prev) => (prev ? prev.filter((job) => job._id !== jobId) : []));
          break;
        case "rejected":
          setCompleteJobData((prev) => (prev ? [...prev, updatedJob] : [updatedJob]));
          break;
        case "pending":
          setIncomingJobData((prev) => (prev ? [...prev, updatedJob] : [updatedJob]));
          break;
        case "expired":
          setExpiredJobData((prev) => (prev ? [...prev, updatedJob] : [updatedJob]));
          break;
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const [tab, setTab] = useState(1);

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
              <h1 className="text-3xl font-semibold">Pending Jobs</h1>
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
                Manage Users
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
                  // Later add functionally to display listings
                  setTab(1);
                }}
              >
                Live Jobs
              </div>
              <div
                className={twMerge(
                  "text-black text-2xl sm:text-3xl font-semibold text-center cursor-pointer select-none",
                  tab == 2 ? "opacity-100" : "opacity-50",
                )}
                onClick={() => {
                  // Later add functionally to display listings
                  setTab(2);
                }}
              >
                Expired Jobs
              </div>
              <div
                className={twMerge(
                  "text-black text-2xl sm:text-3xl font-semibold text-center cursor-pointer select-none",
                  tab == 3 ? "opacity-100" : "opacity-50",
                )}
                onClick={() => {
                  // Later add functionally to display listings
                  setTab(3);
                }}
              >
                Rejected Jobs
              </div>
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
            ) : completeJobData ? (
              <JobGrid
                jobs={completeJobData}
                isRejected={true}
                onUpdateJob={(jobId, status, approvedDate) => updateJobStatus(jobId, status, approvedDate)}
              />
            ) : (
              <JobGridSkeleton count={4} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
