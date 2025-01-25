import { Button } from "@chakra-ui/react";
import { IJob } from "@/database/jobSchema";
import JobBadge from "@/components/JobCard/JobBadge";
import JobCardInformation from "@/components/JobCard/JobCardInformation";

interface JobCardProps {
  job: IJob;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="max-w-[100%]">
      <div className="bg-[#f7f7f7] rounded px-8 pt-6 pb-8 mb-4">
        <JobCardInformation job={job} />
        <div className="flex lg:flex-row flex-col gap-2">
          <JobBadge badgeType={job.employmentType} />
          <JobBadge badgeType={job.compensationType} />
        </div>
        <div className="flex lg:flex-row flex-col gap-4 my-5">
          <Button className="lg:w-[50%] w-full" fontWeight="normal" variant="outline" borderColor="black">
            See More
          </Button>
          <Button
            className="lg:w-[50%] w-full"
            fontWeight="normal"
            variant="outline"
            bg="black"
            textColor="white"
            _hover={{
              bg: "gray.800",
            }}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
