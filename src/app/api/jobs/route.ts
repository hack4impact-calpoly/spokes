import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import { IJob } from "@/database/jobSchema";
import Job from "@/database/jobSchema";

/**
 * PUT API route
 * accepts a job object and updates the job in the database
 * @returns {message: string}
 */
export async function PUT(request: Request) {
  await connectDB();

  // Get the job object from the request body
  const { job }: { job: IJob } = await request.json();

  // Validate the job object
  if (
    !job ||
    !job.organizationName ||
    !job.organizationIndustry ||
    !job.title ||
    !job.postDate ||
    !job.expireDate ||
    !job.jobDescription ||
    !job.employmentType ||
    !job.compensationType ||
    !job.url ||
    !job._id
  ) {
    return NextResponse.json({ message: "Invalid job provided" }, { status: 400 });
  }

  // Add job to database
  const res = await Job.updateOne({ _id: job._id }, job);
  if (!res) {
    return NextResponse.json({ message: "Error updating job" }, { status: 500 });
  } else {
    return NextResponse.json({ message: "Hello from the API!" });
  }
}
