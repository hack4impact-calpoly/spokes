import { Button, Icon } from "@chakra-ui/react";
import { IJob } from "@/database/jobSchema";
import AdminJobBadge from "@/components/AdminJobBadge";
import JobBadge from "@/components/JobBadge";
import JobCardInformation from "@/components/JobCardInformation";

interface JobCardProps {
  job: IJob;
}

export default function AdminCard({ job }: JobCardProps) {
  return (
    <div className="max-w-[100%]">
      <div className="bg-[#f7f7f7] rounded-lg px-8 pt-2 pb-8 mb-4">
        <div className="my-5">
          <div className="flex flex-row-reverse mb-5">
            <Icon viewBox="0 0 200 200" color="#A1E3CB">
              {/* This little dot will also need to be made dynamic with member/non-badge member when that is made */}
              <path fill="currentColor" d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0" />
            </Icon>
          </div>
          <div className="flex justify-between">
            <AdminJobBadge jobStatus={job.jobStatus} />
            {/* Currently dont have member/non-member data. Can add it here once done. Leaving it as jobStatus for now */}
            <AdminJobBadge jobStatus={job.jobStatus} />
          </div>
        </div>
        <JobCardInformation job={job} />
        <div className="flex flex-wrap justify-between min-[1000px]:flex-row flex-col min-[1000px]:gap-4 gap-2">
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
      </div>
    </div>
  );
}
