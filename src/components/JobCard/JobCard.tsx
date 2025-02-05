// import { Button } from "@chakra-ui/react";
// import { IJob } from "@/database/jobSchema";
// import JobBadge from "@/components/JobCard/JobBadge";
// import JobCardInformation from "@/components/JobCard/JobCardInformation";
// import JobPostedDate from "@/components/JobCard/JobPostedDate";
// import { useState, useEffect } from "react";
// import { get } from "http";

// interface JobCardProps {
//   job: IJob;
// }

// export default function JobCard({ job }: JobCardProps) {
//   const [recentJobs, setRecentJobs] = useState<string[]>(() => {
//     const storedJobs = localStorage.getItem("myJobs");
//     return storedJobs ? JSON.parse(storedJobs) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem("myJobs", JSON.stringify(recentJobs));
//   }, [recentJobs]);

//   // when user clicks apply it birngs them to a email with a custom email template
//   const handleApplyNowClick = () => {
//     // we first check if there is an actual URL, if so we bring the user there
//     if (job.applyNowURL) {
//       // window.location.href = job.applyNowURL;
//       window.open(job.applyNowURL, "_blank");

//       // custom emial template if no URL is present
//     } else {
//       const email = "jobposter@example.com"; // Dummy email, please replace with actual email
//       const subject = `Application for ${job.title}`;
//       const body = `Dear ${job.organizationName},%0D%0A%0D%0AI am interested in the ${job.title} position. Please find my application attached.%0D%0A%0D%0AThank you,%0D%0A[Your Name]`;
//       // window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
//       window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
//     }
//   };

//   return (
//     <div className="max-w-[100%]">
//       <div className="bg-[#f7f7f7] rounded-md px-8 pt-5 pb-2 shadow-sm">
//         <JobCardInformation job={job} />
//         <div className="flex flex-row md:flex-col lg:flex-row gap-4 items-end lg:items-end md:items-start mt-5">
//           <div className="flex gap-2">
//             <JobBadge badgeType={job.employmentType} />
//             <JobBadge badgeType={job.compensationType} />
//           </div>
//           <JobPostedDate date={job.postDate} />
//         </div>
//         <div className="flex lg:flex-row flex-col gap-4 my-5">
//           <Button
//             as="a"
//             href={job.detailURL}
//             className="lg:w-[50%] w-full"
//             fontWeight="normal"
//             variant="outline"
//             borderColor="black"
//           >
//             See More
//           </Button>
//           <Button
//             onClick={handleApplyNowClick}
//             className="lg:w-[50%] w-full"
//             fontWeight="normal"
//             variant="outline"
//             bg="black"
//             textColor="white"
//             _hover={{
//               bg: "gray.800",
//             }}
//           >
//             Apply Now
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Button } from "@chakra-ui/react";
import { IJob } from "@/database/jobSchema";
import JobBadge from "@/components/JobCard/JobBadge";
import JobCardInformation from "@/components/JobCard/JobCardInformation";
import JobPostedDate from "@/components/JobCard/JobPostedDate";
import { useState, useEffect } from "react";

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

  // when user clicks apply it brings them to an email with a custom email template
  const handleApplyNowClick = () => {
    // we first check if there is an actual URL, if so we bring the user there
    if (job.applyNowURL) {
      window.open(job.applyNowURL, "_blank");

      // custom email template if no URL is present
    } else {
      const email = "jobposter@example.com"; // Dummy email, please replace with actual email
      const subject = `Application for ${job.title}`;
      const body = `Dear ${job.organizationName},%0D%0A%0D%0AI am interested in the ${job.title} position. Please find my application attached.%0D%0A%0D%0AThank you,%0D%0A[Your Name]`;
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
    }
  };

  // when user clicks see more it opens the detail URL in a new tab
  const handleSeeMoreClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    window.open(job.detailURL, "_blank");
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
