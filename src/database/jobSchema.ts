import mongoose, { Schema } from "mongoose";

// Enum for the employment type and compensation type
export enum EmploymentType {
  PART_TIME = "part-time",
  FULL_TIME = "full time",
  VOLUNTEER = "volunteer",
}

export enum CompensationType {
  PAID = "paid",
  NON_PAID = "non-paid",
}

// Interface for the job object
export interface IJob {
  organization_name: string;
  organization_industry: string;
  title: string;
  post_date: Date;
  expire_date: Date;
  job_description: string;
  employment_type: EmploymentType;
  compensation_type: CompensationType;
  url: string;
}

// Schema for the job object
const JobSchema = new Schema({
  organization_name: { type: String, required: true },
  organization_industry: { type: String, required: true },
  title: { type: String, required: true },
  post_date: { type: Date, required: true },
  expire_date: { type: Date, required: true },
  job_description: { type: String, required: true },
  employment_type: { type: EmploymentType, required: true },
  compensation_type: { type: CompensationType, required: true },
  url: { type: String, required: true },
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
