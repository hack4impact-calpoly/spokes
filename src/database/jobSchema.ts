import mongoose, { Schema } from "mongoose";

// The employment type for the job
export enum EmploymentType {
  partTime = "part-time",
  fullTime = "full-time",
}

// The compensation type for the job
export enum CompensationType {
  paid = "paid",
  volunteer = "volunteer",
}

// The status of the job
export enum JobStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
}

// Interface for the job object
export interface IJob {
  _id: string;
  organizationName: string;
  organizationIndustry: string;
  title: string;
  postDate: Date;
  expireDate: Date;
  jobDescription: string;
  employmentType: string;
  compensationType: string;
  jobStatus: string;
  // url: string;
  detailUrl: string;
  applyNowUrl?: string; // applyNowUrl is optional
}

// Schema for the job object
const JobSchema = new Schema({
  organizationName: { type: String, required: true },
  organizationIndustry: { type: String, required: true },
  title: { type: String, required: true },
  postDate: { type: Date, required: true },
  expireDate: { type: Date, required: true },
  jobDescription: { type: String, required: true },
  employmentType: { type: String, enum: Object.values(EmploymentType), required: true },
  compensationType: { type: String, enum: Object.values(CompensationType), required: true },
  jobStatus: { type: String, enum: Object.values(JobStatus), required: true },
  url: { type: String, required: true },
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
