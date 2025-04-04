"use client";

import { IJob } from "@/database/jobSchema";
import { useEffect, useRef, useState } from "react";

interface JobInformationProps {
  job: IJob;
}

export default function JobCardInformation({ job }: JobInformationProps) {
  const industriesRef = useRef<HTMLParagraphElement>(null);
  const [isMultiLine, setIsMultiLine] = useState(false);

  useEffect(() => {
    if (industriesRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(industriesRef.current).lineHeight);
      const contentHeight = industriesRef.current.scrollHeight;
      setIsMultiLine(contentHeight > lineHeight * 1.5);
    }
  }, [job.organizationIndustry]);

  return (
    <>
      <div className="mb-2">
        <h1 className="text-2xl font-bold truncate">{job.title}</h1>
        <p className="text-gray-700 font-semibold truncate">{job.organizationName}</p>
      </div>
      <div className={`${isMultiLine ? "mb-2" : "pt-2 mb-6"}`}>
        <p ref={industriesRef} className="text-gray-700 italic">
          {job.organizationIndustry.join(", ")}
        </p>
      </div>
      <div className="mb-4">
        <p className="text-gray-700 overflow:s h-max-[150px] h-[90px] overflow-scroll no-scrollbar">
          {job.jobDescription}
        </p>
      </div>
    </>
  );
}
