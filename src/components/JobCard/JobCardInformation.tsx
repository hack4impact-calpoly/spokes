import { IJob } from "@/database/jobSchema";

interface JobInformationProps {
  job: IJob;
}

export default function JobCardInformation({ job }: JobInformationProps) {
  return (
    <>
      <div className="mb-2">
        <h1 className="text-2xl font-bold truncate">{job.title}</h1>
        <p className="text-gray-700 font-semibold">{job.organizationName}</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-700 italic">{job.organizationIndustry}</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-700 overflow:s h-max-[150px] h-[90px] overflow-scroll no-scrollbar">
          {job.jobDescription}
        </p>
      </div>
    </>
  );
}
