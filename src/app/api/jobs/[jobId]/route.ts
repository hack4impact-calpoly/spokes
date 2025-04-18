import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/database/jobSchema";
import { IJob } from "@/database/jobSchema";

export async function DELETE(_request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    await connectDB();
    const { jobId } = params;

    //Requires id
    if (!jobId) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    //Deleting based on _id
    const result = await Job.findByIdAndDelete(jobId);

    //if id not found
    if (!result) {
      return NextResponse.json({ error: "ID not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while deleting" }, { status: 500 });
  }
}

/**
 * PUT API route
 * accepts a job object and updates the job in the database
 * @returns {Promise<NextResponse>}
 */
export async function PUT(_request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    await connectDB();
    const { jobId } = params;

    const job: IJob = await _request.json();
    console.log("Received Job Data:", job);

    if (!jobId) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
    }

    if (!job.jobStatus) {
      return NextResponse.json({ message: "Job status is required" }, { status: 400 });
    }

    await Job.findByIdAndUpdate(jobId, job, { new: true }).orFail(new Error("Job not found"));
    return NextResponse.json({ message: "Job updated successfully" });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: "Error updating job: ", error }, { status: 500 });
  }
}

export async function GET(_request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    await connectDB();
    const { jobId } = params;

    console.log("Received jobId:", jobId);

    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Error fetching job" }, { status: 500 });
  }
}
