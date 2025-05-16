"use client";
import { Box, Text } from "@chakra-ui/react";
import DashboardJobCard from "@/components/DashboardJobCard";
import connectDB from "@/database/db";
import User from "@/database/userSchema";
import Job from "@/database/jobSchema";
import { IJob } from "@/database/jobSchema";
import { Loader } from "@/components/Loader";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import JobConfirmationlModal from "@/components/JobConfirmationModal";
import Link from "next/link";
import { OrgCard } from "@/components/JobCard/OrgCard";

export default function DashboardPage() {
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
        if (!clerkUserId) throw new Error("User not authenticated");

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

    fetchData();
  }, [user?.id, isLoaded]);

  if (loading) {
    return (
      <div className="py-32">
        <Loader size="lg"></Loader>
      </div>
    );
  }

  if (userJobs.length === 0) {
    return (
      <div className="w-full h-full py-32 flex justify-center align-middle">
        <Link href="/jobform" className="text-3xl underline underline-offset-8 font-semibold select-none">
          Submit a new job listing
        </Link>
      </div>
    );
  }

  const liveJobs = userJobs.filter((job) => job.jobStatus.toLowerCase() === "approved");
  const pendingJobs = userJobs.filter((job) => job.jobStatus.toLowerCase() === "pending");
  const expiredJobs = userJobs.filter((job) => job.jobStatus.toLowerCase() === "expired");

  return (
    <div className="w-full">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
        <div className="flex flex-col gap-24 mb-20">
          <div className="flex flex-col gap-8">
            <div className="text-3xl font-semibold">Admin Dashboard</div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col mb-12">
                <div className="text-2xl font-semibold mb-4">Live Applications</div>
                <div className="flex flex-col gap-4">
                  {liveJobs.map((job, index) => (
                    <OrgCard key={index} job={job} types={["posted", "updated", "expires"]} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col mb-12">
                <div className="text-2xl font-semibold mb-4">Pending Applications</div>
                <div className="flex flex-col gap-4">
                  {pendingJobs.map((job, index) => (
                    <OrgCard key={index} job={job} types={["submitted"]} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col mb-12">
                <div className="text-2xl font-semibold mb-4">Expired Applications</div>
                <div className="flex flex-col gap-4">
                  {expiredJobs.map((job, index) => (
                    <OrgCard key={index} job={job} types={["expired"]} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
