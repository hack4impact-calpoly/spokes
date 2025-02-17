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
    // page defaults to 1, limit to 10 jobs if not specified
    // example path: /api/jobs?page=2&limit=10
    // const page = parseInt(searchParams.get("page") || "1", 1);
    // const limit = parseInt(searchParams.get("limit") || "12", 12);
    // const skip = (page - 1) * limit;

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "10", 10), 1);
    const skip = (page - 1) * limit; // This will always be >= 0

    // Filter parameters
    const employmentFilters = searchParams.getAll("employmentType");
    const compensationFilters = searchParams.getAll("compensationType");

    // Normalize filter values to match document values
    const normalizeEmployment = (value: string) => {
      switch (value.toLowerCase()) {
        case "Full-time":
          return "full-Time";
        case "Part-time":
          return "part-time";
        default:
          return value;
      }
    };

    const normalizeCompensation = (value: string) => {
      switch (value.toLowerCase()) {
        case "Paid":
          return "paid";
        case "Volunteer":
          return "volunteer";
        default:
          return value;
      }
    };

    // Build the filter object dynamically
    const filter: any = {};

    if (employmentFilters.length > 0) {
      filter.employmentType = {
        $in: employmentFilters.map(normalizeEmployment),
      };
    }

    if (compensationFilters.length > 0) {
      filter.compensationType = {
        $in: compensationFilters.map(normalizeCompensation),
      };
    }

    // Fetch jobs with filters, sorting, and pagination
    const jobs = await Job.find(filter).sort({ postDate: -1 }).skip(skip).limit(limit);
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const jobData = await request.json();
    console.log("Job data", jobData);
    if (
      !jobData ||
      !jobData.organizationName ||
      !jobData.organizationIndustry ||
      !jobData.title ||
      !jobData.postDate ||
      !jobData.employmentType ||
      !jobData.compensationType ||
      !jobData.jobStatus ||
      !jobData.detailURL
    ) {
      return NextResponse.json({ message: "Invalid job input" }, { status: 400 });
    }
    const newJob = await Job.create(jobData);
    return NextResponse.json({ message: "Job posted succesfully!", job: newJob }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Could not submit job ", error }, { status: 500 });
  }
}
