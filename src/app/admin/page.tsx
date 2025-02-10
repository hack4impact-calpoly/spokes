"use client";
import { useState, useEffect } from "react";
import ChakraCarousel from "@/components/ChakraCarousel/carousel";
import AdminJobCard from "@/components/JobCard/AdminCard";
import JobGrid from "@/components/JobGrid";
import { Loader } from "@/components/Loader";
import { IJob } from "@/database/jobSchema";
import { Flex } from "@chakra-ui/react";
import { twMerge } from "tailwind-merge";

// Helper function to filter the job data into the three categories
function filterJobs(jobs: IJob[], filterBy: "pending" | "approved" | "rejected") {
  return jobs.filter((job) => job.jobStatus === filterBy);
}

export default function AdminJobs() {
  const [incomingJobData, setIncomingJobData] = useState<null | IJob[]>(null);
  const [liveJobData, setLiveJobData] = useState<null | IJob[]>(null);
  const [completeJobData, setCompleteJobData] = useState<null | IJob[]>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/jobs");
      const result = await response.json();
      setIncomingJobData(filterJobs(result, "pending"));
      setLiveJobData(filterJobs(result, "approved"));
      setCompleteJobData(filterJobs(result, "rejected"));
    };

    fetchData();
  }, []);

  const [tab, setTab] = useState(1);

  return (
    <div className="w-full">
      <div className="mt-20 px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
        <div className="flex flex-col gap-24 mb-20">
          {/* Incoming Applications with Carousel using AdminJobCard */}
          <div className="flex flex-col gap-8">
            <div className="text-3xl font-semibold">Incoming Applications</div>
            {incomingJobData ? (
              <ChakraCarousel gap={20}>
                {incomingJobData.map((job) => (
                  <Flex
                    key={job._id}
                    justifyContent="space-between"
                    flexDirection="column"
                    overflow="hidden"
                    rounded={5}
                    flex={1}
                  >
                    <AdminJobCard job={job} />
                  </Flex>
                ))}
              </ChakraCarousel>
            ) : (
              <Loader
                size="md"
                label="Loading Jobs..."
                className="mt-8 grow flex flex-col gap-6 justify-center items-center"
              />
            )}
          </div>

          {/* Live/Completed Applications rendered as a grid */}
          <div className="flex flex-col gap-8">
            <div className="flex gap-8 w-full">
              <div
                className={twMerge(
                  "text-black text-3xl text-center cursor-pointer select-none",
                  tab == 1 ? "font-semibold" : "font-normal text-[#C3C3C3]",
                )}
                onClick={() => {
                  // Later add functionally to display listings
                  setTab(1);
                }}
              >
                Live Applications
              </div>
              <div
                className={twMerge(
                  "text-black text-3xl text-center cursor-pointer select-none",
                  tab == 2 ? "font-semibold" : "font-normal text-[#C3C3C3]",
                )}
                onClick={() => {
                  // Later add functionally to display listings
                  setTab(2);
                }}
              >
                Complete Applications
              </div>
            </div>
            {tab == 1 ? (
              liveJobData ? (
                <JobGrid jobs={liveJobData} isAdmin={true} />
              ) : (
                <Loader
                  size="md"
                  label="Loading Jobs..."
                  className="mt-8 grow flex flex-col gap-6 justify-center items-center"
                />
              )
            ) : completeJobData ? (
              <JobGrid jobs={completeJobData} isAdmin={true} />
            ) : (
              <Loader
                size="md"
                label="Loading Jobs..."
                className="mt-8 grow flex flex-col gap-6 justify-center items-center"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
