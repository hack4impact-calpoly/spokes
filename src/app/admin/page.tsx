"use client";
import { useState, useEffect } from "react";
import ChakraCarousel from "@/components/ChakraCarousel/carousel";
import AdminJobCard from "@/components/JobCard/AdminCard";
import JobGrid from "@/components//JobGrid/JobGrid";
import { Loader } from "@/components/Loader";
import { IJob } from "@/database/jobSchema";
import { Flex } from "@chakra-ui/react";
import { twMerge } from "tailwind-merge";
import JobGridSkeleton from "@/components/JobGrid/JobGridSkeleton";

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
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
        <div className="flex flex-col gap-24 mb-20">
          <div className="flex flex-col gap-8">
            <div className="text-3xl font-semibold">Pending Jobs</div>
            {!incomingJobData ? (
              <JobGridSkeleton count={2} />
            ) : incomingJobData.length === 0 ? (
              <JobGrid
                jobs={incomingJobData}
                isAdmin={true}
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
            </div>
            {tab == 1 ? (
              liveJobData ? (
                <JobGrid
                  jobs={liveJobData}
                  isAdmin={true}
                  onUpdateJob={(jobId, status, approvedDate) => updateJobStatus(jobId, status, approvedDate)}
                />
              ) : (
                <JobGridSkeleton count={4} />
              )
            ) : expiredJobData ? (
              <JobGrid
                jobs={expiredJobData}
                isAdmin={true}
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
