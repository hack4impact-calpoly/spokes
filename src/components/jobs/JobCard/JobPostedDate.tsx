import React from "react";
import { timeAgo } from "@/lib/utils";

export default function JobPostedDate({ date }: { date: string | Date }) {
  if (!date || isNaN(new Date(date).getTime())) {
    return <p>Invalid date</p>;
  }

  return <p className="text-sm text-gray-500 self-center">Posted {timeAgo(new Date(date))}</p>;
}
