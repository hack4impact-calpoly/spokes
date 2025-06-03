"use client";
import { IJob } from "@/database/jobSchema";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { OrgCard } from "@/components/JobCard/OrgCard";
import OrgCardSkeleton from "@/components/JobCard/OrgCardSkeleton";
import { isMoreThanThirtyDaysAgo } from "@/lib/utils";
import MembershipBadge from "@/components/MembershipBadge";

type DashboardProps = {
  organizationName: string;
  membershipStatus: boolean;
};

export default function DashboardPage({ organizationName, membershipStatus }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [userJobs, setUserJobs] = useState<IJob[]>([]);
  const { user, isLoaded } = useUser();
  // Fetch jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get user id
        const clerkUserId = user?.id;

        // Get user's postedJobs
        const res = await fetch(`/api/userjobs?userId=${clerkUserId}`);
        const jobs = await res.json();

        if (!res.ok) throw new Error(jobs.error || "Unknown error");

        setUserJobs(jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchData();
    }
  }, [user, isLoaded]);

  const handleJobRenewed = (renewedJob: IJob) => {
    setUserJobs((prevJobs) => {
      // Update the job in the array
      const updatedJobs = prevJobs.map((job) => (job._id === renewedJob._id ? renewedJob : job));
      return updatedJobs;
    });
  };

  if (loading) {
    return (
      <div className="w-full relative">
        {/* Membership Badge */}
        <div className="absolute top-4 right-8 md:right-16 lg:right-20">
          <MembershipBadge isMember={membershipStatus} skeleton={true} />
        </div>

        <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
          <div className="flex flex-col gap-24 mb-20">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-[#045F87] rounded-full"></div>
                <h1 className="text-3xl font-semibold tracking-tight">{organizationName} Dashboard</h1>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col mb-12">
                  <div className="text-2xl font-semibold mb-4">Live Applications</div>
                  <OrgCardSkeleton count={2} type="multi" />
                </div>
                <div className="flex flex-col mb-12">
                  <div className="text-2xl font-semibold mb-4">Pending Applications</div>
                  <OrgCardSkeleton count={1} type="single" />
                </div>
                <div className="flex flex-col mb-12">
                  <div className="text-2xl font-semibold mb-4">Expired Applications</div>
                  <OrgCardSkeleton count={1} type="single" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userJobs.length === 0) {
    return (
      <div className="w-full relative">
        {/* Membership Badge */}
        <div className="hidden sm:block absolute top-4 right-8 md:right-16 lg:right-20">
          <MembershipBadge isMember={membershipStatus} />
        </div>

        <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
          <div className="flex flex-col gap-24 mb-20">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-[#045F87] rounded-full"></div>
                <h1 className="text-3xl font-semibold tracking-tight">{organizationName} Dashboard</h1>
              </div>

              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <svg
                      className="w-24 h-24 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Job Listings Yet</h2>
                  <p className="text-gray-600 mb-8">
                    Start connecting with talented individuals by posting your first job opportunity. Share your mission
                    and find the perfect candidates to join your organization.
                  </p>
                  <Link
                    href="/jobform"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#045F87] hover:bg-[#034a6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#045F87] transition-colors duration-200"
                  >
                    Post Your First Job
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const liveJobs = userJobs.filter(
    (job) => job.jobStatus.toLowerCase() === "approved" && !isMoreThanThirtyDaysAgo(job.approvedDate),
  );

  const pendingJobs = userJobs.filter(
    (job) => job.jobStatus.toLowerCase() === "pending" || job.jobStatus.toLowerCase() === "rejected",
  );

  // Filter expired jobs by if the approval date is greater than 30 days ago, this does not check for expired status
  const expiredJobs = userJobs.filter((job) => isMoreThanThirtyDaysAgo(job.approvedDate));

  return (
    <div className="w-full relative">
      {/* Membership Badge */}
      <div className="hidden sm:block absolute top-4 right-8 md:right-16 lg:right-20">
        <MembershipBadge isMember={membershipStatus} />
      </div>

      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
        <div className="flex flex-col gap-24 mb-20">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-[#045F87] rounded-full"></div>
              <h1 className="text-3xl font-semibold tracking-tight">{organizationName} Dashboard</h1>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col mb-12">
                <div className="text-2xl font-semibold mb-4">Live Applications</div>
                <div className="flex flex-col gap-4">
                  {liveJobs.length > 0 ? (
                    liveJobs.map((job, index) => (
                      <OrgCard key={index} job={job} types={["posted", "updated", "expires"]} />
                    ))
                  ) : (
                    <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500">
                      No live applications available
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col mb-12">
                <div className="text-2xl font-semibold mb-4">Pending Applications</div>
                <div className="flex flex-col gap-4">
                  {pendingJobs.length > 0 ? (
                    pendingJobs.map((job, index) => <OrgCard key={index} job={job} types={["submitted"]} />)
                  ) : (
                    <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500">
                      No pending applications available
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col mb-12">
                <div className="text-2xl font-semibold mb-4">Expired Applications</div>
                <div className="flex flex-col gap-4">
                  {expiredJobs.length > 0 ? (
                    expiredJobs.map((job, index) => (
                      <OrgCard key={index} job={job} types={["expired"]} onJobRenewed={handleJobRenewed} />
                    ))
                  ) : (
                    <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500">
                      No expired applications available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
