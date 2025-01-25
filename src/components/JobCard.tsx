import { Button } from "@chakra-ui/react";
import { IJob } from "@/database/jobSchema";
import JobBadge from "@/components/JobBadge";

interface JobCardProps {
  job: IJob;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="max-w-[100%]">
      <div className="bg-[#f7f7f7] rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-2">
          <div className="flex lg:flex-row flex-col lg:gap-10 gap-2 mb-2">
            <h1 className="text-2xl font-bold h-[32px]">{job.title}</h1>
            <p className="ml-auto">{new Date(job.postDate).toLocaleDateString()}</p>
          </div>
          <p className="text-gray-700 font-semibold">{job.organizationName}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 italic">{job.organizationIndustry}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 overflow:s h-max-[150px] h-[80px] overflow-scroll">{job.jobDescription}</p>
        </div>
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
