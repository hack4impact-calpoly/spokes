import React from "react";
import { IJob } from "@/database/jobSchema";

// Mock data, to be replaced
const mockJob: IJob = {
  _id: "67c9454b3929dd836c744b4f",
  organizationName: "Greenpeace",
  organizationIndustry: ["Community & Economic Development"],
  title: "Campaign Organizer",
  postDate: new Date("2025-03-06T06:48:01.998+00:00"),
  jobDescription: "A Campaign Organizer at Greenpeace mobilizes communities...",
  employmentType: "part-time",
  compensationType: "salary",
  jobStatus: "expired",
  contactName: "Test",
  contactEmail: "test@gmail.com",
  detailURL: "https://test.com",
  applyNowURL: "",
};
