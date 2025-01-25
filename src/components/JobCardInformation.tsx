import { IJob } from "@/database/jobSchema";

interface JobInformationProps {
  job: IJob;
}

export default function JobCardInformation({ job }: JobInformationProps) {
  return (
    <>
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
        <p className="text-gray-700 overflow:s h-max-[150px] h-[80px] overflow-scroll no-scrollbar">
          {job.jobDescription}
        </p>
      </div>
    </>
  );
}
