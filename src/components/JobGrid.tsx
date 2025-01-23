import { IJob } from "@/database/jobSchema";
import AdminCard from "./AdminCard";
import JobCard from "./JobCard";

interface JobGridProps {
  jobs: IJob[];
  isAdmin?: boolean;
}

export default function JobGrid({ jobs, isAdmin = false }: JobGridProps) {
  console.log(typeof jobs);
  const CardComponent = isAdmin ? AdminCard : JobCard;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from(jobs).map((job) => (
        <CardComponent key={job._id} job={job} />
      ))}
    </div>
  );
}
