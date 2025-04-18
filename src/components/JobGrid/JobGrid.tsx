import { IJob } from "@/database/jobSchema";
import AdminCard from "../JobCard/AdminCard";
import JobCard from "../JobCard/JobCard";
import JobGridSkeleton from "./JobGridSkeleton";

interface JobGridProps {
  jobs: IJob[];
  isAdmin?: boolean;
  innerRef?: (node?: Element | null | undefined) => void;
  onJobView?: (job: IJob) => void;
  onUpdateJob?: (jobId: string, status: "approved" | "rejected", approvedDate?: Date) => void;
}

export default function JobGrid({ jobs, isAdmin = false, onJobView, onUpdateJob, innerRef }: JobGridProps) {
  const CardComponent = isAdmin ? AdminCard : JobCard;

  return (
    <>
      {jobs.length === 0 ? (
        <NoJobsFound isAdmin={isAdmin} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {Array.from(jobs).map((job, index) => (
            <CardComponent
              key={job._id}
              job={job}
              onUpdateJob={onUpdateJob}
              onJobView={onJobView}
              innerRef={index === jobs.length - 1 ? innerRef : undefined}
            />
          ))}
        </div>
      )}
    </>
  );
}

interface NoJobsFoundProps {
  isAdmin: boolean;
}

function NoJobsFound({ isAdmin }: NoJobsFoundProps) {
  if (isAdmin) {
    return (
      <div className="grow flex flex-col gap-1 justify-center justify-self-center items-center min-h-[400px]">
        <h1 className="text-2xl font-bold">No Jobs Found</h1>
      </div>
    );
  }

  return (
    <div className="grow flex flex-col gap-1 justify-center justify-self-center items-center min-h-[400px]">
      <h1 className="text-3xl font-bold">No Jobs Found</h1>
      <p className="text-lg text-center">Try again with some different filters!</p>
    </div>
  );
}
