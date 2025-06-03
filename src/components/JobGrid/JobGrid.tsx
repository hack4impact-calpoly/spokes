import { IJob } from "@/database/jobSchema";
import AdminCard from "@/components/JobCard/AdminCard";
import JobCard from "@/components/JobCard/JobCard";

interface JobGridProps {
  jobs: IJob[];
  isPending?: boolean;
  isJobBoard?: boolean;
  isLive?: boolean;
  isExpired?: boolean;
  isRejected?: boolean;
  innerRef?: (node?: Element | null | undefined) => void;
  onJobView?: (job: IJob) => void;
  onUpdateJob?: (jobId: string, status: "approved" | "rejected", approvedDate?: Date) => void;
}

export default function JobGrid({
  jobs,
  isPending = false,
  isJobBoard = false,
  isLive = false,
  isExpired = false,
  isRejected = false,
  onJobView,
  onUpdateJob,
  innerRef,
}: JobGridProps) {
  const CardComponent = isPending || isLive || isExpired || isRejected ? AdminCard : JobCard;

  return (
    <>
      {jobs.length === 0 ? (
        <NoJobsFound
          isPending={isPending}
          isJobBoard={isJobBoard}
          isLive={isLive}
          isExpired={isExpired}
          isRejected={isRejected}
        />
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
  isPending: boolean;
  isJobBoard: boolean;
  isLive: boolean;
  isExpired: boolean;
  isRejected?: boolean;
}

function NoJobsFound({ isPending, isJobBoard, isLive, isExpired, isRejected }: NoJobsFoundProps) {
  const getEmptyStateContent = () => {
    if (isPending) {
      return {
        title: "No Pending Jobs",
        message: "There are no jobs requiring review at this time. Check back later for new submissions.",
      };
    }
    if (isLive) {
      return {
        title: "No Live Jobs",
        message: "There are no active job listings at the moment. Approved jobs will appear here.",
      };
    }
    if (isExpired) {
      return {
        title: "No Expired Jobs",
        message: "There are no expired job listings. Jobs will automatically move here after 30 days.",
      };
    }
    if (isRejected) {
      return {
        title: "No Rejected Jobs",
        message: "There are no rejected job listings at the moment.",
      };
    }
    // Default job board empty state
    return {
      title: "No Jobs Found",
      message:
        "We couldn't find any jobs matching your criteria. Try adjusting your filters or check back later for new opportunities.",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-400"
        >
          <path
            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    };
  };

  const { title, message, icon } = getEmptyStateContent();

  return (
    <div className="grow flex flex-col gap-4 justify-center justify-self-center items-center min-h-[400px] p-8 rounded-lg">
      {icon}
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="text-base text-center text-gray-600 max-w-md">{message}</p>
    </div>
  );
}
