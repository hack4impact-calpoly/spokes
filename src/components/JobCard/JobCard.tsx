import { Button } from "@chakra-ui/react";
import { IJob } from "@/database/jobSchema";
import JobBadge from "@/components/JobCard/JobBadge";
import JobCardInformation from "@/components/JobCard/JobCardInformation";
import JobPostedDate from "@/components/JobCard/JobPostedDate";
import { useState, useEffect, useCallback, memo } from "react";

interface JobCardProps {
  job: IJob;
  innerRef?: (node?: Element | null | undefined) => void;
  onJobView?: (job: IJob) => void;
}

function JobCard({ job, onJobView, innerRef }: JobCardProps) {
  const [recentJobs, setRecentJobs] = useState<string[]>(() => {
    const storedJobs = localStorage.getItem("myJobs");
    return storedJobs ? JSON.parse(storedJobs) : [];
  });

  useEffect(() => {
    localStorage.setItem("myJobs", JSON.stringify(recentJobs));
  }, [recentJobs]);

  const updateLocalStorage = useCallback(() => {
    const newJob = job._id;
    if (!recentJobs.includes(newJob)) {
      const updatedJobs = [...recentJobs, newJob];
      setRecentJobs(updatedJobs);
      localStorage.setItem("myJobs", JSON.stringify(updatedJobs));
      if (onJobView) {
        onJobView(job);
      }
    }
  }, [job, onJobView, recentJobs]);

  const handleApplyNowClick = useCallback(() => {
    updateLocalStorage();
    if (job.applyNowURL) {
      window.open(job.applyNowURL, "_blank");
    } else {
      const email = job.contactEmail;
      const subject = `Application for ${job.title}`;
      const body = `Dear ${job.organizationName},%0D%0A%0D%0AI am interested in the ${job.title} position. Please find my application attached.%0D%0A%0D%0AThank you,%0D%0A[Your Name]`;
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
  }, [job, updateLocalStorage]);

  const handleSeeMoreClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      updateLocalStorage();
      window.open(job.detailURL, "_blank");
    },
    [job.detailURL, updateLocalStorage],
  );

  return (
    <div className="max-w-[100%]" ref={innerRef}>
      <div
        className={`bg-[#f7f7f7] rounded-md px-8 pt-5 pb-2 shadow-sm h-full flex flex-col ${job.memberJob ? "shimmer-border-smooth" : ""}`}
      >
        <JobCardInformation job={job} />
        <div className="flex-grow"></div> {/* variable padding */}
        <div className="flex flex-row md:flex-col lg:flex-row gap-4 items-end lg:items-end md:items-start mt-5 max-[400px]:flex-col max-[400px]:items-start">
          <div className="flex gap-2">
            <JobBadge badgeType={job.employmentType} />
            {job.compensationType && <JobBadge badgeType={job.compensationType} />}
          </div>
          <JobPostedDate date={job.postDate} />
        </div>
        <div className="flex lg:flex-row flex-col gap-4 my-5">
          <Button
            onClick={handleSeeMoreClick}
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

export default memo(JobCard);
