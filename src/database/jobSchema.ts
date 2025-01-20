import mongoose, { Schema } from "mongoose";

// Enum for the employment type and compensation type
export enum EmploymentType {
  partTime = "part-time",
  fullTime = "full time",
  volunteer = "volunteer",
}

export enum CompensationType {
  paid = "paid",
  nonPaid = "non-paid",
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
  employmentType: EmploymentType;
  compensationType: CompensationType;
  url: string;
}

// Schema for the job object
const JobSchema = new Schema({
  organizationName: { type: String, required: true },
  organizationIndustry: { type: String, required: true },
  title: { type: String, required: true },
  postDate: { type: Date, required: true },
  expireDate: { type: Date, required: true },
  jobDescription: { type: String, required: true },
  employmentType: { type: String, required: true, enum: Object.values(EmploymentType) },
  compensationType: { type: String, required: true, enum: Object.values(CompensationType) },
  url: { type: String, required: true },
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
