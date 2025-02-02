"use client";
import { useState, useEffect } from "react";
import ChakraCarousel from "@/components/ChakraCarousel/carousel";
import AdminJobCard from "@/components/JobCard/AdminCard";
import JobGrid from "@/components/JobGrid";
import { Loader } from "@/components/Loader";
import { IJob } from "@/database/jobSchema";
import { Flex } from "@chakra-ui/react";

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

  return (
    <div className="w-full">
      <div className="mt-20 px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
        <div className="flex flex-col gap-16 mb-20">
          {/* Incoming Applications with Carousel using AdminJobCard */}
          <div className="flex flex-col gap-8">
            <div className="text-2xl font-semibold">Incoming Applications</div>
            {incomingJobData ? (
              <ChakraCarousel gap={25}>
                {incomingJobData.map((job) => (
                  <Flex
                    key={job._id}
                    justifyContent="space-between"
                    flexDirection="column"
                    overflow="hidden"
                    color="gray.300"
                    bg="base.d100"
                    rounded={5}
                    flex={1}
                  >
                    <AdminJobCard key={job._id} job={job} />
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

          {/* Live Applications rendered as a grid */}
          <div className="flex flex-col gap-8">
            <div className="text-2xl font-semibold">Live Applications</div>
            {liveJobData ? (
              <JobGrid jobs={liveJobData} isAdmin={true} />
            ) : (
              <Loader
                size="md"
                label="Loading Jobs..."
                className="mt-8 grow flex flex-col gap-6 justify-center items-center"
              />
            )}
          </div>

          {/* Complete Applications rendered as a grid */}
          <div className="flex flex-col gap-8">
            <div className="text-2xl font-semibold">Complete Applications</div>
            {completeJobData ? (
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
