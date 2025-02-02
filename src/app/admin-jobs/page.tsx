"use client";
import { useState, useEffect } from "react";
import JobGrid from "@/components/JobGrid";
import { IJob } from "@/database/jobSchema";
import { Loader } from "@/components/Loader";

// Helper function to filter the job data into the three categories
function filterJobs(jobs: IJob[], filterBy: "pending" | "approved" | "rejected") {
  return jobs.filter((job) => job.jobStatus === filterBy);
}

export default function AdminJobs() {
  const [incomingJobData, setIncomingJobData] = useState<null | IJob[]>(null);
  const [liveJobData, setLiveJobData] = useState<null | IJob[]>(null);
  const [completeJobData, setCompleteJobData] = useState<null | IJob[]>(null);

  useEffect(() => {
    // Note: job schema liekly will change and this will need to be adjusted
    const fetchData = async () => {
      const response = await fetch("/api/jobs");
      const result = await response.json();
      const incoming = filterJobs(result, "pending");
      const live = filterJobs(result, "approved");
      const complete = filterJobs(result, "rejected");
      setIncomingJobData(incoming);
      setLiveJobData(live);
      setCompleteJobData(complete);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="mt-20 px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
        <div className="flex flex-col gap-16 mb-20">
          <JobSection jobs={incomingJobData} title="Incoming Applications"></JobSection>
          <JobSection jobs={liveJobData} title="Live Applications"></JobSection>
          <JobSection jobs={completeJobData} title="Complete Applications"></JobSection>
        </div>
      </div>
    </div>
  );
}

interface JobSectionProps {
  title: string;
  jobs?: any;
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
