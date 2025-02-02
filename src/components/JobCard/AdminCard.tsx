import { Button } from "@chakra-ui/react";
import { IJob } from "@/database/jobSchema";
import JobStatusBadge from "@/components/JobCard/JobStatusBadge";
import JobBadge from "@/components/JobCard/JobBadge";
import JobCardInformation from "@/components/JobCard/JobCardInformation";
import JobPostedDate from "@/components/JobCard/JobPostedDate";

interface JobCardProps {
  job: IJob;
  onUpdateJob?: (jobId: string, status: "approved" | "rejected", approvedDate?: Date) => void;
}

export default function AdminCard({ job, onUpdateJob }: JobCardProps) {
  const isExpired =
    job.approvedDate && new Date(job.approvedDate) < new Date(new Date().setDate(new Date().getDate() - 30));

  const handleAction = (action: "approved" | "rejected", approvedDate?: Date) => {
    console.log(`Button clicked: ${action}, Job ID: ${job._id}`);
    onUpdateJob?.(job._id, action, approvedDate);
  };

  return (
    <div className="max-w-[100%]">
      <div className="bg-[#f7f7f7] rounded-3xl px-8 py-5 shadow-sm">
        <div className="flex justify-between mb-5">
          <JobStatusBadge jobStatus={job.jobStatus} />
        </div>
        <JobCardInformation job={job} />
        <div className="flex flex-wrap justify-between min-[1000px]:flex-row flex-col min-[1000px]:gap-4 gap-2 mt-5">
          <div className="flex flex-wrap gap-2">
            <JobBadge badgeType={job.employmentType} />
            <JobBadge badgeType={job.compensationType} />
          </div>
          <div>
            <Button
              px="2"
              py="1"
              h="min-content"
              fontSize="small"
              fontWeight="normal"
              variant="outline"
              borderColor="black"
            >
              Edit Application
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {job.jobStatus === "pending" && !isExpired && (
            <>
              <Button
                px="20"
                fontSize="small"
                fontWeight="normal"
                variant="outline"
                borderColor="black"
                onClick={() => handleAction("approved", new Date())}
              >
                Approve
              </Button>
              <Button
                px="20"
                fontSize="small"
                fontWeight="normal"
                variant="outline"
                borderColor="black"
                onClick={() => handleAction("rejected")}
              >
                Deny
              </Button>
            </>
          )}

          {isExpired && (
            <Button
              px="20"
              fontSize="small"
              fontWeight="normal"
              variant="outline"
              borderColor="black"
              onClick={() => onUpdateJob?.(job._id, "approved", new Date())}
            >
              Renew
            </Button>
          )}
        </div>

        <div className="mt-5">
          <JobPostedDate date={job.postDate} />
        </div>
      </div>
    </div>
  );
}
