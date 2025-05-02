import { Box, Text } from "@chakra-ui/react";
import DashboardJobCard from "@/components/DashboardJobCard";
import { IJob } from "@/database/jobSchema";
import { getAuthWithRole } from "@/lib/auth";

export default async function DashboardPage() {
  const { userId, role } = await getAuthWithRole();
  const testJobs: IJob[] = [
    {
      _id: "1",
      organizationName: "Organization 1",
      organizationIndustry: ["Industry 1"],
      title: "Job 1",
      postDate: new Date("2025-02-04"),
      modifiedDate: new Date("2025-02-04"),
      approvedDate: new Date("2025-03-04"),
      jobDescription: "Job 1 description",
      employmentType: "Full-time",
      compensationType: "Salary",
      jobStatus: "Live",
      detailURL: "https://www.google.com",
      applyNowURL: "https://www.google.com",
    },
    {
      _id: "2",
      organizationName: "Organization 2",
      organizationIndustry: ["Industry 2"],
      title: "Job 2",
      postDate: new Date("2025-02-04"),
      modifiedDate: new Date("2025-02-04"),
      approvedDate: new Date("2025-03-04"),
      jobDescription: "Job 2 description",
      employmentType: "Full-time",
      compensationType: "Salary",
      jobStatus: "Live",
      detailURL: "https://www.google.com",
      applyNowURL: "https://www.google.com",
    },
    {
      _id: "3",
      organizationName: "Organization 3",
      organizationIndustry: ["Industry 3"],
      title: "Job 3",
      postDate: new Date("2025-02-04"),
      modifiedDate: new Date("2025-02-04"),
      jobDescription: "Job 3 description",
      employmentType: "Full-time",
      compensationType: "Salary",
      jobStatus: "Pending",
      detailURL: "https://www.google.com",
      applyNowURL: "https://www.google.com",
    },
    {
      _id: "4",
      organizationName: "Organization 4",
      organizationIndustry: ["Industry 4"],
      title: "Job 4",
      postDate: new Date("2025-02-04"),
      modifiedDate: new Date("2025-02-04"),
      approvedDate: new Date("2025-03-04"),
      jobDescription: "Job 4 description",
      employmentType: "Full-time",
      compensationType: "Salary",
      jobStatus: "Expired",
      detailURL: "https://www.google.com",
      applyNowURL: "https://www.google.com",
    },
    {
      _id: "5",
      organizationName: "Organization 5",
      organizationIndustry: ["Industry 5"],
      title: "Job 5",
      postDate: new Date("2025-02-04"),
      modifiedDate: new Date("2025-02-04"),
      approvedDate: new Date("2025-03-04"),
      jobDescription: "Job 5 description",
      employmentType: "Full-time",
      compensationType: "Salary",
      jobStatus: "Expired",
      detailURL: "https://www.google.com",
      applyNowURL: "https://www.google.com",
    },
  ];

  const liveJobs = testJobs.filter((job) => job.jobStatus === "Live");
  const pendingJobs = testJobs.filter((job) => job.jobStatus === "Pending");
  const expiredJobs = testJobs.filter((job) => job.jobStatus === "Expired");

  return (
    <div className="w-full">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
        <div className="flex flex-col gap-24 mb-20">
          <div className="flex flex-col gap-8">
            <div className="text-3xl font-semibold">Admin Dashboard</div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col mb-12">
                <div className="text-2xl font-semibold mb-4">Live Applications</div>
                {liveJobs.map((job, index) => (
                  <DashboardJobCard
                    key={index}
                    job={job}
                    isFirst={index === 0}
                    isLast={index === liveJobs.length - 1}
                    isOnly={liveJobs.length === 1}
                  />
                ))}
              </div>
              <div className="flex flex-col mb-12">
                <div className="text-2xl font-semibold mb-4">Pending Applications</div>
                {pendingJobs.map((job, index) => (
                  <DashboardJobCard
                    key={index}
                    job={job}
                    isFirst={index === 0}
                    isLast={index === pendingJobs.length - 1}
                    isOnly={pendingJobs.length === 1}
                  />
                ))}
              </div>
              <div className="flex flex-col mb-12">
                <div className="text-2xl font-semibold mb-4">Expired Applications</div>
                {expiredJobs.map((job, index) => (
                  <DashboardJobCard
                    key={index}
                    job={job}
                    isFirst={index === 0}
                    isLast={index === expiredJobs.length - 1}
                    isOnly={expiredJobs.length === 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
