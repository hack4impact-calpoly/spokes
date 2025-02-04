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

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    // page defaults to 1, limit to 10 jobs if not specified
    // example path: /api/jobs?page=2&limit=10
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const jobs = await Job.find().sort({ postDate: -1 }).skip(skip).limit(limit);

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const jobData: IJob = await req.json();
    console.log(jobData);
    const newJob = await new Job(jobData).save();
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create job." }, { status: 500 });
  }
}
