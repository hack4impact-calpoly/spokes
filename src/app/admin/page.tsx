"use client";
import { useState, useEffect } from "react";
import ChakraCarousel from "@/components/ChakraCarousel/carousel";
import AdminJobCard from "@/components/JobCard/AdminCard";
import JobGrid from "@/components/JobGrid";
import { Loader } from "@/components/Loader";
import { IJob } from "@/database/jobSchema";
import { Flex } from "@chakra-ui/react";
import { twMerge } from "tailwind-merge";

// Helper function to filter the job data into the three categories
function filterJobs(jobs: IJob[], filterBy: "pending" | "approved" | "rejected" | "expired") {
  // Check for expired jobs first
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return jobs.filter((job) => {
    // If the job is pending and older than 30 days, mark it as expired
    const postDate = new Date(job.postDate);
    if (job.jobStatus === "pending" && postDate < thirtyDaysAgo) {
      return filterBy === "expired";
    }
    return job.jobStatus === filterBy;
  });
}

export default function AdminJobs() {
  const [incomingJobData, setIncomingJobData] = useState<null | IJob[]>(null);
  const [liveJobData, setLiveJobData] = useState<null | IJob[]>(null);
  const [completeJobData, setCompleteJobData] = useState<null | IJob[]>(null);
  const [expiredJobData, setExpiredJobData] = useState<null | IJob[]>(null);

  const updateExpiredJobs = async (jobs: IJob[]) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expiredJobs = jobs.filter((job) => job.jobStatus === "pending" && new Date(job.postDate) < thirtyDaysAgo);

    // Update each expired job's status
    for (const job of expiredJobs) {
      await updateJobStatus(job._id, "expired");
    }
  };

  const fetchData = async () => {
    const response = await fetch("/api/jobs");
    const result = await response.json();

    // Check and update expired jobs before filtering
    await updateExpiredJobs(result);

    const incoming = filterJobs(result, "pending");
    const live = filterJobs(result, "approved");
    const complete = filterJobs(result, "rejected");
    const expired = filterJobs(result, "expired");
    setIncomingJobData(incoming);
    setLiveJobData(live);
    setCompleteJobData(complete);
    setExpiredJobData(expired);
  };

  useEffect(() => {
    fetchData();

    // Set up an interval to check for expired jobs every hour
    const interval = setInterval(fetchData, 3600000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const updateJobStatus = async (jobId: string, status: "approved" | "rejected" | "expired", approvedDate?: Date) => {
    try {
      //fetches job data
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) {
        console.error("Failed to fetch job data");
        return;
      }
      if (response.ok) {
        console.log("Response OK");
      }

      const jobs = await response.json();
      console.log("Fetched Jobs:", jobs);

      const job = jobs.find((j: IJob) => j._id === jobId);
      if (!job) {
        console.error("Job not found");
        return;
      }
      console.log("Target Job:", job);

      const updatedJob = {
        //  ...job, // "spreads"/ copy existing information
        _id: job._id,
        organizationName: job.organizationName,
        organizationIndustry: job.organizationIndustry,
        title: job.title,
        postDate: job.postDate,
        jobDescription: job.jobDescription,
        employmentType: job.employmentType,
        compensationType: job.compensationType,
        jobStatus: status,
        url: job.url,
        approvedDate: approvedDate ? approvedDate.toISOString() : job.approvedDate,
      };

      const updateResponse = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedJob),
      });

      if (!updateResponse.ok) {
        console.error("Failed updateResponse");
        return;
      }

      console.log("updateResponse good");

      //Update frontend imediately so user doesnt have to refresh
      await fetchData();
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const [tab, setTab] = useState(1);

  return (
    <div className="w-full">
      <div className="mt-20 px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
        <div className="flex flex-col gap-24 mb-20">
          {/* Incoming Applications with Carousel using AdminJobCard */}
          <div className="flex flex-col gap-8">
            <div className="text-3xl font-semibold">Incoming Applications</div>
            {incomingJobData ? (
              <ChakraCarousel gap={20}>
                {incomingJobData.map((job) => (
                  <Flex
                    key={job._id}
                    justifyContent="space-between"
                    flexDirection="column"
                    overflow="hidden"
                    rounded={5}
                    flex={1}
                  >
                    <AdminJobCard job={job} />
                  </Flex>
                ))}
              </ChakraCarousel>
            ) : (
              <Loader
                size="md"
                label="Loading Jobs..."
                className="mt-8 grow flex flex-col gap-6 justify-center items-center"
              />
            )}
          </div>

          {/* Live/Completed Applications rendered as a grid */}
          <div className="flex flex-col gap-8">
            <div className="flex gap-8 w-full">
              <div
                className={twMerge(
                  "text-black text-3xl text-center cursor-pointer select-none",
                  tab == 1 ? "font-semibold" : "font-normal text-[#C3C3C3]",
                )}
                onClick={() => {
                  // Later add functionally to display listings
                  setTab(1);
                }}
              >
                Live Applications
              </div>
              <div
                className={twMerge(
                  "text-black text-3xl text-center cursor-pointer select-none",
                  tab == 2 ? "font-semibold" : "font-normal text-[#C3C3C3]",
                )}
                onClick={() => {
                  // Later add functionally to display listings
                  setTab(2);
                }}
              >
                Expired Applications
              </div>
            </div>
            {tab == 1 ? (
              liveJobData ? (
                <JobGrid jobs={liveJobData} isAdmin={true} />
              ) : (
                <Loader
                  size="md"
                  label="Loading Jobs..."
                  className="mt-8 grow flex flex-col gap-6 justify-center items-center"
                />
              )
            ) : expiredJobData ? (
              <JobGrid jobs={expiredJobData} isAdmin={true} />
            ) : (
              <Loader
                size="md"
                label="Loading Jobs..."
                className="mt-8 grow flex flex-col gap-6 justify-center items-center"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
