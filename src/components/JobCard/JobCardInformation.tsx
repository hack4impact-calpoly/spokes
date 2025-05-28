import { IJob } from "@/database/jobSchema";
import { Tooltip } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

interface JobInformationProps {
  job: IJob;
}

export default function JobCardInformation({ job }: JobInformationProps) {
  return (
    <>
      <div className="mb-2">
        <div className="flex items-center justify-between gap-1.5">
          <h1 className="text-2xl font-bold truncate">{job.title}</h1>
          {job.memberJob && (
            <div className="flex items-center gap-1.5 text-[#045F87] text-sm font-medium">
              <Tooltip label="This is a verified Spokes member" placement="top" hasArrow>
                <CheckCircleIcon className="w-4 h-4" />
              </Tooltip>
            </div>
          )}
        </div>
        <p className="text-gray-700 font-semibold truncate">{job.organizationName}</p>
      </div>
      <div className="mb-2">
        <p className="text-gray-700 italic">{job.organizationIndustry.join(", ")}</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-700 overflow:s h-max-[150px] h-[90px] overflow-scroll no-scrollbar">
          {job.jobDescription}
        </p>
      </div>
    </>
  );
}
