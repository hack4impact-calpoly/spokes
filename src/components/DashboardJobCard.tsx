"use client";

import { Button } from "@chakra-ui/react";
import { IJob } from "@/database/jobSchema";
import { timeAgo } from "@/lib/utils";

interface DashboardJobCardProps {
  job: IJob;
  isFirst?: boolean;
  isLast?: boolean;
  isOnly?: boolean;
}

export default function DashboardJobCard({
  job,
  isFirst = false,
  isLast = false,
  isOnly = false,
}: DashboardJobCardProps) {
  const getBorderRadius = () => {
    if (isOnly) return "rounded-md";
    if (isFirst) return "rounded-t-md";
    if (isLast) return "rounded-b-md";
    return "";
  };

  const getBorderStyle = () => {
    if (isOnly) return "border border-gray-300";
    if (isFirst) return "border border-gray-300 border-b-0";
    if (isLast) return "border border-gray-300";
    return "border-b border-gray-300";
  };

  const renderJobStatusInfo = () => {
    switch (job.jobStatus) {
      case "Live":
        return (
          <>
            <p className="text-black text-sm">
              Posted on {job.postDate.toLocaleDateString()}{" "}
              {job.approvedDate && (
                <span className="text-gray-500">(Updated on {job.approvedDate.toLocaleDateString()})</span>
              )}
            </p>
            <p className="text-red-500 text-sm">
              Expires on {new Date(job.postDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </>
        );
      case "Pending":
        return (
          <p className="text-black text-sm">
            Submitted on {job.postDate.toLocaleDateString()}{" "}
            <span className="text-gray-500">({timeAgo(job.postDate)})</span>
          </p>
        );
      case "Expired":
        return (
          <p className="text-red-500 text-sm">
            Expired on {job.postDate.toLocaleDateString()} ({timeAgo(job.postDate)})
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`p-4 md:p-6 lg:p-8 ${getBorderStyle()} ${getBorderRadius()}`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-2">
        <div className="w-full md:flex-1">
          <h1 className="text-xl font-bold mb-1">{job.title}</h1>
          {renderJobStatusInfo()}
        </div>
        <div className="w-full md:flex-1 flex justify-start md:justify-center">
          {/* Commented Out Tags In Case Needed in Future */}
          {/* <div className="flex flex-wrap gap-2 md:gap-4">
            <div className="bg-blue-200 text-sm text-gray-500 border-[1px] border-gray-300 rounded-full px-3 md:px-5 py-1 md:py-2">
              tag 1
            </div>
            <div className="bg-green-100 text-sm text-gray-500 border-[1px] border-gray-300 rounded-full px-3 md:px-5 py-1 md:py-2">
              tag 2
            </div>
            <div className="bg-red-100 text-sm text-gray-500 border-[1px] border-gray-300 rounded-full px-3 md:px-5 py-1 md:py-2">
              tag 3
            </div>
          </div> */}
        </div>
        <div className="w-full md:flex-1 flex justify-start md:justify-end gap-2 md:gap-4 items-center">
          {job.jobStatus === "Expired" && (
            <Button
              className="bg-green-700 text-white text-sm md:text-base"
              fontWeight="normal"
              textColor="white"
              variant="outline"
              rounded="lg"
              borderColor="transparent"
              size={{ base: "sm", md: "md" }}
            >
              Renew
            </Button>
          )}
          <Button
            className="bg-[#045F87] text-white text-sm md:text-base"
            fontWeight="normal"
            textColor="white"
            variant="outline"
            rounded="lg"
            borderColor="transparent"
            size={{ base: "sm", md: "md" }}
          >
            Manage Post
          </Button>
        </div>
      </div>
    </div>
  );
}
