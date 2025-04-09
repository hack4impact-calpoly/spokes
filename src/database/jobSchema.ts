import mongoose, { models, model, Schema } from "mongoose";

// The employment type for the job
export enum EmploymentType {
  partTime = "part-time",
  fullTime = "full-time",
  volunteer = "volunteer",
}

// The compensation type for the job
export enum CompensationType {
  salary = "salary",
  hourly = "hourly",
  contract = "contract",
}

// The status of the job
export enum JobStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
  expired = "expired",
}

// Interface for job object
export interface IJob {
  _id: string;
  organizationName: string;
  organizationIndustry: string[];
  title: string;
  postDate: Date;
  approvedDate?: Date;
  jobDescription: string;
  employmentType: string;
  compensationType?: string;
  jobStatus: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  detailURL: string;
  applyNowURL?: string;
}

// Schema for the job object
const JobSchema = new Schema({
  organizationName: { type: String, required: true },
  organizationIndustry: { type: Array<String>, required: true },
  title: { type: String, required: true },
  postDate: { type: Date, required: true },
  approvedDate: { type: Date, required: false },
  jobDescription: { type: String, required: true },
  employmentType: { type: String, enum: Object.values(EmploymentType), required: true },
  compensationType: { type: String, enum: Object.values(CompensationType), required: false },
  jobStatus: { type: String, enum: Object.values(JobStatus), required: true },
  contactName: { type: String, required: false },
  contactPhone: { type: String, required: false },
  contactEmail: { type: String, required: false },
  detailURL: { type: String, required: true },
  applyNowURL: { type: String }, // this field is optional
});

const Job = models.Job || model("Job", JobSchema);
export default Job;
