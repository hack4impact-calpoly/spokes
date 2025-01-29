"use client";
import { useState, useEffect } from "react";
import JobGrid from "@/components/JobGrid";
import { IJob, JobStatus } from "@/database/jobSchema";
import { Loader } from "@/components/Loader";

// Helper function to filter the job data into the three categories
function filterJobs(jobs: IJob[], filterBy: "pending" | "approved" | "rejected" | "expired") {
  //If the job's approvedDate is older than 30 days, filter it as expired
  if (filterBy == "expired") {
    const now = new Date();
    return jobs.filter(
      (job) => job.approvedDate && new Date(job.approvedDate) < new Date(now.setDate(now.getDate() - 30)),
    );
  }
  return jobs.filter((job) => job.jobStatus === filterBy);
}

export default function AdminJobs() {
  const [incomingJobData, setIncomingJobData] = useState<null | IJob[]>(null);
  const [liveJobData, setLiveJobData] = useState<null | IJob[]>(null);
  const [completeJobData, setCompleteJobData] = useState<null | IJob[]>(null);
  const [expiredJobData, setExpiredJobData] = useState<null | IJob[]>(null);

  useEffect(() => {
    // Note: job schema liekly will change and this will need to be adjusted
    const fetchData = async () => {
      const response = await fetch("/api/jobs");
      const result = await response.json();
      const incoming = filterJobs(result, "pending");
      const live = filterJobs(result, "approved");
      const complete = filterJobs(result, "rejected");
      const expired = filterJobs(result, "expired");
      setIncomingJobData(incoming);
      setLiveJobData(live);
      setCompleteJobData(complete);
      setExpiredJobData(expired);
    };

    fetchData();
  }, []);

  const updateJobStatus = async (jobId: string, status: "approved" | "rejected", approvedDate?: Date) => {
    try {
      //fetches job data
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) {
        console.error("Failed to fetch job data");
        return;
      }

      const job = await response.json();

      const updatedJob = {
        ...job, // "spreads"/ copy existing information
        jobStatus: status,
        approvedDate: approvedDate ? approvedDate.toISOString() : job.approvedDate,
      };

      //Use PUT to update the Job
      const updateResponse = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }, // specifies JSON format (some errors occur otherwise)
        body: JSON.stringify(updatedJob), // convert updated job data to JSON for same reason above
      });

      if (!updateResponse.ok) {
        console.error("Failed to update job");
        return;
      }

      //Update frontend imediately so user doesnt have to refresh
      // If the job._id matches jobId used to update the job -> Replace it with updatedJob
      setIncomingJobData((prev) => prev?.filter((job) => job._id !== jobId) || null);
      setLiveJobData((prev) => (status === "approved" ? [...(prev || []), updatedJob] : prev));
      setCompleteJobData((prev) => (status === "rejected" ? [...(prev || []), updatedJob] : prev));
      setExpiredJobData((prev) => prev?.filter((job) => job._id !== jobId) || null);
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="mt-20 px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
        <div className="flex flex-col gap-16 mb-20">
          <JobSection
            jobs={incomingJobData}
            title="Incoming Applications"
            onUpdateJob={updateJobStatus}
            showApproveDeny
          ></JobSection>
          <JobSection jobs={liveJobData} title="Live Applications"></JobSection>
          <JobSection jobs={completeJobData} title="Complete Applications"></JobSection>
          <JobSection jobs={expiredJobData} title="Expired Applications" onUpdateJob={updateJobStatus} showRenew />
        </div>
      </div>
    </div>
  );
}

interface JobSectionProps {
  title: string;
  jobs?: IJob[] | null;
  onUpdateJob?: (jobId: string, status: "approved" | "rejected", approvedDate?: Date) => void;
  showApproveDeny?: boolean;
  showRenew?: boolean;
}

const JobSection = ({ title, jobs }: JobSectionProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-2xl font-semibold">{title}</div>
      {jobs ? (
        <JobGrid jobs={jobs} isAdmin={true} />
      ) : (
        <Loader
          size="md"
          label="Loading Jobs..."
          className="mt-8 grow flex flex-col gap-6 justify-center items-center"
        ></Loader>
      )}
    </div>
  );
};
