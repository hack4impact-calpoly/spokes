import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/database/jobSchema";
/**
 * Example GET API route
 * @returns {message: string}
 */
export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find();
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {
      organizationName,
      organizationIndustry,
      title,
      postDate,
      expireDate,
      jobDescription,
      employmentType,
      compensationType,
      jobStatus,
      url,
    } = await req.json();
    const newJob = await new Job({
      organizationName,
      organizationIndustry,
      title,
      postDate,
      expireDate,
      jobDescription,
      employmentType,
      compensationType,
      jobStatus,
      url,
    }).save();
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
