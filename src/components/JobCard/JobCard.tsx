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

  // when user clicks apply it birngs them to a email with a custom email template
  const handleApplyNowClick = () => {
    // we first check if there is an actual URL, if so we bring the user there
    if (job.applyNowURL) {
      window.location.href = job.applyNowURL;

      // custom emial template if no URL is present
    } else {
      const email = "jobposter@example.com"; // Dummy email, please replace with actual email
      const subject = `Application for ${job.title}`;
      const body = `Dear ${job.organizationName},%0D%0A%0D%0AI am interested in the ${job.title} position. Please find my application attached.%0D%0A%0D%0AThank you,%0D%0A[Your Name]`;
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
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
            as="a"
            href={job.detailURL}
            className="lg:w-[50%] w-full"
            fontWeight="normal"
            variant="outline"
            borderColor="black"
          >
            See More
          </Button>
          <Button
            onClick={handleApplyNowClick}
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
