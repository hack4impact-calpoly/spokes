import { IJob } from "@/database/jobSchema";
import AdminCard from "./AdminCard";
import JobCard from "./JobCard";

interface JobGridProps {
  jobs: IJob[];
  isAdmin?: boolean;
}

const noJobsFound = () => {
  return (
    <div className="grow flex flex-col gap-6 justify-center justify-self-center items-center mt-10">
      <h1 className="text-3xl font-bold">No Jobs Found</h1>
      <p className="text-lg text-center">Try again with some different filters!</p>
    </div>
  );
};

export default function JobGrid({ jobs, isAdmin = false }: JobGridProps) {
  console.log(typeof jobs);
  const CardComponent = isAdmin ? AdminCard : JobCard;

  return (
    <>
      {jobs.length === 0 ? (
        noJobsFound()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from(jobs).map((job) => (
            <CardComponent key={job._id} job={job} />
          ))}
        </div>
      )}
    </>
  );
}
