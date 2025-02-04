import { Button } from "@chakra-ui/react";
import { IJob } from "@/database/jobSchema";
import JobBadge from "@/components/JobCard/JobBadge";
import JobCardInformation from "@/components/JobCard/JobCardInformation";
import JobPostedDate from "@/components/JobCard/JobPostedDate";
import { useState, useEffect } from "react";
import { get } from "http";

interface JobCardProps {
  job: IJob;
}

export default function JobCard({ job }: JobCardProps) {
  const [recentJobs, setRecentJobs] = useState<string[]>(() => {
    const storedJobs = localStorage.getItem("myJobs");
    return storedJobs ? JSON.parse(storedJobs) : [];
  });

  useEffect(() => {
    localStorage.setItem("myJobs", JSON.stringify(recentJobs));
  }, [recentJobs]);

  const handleButtonClick = () => {
    const newJob = job._id;
    const arr = getRecentJobs();

    if (!recentJobs.includes(newJob)) {
      arr.push(newJob);
    }

    setRecentJobs(arr);
    console.log(getRecentJobs());
  };

  const getRecentJobs = () => {
    const storedJobs = localStorage.getItem("myJobs");
    if (storedJobs) {
      return JSON.parse(storedJobs);
    }
    return [];
  };

  return (
    <div className="max-w-[100%]">
      <div className="bg-[#f7f7f7] rounded-md px-8 pt-5 pb-2 shadow-sm">
        <JobCardInformation job={job} />
        <div className="flex flex-row md:flex-col lg:flex-row gap-4 items-end lg:items-end md:items-start mt-5">
          <div className="flex gap-2">
            <JobBadge badgeType={job.employmentType} />
            <JobBadge badgeType={job.compensationType} />
          </div>
          <JobPostedDate date={job.postDate} />
        </div>
        <div className="flex lg:flex-row flex-col gap-4 my-5">
          <Button
            onClick={handleButtonClick}
            className="lg:w-[50%] w-full"
            fontWeight="normal"
            variant="outline"
            borderColor="black"
          >
            See More
          </Button>
          <Button
            onClick={handleButtonClick}
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
