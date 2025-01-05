import { Schema } from "mongoose";

interface Job {
  title: string;
  postDate: string;
  organization: string;
  jobDescription: string;
  employmentType: string;
  compensationType: string;
  URL: string;
}

export const jobSchema = new Schema<Job>({
  title: String,
  postDate: String,
  organization: String,
  jobDescription: String,
  employmentType: String,
  compensationType: String,
  URL: String,
});
