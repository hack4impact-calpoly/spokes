import { IJob } from "@/database/jobSchema";
import AdminCard from "./JobCard/AdminCard";
import JobCard from "./JobCard/JobCard";

interface JobGridProps {
  jobs: IJob[];
  isAdmin?: boolean;
}

export default function JobGrid({ jobs, isAdmin = false }: JobGridProps) {
  const CardComponent = isAdmin ? AdminCard : JobCard;
  console.log(jobs);

  return (
    <>
      {jobs.length === 0 ? (
        <NoJobsFound />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {Array.from(jobs).map((job) => (
            <CardComponent key={job._id} job={job} />
          ))}
        </div>
      )}
    </>
  );
}

function NoJobsFound() {
  return (
    <div className="grow flex flex-col gap-1 justify-center justify-self-center items-center mt-10">
      <h1 className="text-3xl font-bold">No Jobs Found</h1>
      <p className="text-lg text-center">Try again with some different filters!</p>
    </div>
  );
}
