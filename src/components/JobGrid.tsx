import { IJob } from "@/database/jobSchema";
import AdminCard from "./AdminCard";
import JobCard from "./JobCard";

interface JobGridProps {
  jobs: IJob[];
  isAdmin?: boolean;
}

export default function JobGrid({ jobs, isAdmin = false }: JobGridProps) {
  const CardComponent = isAdmin ? AdminCard : JobCard;
  console.log(jobs);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {jobs.length == 0 ? (
        <div>No Jobs</div>
      ) : (
        jobs.map((job) => {
          if (job) {
            return <CardComponent key={job._id} job={job} />;
          }
        })
      )}
    </div>
  );
}
