"use client";
import { useState, useEffect } from "react";
import JobGrid from "@/components/JobGrid";
import { IJob } from "@/database/jobSchema";
import { Loader } from "@/components/Loader";

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
      const incoming = filterJobs(result, "pending");
      const live = filterJobs(result, "approved");
      const complete = filterJobs(result, "rejected");
      setIncomingJobData(incoming);
      setLiveJobData(live);
      setCompleteJobData(complete);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="mt-20 px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
        <div className="flex flex-col gap-16 mb-20">
          {/* Incoming jobs use the carousel */}
          <JobSection jobs={incomingJobData} title="Incoming Applications" isCarousel />
          {/* Live and complete jobs use the standard grid */}
          <JobSection jobs={liveJobData} title="Live Applications" />
          <JobSection jobs={completeJobData} title="Complete Applications" />
        </div>
      </div>
    </div>
  );
}

interface JobSectionProps {
  title: string;
  jobs?: IJob[] | null;
  isCarousel?: boolean;
}

const JobSection = ({ title, jobs, isCarousel }: JobSectionProps) => {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {jobs ? (
        isCarousel ? (
          <JobCarousel jobs={jobs} />
        ) : (
          <JobGrid jobs={jobs} isAdmin={true} />
        )
      ) : (
        <Loader
          size="md"
          label="Loading Jobs..."
          className="mt-8 grow flex flex-col gap-6 justify-center items-center"
        />
      )}
    </div>
  );
};

// here is the carouel functionality
// it recieves a jobs prop which is an array of job objects
interface JobCarouselProps {
  jobs: IJob[];
}

const JobCarousel = ({ jobs }: JobCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Default to showing 2 items on desktop
  const [itemsToShow, setItemsToShow] = useState(2);

  // Adjust the number of items based on the viewport width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else {
        setItemsToShow(2);
      }
    };

    // Set the initial number of items
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure the currentIndex remains valid if the jobs list or itemsToShow change
  useEffect(() => {
    if (currentIndex > jobs.length - itemsToShow) {
      setCurrentIndex(Math.max(0, jobs.length - itemsToShow));
    }
  }, [itemsToShow, jobs, currentIndex]);

  const visibleJobs = jobs.slice(currentIndex, currentIndex + itemsToShow);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + itemsToShow < jobs.length;

  const handlePrev = () => {
    setCurrentIndex(Math.max(currentIndex - itemsToShow, 0));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(currentIndex + itemsToShow, jobs.length - itemsToShow));
  };

  return (
    <div className="relative">
      {/* Render the currently visible jobs */}
      <JobGrid jobs={visibleJobs} isAdmin={true} />
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
