import { Button, Icon } from "@chakra-ui/react";
import { IJob } from "@/database/jobSchema";
import AdminJobBadge from "@/components/JobCard/AdminJobBadge";
import JobBadge from "@/components/JobCard/JobBadge";
import JobCardInformation from "@/components/JobCard/JobCardInformation";
import JobPostedDate from "@/components/JobCard/JobPostedDate";

interface JobCardProps {
  job: IJob;
}

export default function AdminCard({ job }: JobCardProps) {
  return (
    <div className="max-w-[100%]">
      <div className="bg-[#f7f7f7] rounded-3xl px-8 py-5 shadow-sm">
        <div className="flex justify-between mb-5">
          <AdminJobBadge jobStatus={job.jobStatus} />
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
        <div className="mt-5">
          <JobPostedDate date={job.postDate} />
        </div>
      </div>
    </div>
  );
}
