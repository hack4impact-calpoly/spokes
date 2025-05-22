import { twMerge } from "tailwind-merge";
import { ComponentProps, forwardRef } from "react";
import { IJob } from "@/database/jobSchema";
import JobStatusBadge from "./JobStatusBadge";
import JobBadge from "./JobBadge";
import { IconButton } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";
import JobDateInfo, { JobDateKind } from "./JobDateInfo";

export interface OrgCardProps extends ComponentProps<"div"> {
  className?: string;
  job: IJob;
  types: JobDateKind[];
}

function getJobDate(job: IJob, type: JobDateKind) {
  switch (type) {
    case "submitted":
      return new Date(job.postDate);

    case "posted":
      return job.approvedDate ? new Date(job.approvedDate) : undefined;

    case "updated":
      return job.modifiedDate ? new Date(job.modifiedDate) : undefined;

    case "expires":
    case "expired":
      let date = job.approvedDate ? new Date(job.approvedDate) : undefined;
      if (date) {
        date.setDate(date.getDate() + 31);
      }
      return date;

    default:
      return undefined;
  }
}

export const OrgCard = forwardRef<HTMLDivElement, OrgCardProps>(
  ({ children, className, job, types, ...props }, ref) => {
    const router = useRouter();

    function handleEditApplicationButton(e: React.ChangeEvent<any>) {
      e.preventDefault();
      router.push(`/jobform?jobId=${job._id}&returnURL=/dashboard`);
    }

    return (
      <div
        ref={ref}
        className={twMerge("w-full flex flex-col gap-3 py-4 px-5 rounded-md bg-[#f7f7f7]", className)}
        {...props}
      >
        <div className="w-full h-fit flex flex-row items-center">
          <div className="text-lg font-semibold">{job.title}</div>
          <JobStatusBadge jobStatus={job.jobStatus} className="ml-auto"></JobStatusBadge>
        </div>

        <div className="w-full h-fit flex flex-col sm:flex-row sm:gap-4">
          {types.map((type, index) => (
            <JobDateInfo key={index} date={getJobDate(job, type)} type={type}></JobDateInfo>
          ))}
        </div>

        <div className="w-full h-fit flex flex-row items-center gap-2">
          <JobBadge badgeType={job.employmentType}></JobBadge>
          {job.compensationType && <JobBadge badgeType={job.compensationType}></JobBadge>}
          <IconButton
            aria-label="Edit Application"
            icon={<FiEdit />}
            size="sm"
            borderColor="black"
            className="ml-auto"
            onClick={handleEditApplicationButton}
          />
        </div>
      </div>
    );
  },
);

OrgCard.displayName = "OrgCard";
