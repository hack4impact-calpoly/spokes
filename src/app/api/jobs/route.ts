import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { IJob } from "@/database/jobSchema";
import Job from "@/database/jobSchema";

/**
 * PUT API route
 * accepts a job object and updates the job in the database
 * @returns {Promise<NextResponse>}
 */
export async function PUT(request: Request) {
  try {
    await connectDB();

    const job: IJob = await request.json();

    await Job.findByIdAndUpdate(job._id, job, { new: true }).orFail(new Error("Job not found"));
    return NextResponse.json({ message: "Job updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Error updating job: ", error }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const jobs = await Job.find().sort({ postDate: -1 });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const jobData = await request.json();
    if (
      !jobData ||
      !jobData.organizationName ||
      !jobData.organizationIndustry ||
      !jobData.title ||
      !jobData.postDate ||
      !jobData.employmentType ||
      !jobData.compensationType ||
      !jobData.jobStatus ||
      !jobData.url
    ) {
      return NextResponse.json({ message: "Invalid job input" }, { status: 400 });
    }
    const newJob = await Job.create(jobData);
    return NextResponse.json({ message: "Job posted succesfully!", job: newJob }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Could not submit job ", error }, { status: 500 });
  }
}
