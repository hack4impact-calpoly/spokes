import mongoose, { models, model, Schema } from "mongoose";

// The employment type for the job
export enum EmploymentType {
  partTime = "Part-Time",
  fullTime = "Full-Time",
  volunteer = "Volunteer",
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
  memberStatus: boolean;
  employmentType: string;
  compensationType: string;
  jobStatus: string;
  url: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

// Schema for the job object
const JobSchema = new Schema({
  organizationName: { type: String, required: true },
  organizationIndustry: { type: String, required: true },
  title: { type: String, required: true },
  postDate: { type: Date, required: true },
  expireDate: { type: Date, required: false, default: null },
  jobDescription: { type: String, required: true },
  memberStatus: { type: Boolean, required: true },
  employmentType: { type: String, enum: Object.values(EmploymentType), required: true },
  compensationType: { type: String, enum: Object.values(CompensationType), required: true },
  jobStatus: { type: String, enum: Object.values(JobStatus), required: true },
  url: { type: String, required: true },
  contactName: { type: String, required: false },
  contactPhone: { type: String, required: false },
  contactEmail: { type: String, required: false },
});

const Job = models.Job || model("Job", JobSchema);
export default Job;
