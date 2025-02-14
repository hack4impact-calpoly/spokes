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

// no filters: GET /api/jobs?page=1&limit=10
// filter by employment type: GET /api/jobs?employmentType=full-time&employment=part-time
// combine filters w/ pagination: GET /api/jobs?employmentType=full-time&compensationType=paid&page=2&limit=10
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 12);
    const skip = (page - 1) * limit;

    // Filter parameters
    const employmentFilters = searchParams.getAll("employmentType");
    const compensationFilters = searchParams.getAll("compensationType");

    // Build the filter object dynamically
    const filter: any = {};

    if (employmentFilters.length > 0) {
      filter.employmentType = { $in: employmentFilters };
    }

    if (compensationFilters.length > 0) {
      filter.compensationType = { $in: compensationFilters };
    }

    // Fetch jobs with filters, sorting, and pagination
    const jobs = await Job.find(filter)
      .sort({ postDate: -1 }) // Sort by postDate in descending order
      .skip(skip) // Skip items for pagination
      .limit(limit); // Limit the number of items per page

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
